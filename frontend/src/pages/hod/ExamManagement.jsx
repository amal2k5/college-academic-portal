import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { Search, ChevronDown, RefreshCw, AlertCircle, Calendar, GraduationCap, X, Clock } from "lucide-react";

import examService from "../../services/examService";
import subjectService from "../../services/subjectService";
import PageHeader from "../../components/common/PageHeader";
import ConfirmModal from "../../components/common/ConfirmModal";
import ExamTable from "../../components/exams/ExamTable";
import ExamForm, { EXAM_TYPES } from "../../components/exams/ExamForm";
import ExamDetailsModal from "../../components/exams/ExamDetailsModal";
import { BookOpen, CheckCircle2 } from "lucide-react";

// ── Animation variants ──────────────────────────────────────────────────────────
const ease = [0.22, 1, 0.36, 1];
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.04 } },
};

// ── Loading Skeleton ────────────────────────────────────────────────────────────
function ExamSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-800/40 pb-6">
        <div>
          <div className="w-48 h-8 bg-neutral-800/50 rounded-xl mb-2" />
          <div className="w-64 h-4 bg-neutral-800/50 rounded-xl" />
        </div>
        <div className="w-36 h-10 bg-neutral-800/50 rounded-xl" />
      </div>
      {/* Toolbar */}
      <div className="flex gap-3">
        <div className="flex-1 h-10 bg-neutral-800/50 rounded-xl" />
        <div className="w-40 h-10 bg-neutral-800/50 rounded-xl" />
      </div>
      {/* Table rows */}
      <div className="bg-neutral-900/50 rounded-xl border border-neutral-800/50 overflow-hidden">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-6 px-5 py-4 border-b border-neutral-800/30 last:border-0">
            <div className="h-4 bg-neutral-800 rounded-lg w-1/4" />
            <div className="h-4 bg-neutral-800 rounded-lg w-16" />
            <div className="h-4 bg-neutral-800 rounded-lg w-20" />
            <div className="h-5 bg-neutral-800 rounded-lg w-16" />
            <div className="h-4 bg-neutral-800 rounded-lg w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function ExamManagement() {
  // ── Data state ──────────────────────────────────────────────────────────────
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // ── UI state ────────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ── Modals state ────────────────────────────────────────────────────────────
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Filter state ────────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // ── Load data ───────────────────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [examsData, subjectsData] = await Promise.all([
        examService.getExams(),
        subjectService.getSubjects(),
      ]);
      setExams(Array.isArray(examsData) ? examsData : []);
      setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
    } catch (err) {
      console.error("Failed to load data:", err);
      setError("Failed to load exams. Please try again.");
      toast.error("Failed to load exams.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── Filtered exams ──────────────────────────────────────────────────────────
  const filteredExams = useMemo(() => {
    let list = exams;

    if (filterSubject) {
      list = list.filter((e) => String(e.subject) === String(filterSubject));
    }
    if (filterType) {
      list = list.filter((e) => e.exam_type === filterType);
    }
    if (filterDate) {
      list = list.filter((e) => e.date === filterDate);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (e) =>
          (e.subject_name || "").toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q)
      );
    }

    return list;
  }, [exams, search, filterSubject, filterType, filterDate]);

  // ── Stats Calculation ───────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const total = exams.length;
    let upcoming = 0;
    const uniqueSubjects = new Set();

    exams.forEach(e => {
      uniqueSubjects.add(e.subject);
      const d = new Date(e.date);
      d.setHours(0, 0, 0, 0);
      if (d >= today) upcoming++;
    });

    return {
      total,
      upcoming,
      completed: total - upcoming,
      subjects: uniqueSubjects.size
    };
  }, [exams]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleOpenCreate = () => {
    setEditTarget(null);
    setShowForm(true);
  };

  const handleOpenEdit = (exam) => {
    setEditTarget(exam);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    if (submitting) return;
    setEditTarget(null);
    setShowForm(false);
  };

  const handleFormSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (editTarget) {
        await examService.updateExam(editTarget.id, data);
        toast.success("Exam updated successfully.");
      } else {
        await examService.createExam(data);
        toast.success("Exam created successfully.");
      }
      await loadData();
      handleCloseForm();
    } catch (err) {
      console.error("Exam save error:", err);
      const detail =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        (typeof err.response?.data === "object"
          ? Object.values(err.response.data).flat().join(" ")
          : null) ||
        "Failed to save exam. Please check the form.";
      toast.error(detail);
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await examService.deleteExam(deleteTarget.id);
      toast.success("Exam deleted successfully.");
      await loadData();
      setDeleteTarget(null);
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Failed to delete exam."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 md:px-8">
        <ExamSkeleton />
      </div>
    );
  }

  if (error && exams.length === 0) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 space-y-8">
        <PageHeader
          title="Exam Management"
          subtitle="Manage upcoming assessments and examination schedules."
        />
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
            <AlertCircle size={22} className="text-red-400" />
          </div>
          <p className="text-sm text-red-400 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs font-semibold transition-colors border border-neutral-700"
          >
            <RefreshCw size={12} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="space-y-8 max-w-7xl mx-auto py-8 px-4 md:px-8"
    >
      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <PageHeader
        title="Exam Management"
        subtitle="Manage upcoming assessments and examination schedules."
        buttonText="Create Exam"
        onButtonClick={handleOpenCreate}
      />

      {/* ── Statistics Grid ────────────────────────────────────────────────── */}
      {exams.length > 0 && (
        <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex items-start gap-4">
            <div className="p-3 bg-indigo-500/10 rounded-xl">
              <Calendar size={18} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest">Total Exams</p>
              <p className="text-2xl font-bold text-neutral-200 mt-1">{stats.total}</p>
            </div>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex items-start gap-4">
            <div className="p-3 bg-amber-500/10 rounded-xl">
              <Clock size={18} className="text-amber-400" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest">Upcoming</p>
              <p className="text-2xl font-bold text-neutral-200 mt-1">{stats.upcoming}</p>
            </div>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex items-start gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl">
              <CheckCircle2 size={18} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest">Completed</p>
              <p className="text-2xl font-bold text-neutral-200 mt-1">{stats.completed}</p>
            </div>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex items-start gap-4">
            <div className="p-3 bg-violet-500/10 rounded-xl">
              <BookOpen size={18} className="text-violet-400" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest">Subjects</p>
              <p className="text-2xl font-bold text-neutral-200 mt-1">{stats.subjects}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Toolbar ────────────────────────────────────────────────────────── */}
      {exams.length > 0 && (
        <motion.div variants={fadeUp} className="bg-neutral-900/70 border border-neutral-800/60 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search subject or venue…"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900/70 border border-neutral-800/60 text-sm text-neutral-200 placeholder-neutral-500 outline-none focus:border-indigo-500/60 focus:bg-neutral-900 transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="relative min-w-[160px]">
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 pr-10 rounded-xl bg-neutral-900/70 border border-neutral-800/60 text-sm text-neutral-200 outline-none focus:border-indigo-500/60 focus:bg-neutral-900 transition-colors cursor-pointer"
              >
                <option value="">All Subjects</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.subject_code}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
            </div>

            <div className="relative min-w-[160px]">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 pr-10 rounded-xl bg-neutral-900/70 border border-neutral-800/60 text-sm text-neutral-200 outline-none focus:border-indigo-500/60 focus:bg-neutral-900 transition-colors cursor-pointer"
              >
                <option value="">All Types</option>
                {EXAM_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
            </div>

            <div className="relative min-w-[160px]">
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-900/70 border border-neutral-800/60 text-sm text-neutral-200 outline-none focus:border-indigo-500/60 focus:bg-neutral-900 transition-colors [color-scheme:dark]"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Empty State (No exams total) ───────────────────────────────────── */}
      {exams.length === 0 && (
        <motion.div variants={fadeUp} className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-5">
            <GraduationCap size={24} className="text-neutral-600" />
          </div>
          <p className="text-sm text-neutral-400 mb-1">No exams scheduled yet.</p>
          <p className="text-[11px] text-neutral-600 mb-5">
            Create your first examination schedule to begin entering marks.
          </p>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-neutral-100 text-neutral-950 rounded-lg transition-colors text-xs font-semibold tracking-wide"
          >
            Create Exam
          </motion.button>
        </motion.div>
      )}

      {/* ── Empty State (Filters applied) ──────────────────────────────────── */}
      {exams.length > 0 && filteredExams.length === 0 && (
        <motion.div variants={fadeUp} className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-4">
            <Search size={20} className="text-neutral-600" />
          </div>
          <p className="text-sm text-neutral-400 mb-1">No exams match your filters</p>
          <p className="text-[11px] text-neutral-600">
            Try adjusting your search, subject, type, or date filter.
          </p>
        </motion.div>
      )}

      {/* ── Exams List ─────────────────────────────────────────────────────── */}
      {filteredExams.length > 0 && (
        <ExamTable
          exams={filteredExams}
          onEdit={handleOpenEdit}
          onDelete={setDeleteTarget}
          onView={setViewTarget}
        />
      )}

      {/* ── Form Modal ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={(e) => {
              if (submitting) return;
              if (e.target === e.currentTarget) handleCloseForm();
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-neutral-800 bg-neutral-950 shadow-2xl overflow-hidden"
            >
              <div className="shrink-0 px-6 pt-6 pb-5 border-b border-neutral-800/50">
                <h2 className="text-lg font-semibold text-white">
                  {editTarget ? "Edit Exam" : "Create Exam"}
                </h2>
                <p className="text-sm text-neutral-500 mt-1">
                  {editTarget
                    ? "Update the examination schedule details below."
                    : "Fill in the details to schedule a new examination."}
                </p>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-5">
                <ExamForm
                  initialData={editTarget}
                  subjects={subjects}
                  onSubmit={handleFormSubmit}
                  onCancel={handleCloseForm}
                  loading={submitting}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Delete Confirmation Modal ────────────────────────────────────── */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Exam?"
        message={`Are you sure you want to delete the exam schedule for "${deleteTarget?.subject_name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        loading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* ── View Details Modal ────────────────────────────────────────────── */}
      <AnimatePresence>
        {viewTarget && (
          <ExamDetailsModal
            exam={viewTarget}
            onClose={() => setViewTarget(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
