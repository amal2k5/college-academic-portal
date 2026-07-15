import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  Search,
  ChevronDown,
  Pencil,
  Trash2,
  BookOpen,
  Hash,
  Calendar,
  FlaskConical,
  RefreshCw,
  AlertCircle,
  X,
} from "lucide-react";
import subjectService from "../../services/subjectService";
import SubjectForm from "../../components/subjects/SubjectForm";
import ConfirmModal from "../../components/common/ConfirmModal";
import PageHeader from "../../components/common/PageHeader";

// ── Animation variants ──────────────────────────────────────────────────────────
const ease = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.02 } },
};

// ── Type badge colors ───────────────────────────────────────────────────────────
const TYPE_STYLES = {
  THEORY: {
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    text: "text-indigo-300",
  },
  PRACTICAL: {
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    text: "text-violet-300",
  },
  LAB: {
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    text: "text-cyan-300",
  },
};

function TypeBadge({ type }) {
  const style = TYPE_STYLES[type] || TYPE_STYLES.THEORY;
  const label =
    type === "THEORY" ? "Theory" : type === "PRACTICAL" ? "Practical" : "Lab";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-widest border ${style.bg} ${style.border} ${style.text}`}
    >
      <FlaskConical size={10} strokeWidth={2} />
      {label}
    </span>
  );
}

// ── Mobile Card ─────────────────────────────────────────────────────────────────
function SubjectCard({ subject, onEdit, onDelete }) {
  return (
    <motion.div
      variants={fadeUp}
      layout
      className="group bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-xl overflow-hidden transition-all duration-200"
    >
      <div className="h-[3px] w-full bg-gradient-to-r from-indigo-600 via-violet-500 to-indigo-600" />
      <div className="p-5 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium text-neutral-100 truncate leading-snug">
              {subject.name}
            </p>
            <p className="text-[11px] font-mono text-neutral-500 tracking-wide mt-0.5">
              {subject.subject_code}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(subject)}
              className="p-1.5 rounded-md hover:bg-neutral-800 text-neutral-500 hover:text-neutral-200 transition-colors"
              aria-label={`Edit ${subject.name}`}
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={() => onDelete(subject)}
              className="p-1.5 rounded-md hover:bg-red-500/10 text-neutral-500 hover:text-red-400 transition-colors"
              aria-label={`Delete ${subject.name}`}
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-[11px] text-neutral-400">
            <Calendar size={11} strokeWidth={1.6} />
            Semester {subject.semester}
          </span>
          <TypeBadge type={subject.subject_type} />
        </div>

        {/* Footer */}
        {subject.created_at && (
          <div className="pt-2 border-t border-neutral-800/60">
            <span className="text-[10px] text-neutral-600">
              Created{" "}
              {new Date(subject.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Loading Skeleton ────────────────────────────────────────────────────────────
function SubjectsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-800/40 pb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Subject Management
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Manage department subjects and curriculum.
          </p>
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
          <div
            key={i}
            className="flex items-center gap-6 px-5 py-4 border-b border-neutral-800/30 last:border-0"
          >
            <div className="h-4 bg-neutral-800 rounded-lg w-1/4" />
            <div className="h-4 bg-neutral-800 rounded-lg w-16" />
            <div className="h-4 bg-neutral-800 rounded-lg w-20" />
            <div className="h-5 bg-neutral-800 rounded-lg w-16" />
            <div className="h-4 bg-neutral-800 rounded-lg w-20" />
            <div className="h-4 bg-neutral-800 rounded-lg w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function SubjectManagement() {
  // ── State ───────────────────────────────────────────────────────────────────
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Form modal
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");

  // ── Load subjects ───────────────────────────────────────────────────────────
  const loadSubjects = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await subjectService.getSubjects();
      setSubjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load subjects:", err);
      setError("Failed to load subjects. Please try again.");
      toast.error("Failed to load subjects.");
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  // ── Filtered + searched subjects ────────────────────────────────────────────
  const filteredSubjects = useMemo(() => {
    let list = subjects;

    if (semesterFilter) {
      list = list.filter(
        (s) => String(s.semester) === String(semesterFilter)
      );
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.subject_code.toLowerCase().includes(q)
      );
    }

    return list;
  }, [subjects, search, semesterFilter]);

  // ── Semester counts for filter badges ───────────────────────────────────────
  const semesterCounts = useMemo(() => {
    const counts = {};
    for (const s of subjects) {
      counts[s.semester] = (counts[s.semester] || 0) + 1;
    }
    return counts;
  }, [subjects]);

  // ── Form handlers ──────────────────────────────────────────────────────────
  const handleOpenCreate = () => {
    setEditTarget(null);
    setShowForm(true);
  };

  const handleOpenEdit = (subject) => {
    setEditTarget(subject);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setEditTarget(null);
    setShowForm(false);
  };

  const handleFormSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (editTarget) {
        await subjectService.updateSubject(editTarget.id, data);
        toast.success("Subject updated successfully.");
      } else {
        await subjectService.createSubject(data);
        toast.success("Subject created successfully.");
      }
      await loadSubjects();
      handleCloseForm();
    } catch (err) {
      console.error("Subject save error:", err);
      // Show backend validation errors
      const detail =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.response?.data?.subject_code?.[0] ||
        err.response?.data?.name?.[0] ||
        (typeof err.response?.data === "object"
          ? Object.values(err.response.data).flat().join(" ")
          : null) ||
        "Failed to save subject. Please check the form.";
      toast.error(detail);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete handlers ────────────────────────────────────────────────────────
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await subjectService.deleteSubject(deleteTarget.id);
      toast.success("Subject deleted successfully.");
      await loadSubjects();
      setDeleteTarget(null);
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Failed to delete subject."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 md:px-8">
        <SubjectsSkeleton />
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (error && subjects.length === 0) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 space-y-8">
        <PageHeader
          title="Subject Management"
          subtitle="Manage department subjects and curriculum."
        />
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
            <AlertCircle size={22} className="text-red-400" />
          </div>
          <p className="text-sm text-red-400 mb-4">{error}</p>
          <button
            onClick={loadSubjects}
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
      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <PageHeader
        title="Subject Management"
        subtitle="Manage department subjects and curriculum."
        buttonText="Add Subject"
        onButtonClick={handleOpenCreate}
        actions={
          subjects.length > 0 ? (
            <span className="hidden sm:inline-flex text-[10px] font-semibold text-neutral-400 bg-neutral-800/50 border border-neutral-700/50 px-2.5 py-1 rounded-lg">
              {subjects.length} {subjects.length === 1 ? "subject" : "subjects"}
            </span>
          ) : null
        }
      />

      {/* ── Toolbar ──────────────────────────────────────────────────────── */}
      {subjects.length > 0 && (
        <motion.div
          variants={fadeUp}
          className="flex flex-col sm:flex-row gap-3"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or code…"
              aria-label="Search subjects"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900/70 border border-neutral-800/60 text-sm text-neutral-200 placeholder-neutral-500 outline-none focus:border-neutral-600 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Semester filter */}
          <div className="relative min-w-[180px]">
            <select
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
              aria-label="Filter by semester"
              className="w-full appearance-none px-4 py-2.5 pr-10 rounded-xl bg-neutral-900/70 border border-neutral-800/60 text-sm text-neutral-200 outline-none focus:border-neutral-600 transition-colors cursor-pointer"
            >
              <option value="">All Semesters</option>
              {Array.from({ length: 8 }, (_, i) => i + 1).map((sem) => (
                <option key={sem} value={String(sem)}>
                  Semester {sem}
                  {semesterCounts[sem] ? ` (${semesterCounts[sem]})` : ""}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none"
            />
          </div>
        </motion.div>
      )}

      {/* ── Empty State ──────────────────────────────────────────────────── */}
      {subjects.length === 0 && (
        <motion.div
          variants={fadeUp}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-5">
            <BookOpen size={24} className="text-neutral-600" />
          </div>
          <p className="text-sm text-neutral-400 mb-1">
            No subjects yet
          </p>
          <p className="text-[11px] text-neutral-600 mb-5">
            Add your first subject to get started with marks and exams.
          </p>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-xs font-semibold tracking-wide"
          >
            Add Subject
          </motion.button>
        </motion.div>
      )}

      {/* ── No Results (filtered) ────────────────────────────────────────── */}
      {subjects.length > 0 && filteredSubjects.length === 0 && (
        <motion.div
          variants={fadeUp}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-4">
            <Search size={20} className="text-neutral-600" />
          </div>
          <p className="text-sm text-neutral-400 mb-1">
            No subjects match your filters
          </p>
          <p className="text-[11px] text-neutral-600">
            Try adjusting your search or semester filter.
          </p>
        </motion.div>
      )}

      {/* ── Desktop Table ────────────────────────────────────────────────── */}
      {filteredSubjects.length > 0 && (
        <>
          <motion.div variants={fadeUp} className="hidden md:block">
            <div className="bg-neutral-900/70 border border-neutral-800/60 rounded-2xl overflow-hidden">
              <div className="h-[3px] w-full bg-gradient-to-r from-indigo-600 via-violet-500 to-indigo-600" />
              <div className="overflow-x-auto">
                <table className="w-full" role="table">
                  <thead>
                    <tr className="border-b border-neutral-800/60">
                      {[
                        { label: "Subject", align: "left" },
                        { label: "Code", align: "left" },
                        { label: "Semester", align: "center" },
                        { label: "Type", align: "center" },
                        { label: "Created", align: "center" },
                        { label: "Actions", align: "center" },
                      ].map((col) => (
                        <th
                          key={col.label}
                          scope="col"
                          className={`px-5 py-3.5 text-[9px] font-semibold text-neutral-500 uppercase tracking-[0.2em] text-${col.align}`}
                        >
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubjects.map((subject, index) => (
                      <motion.tr
                        key={subject.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.25,
                          delay: index * 0.02,
                          ease,
                        }}
                        className="border-b border-neutral-800/30 last:border-0 hover:bg-neutral-800/20 transition-colors duration-150 group"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                              <BookOpen
                                size={13}
                                className="text-indigo-400"
                              />
                            </div>
                            <p className="text-[13px] font-medium text-neutral-100 truncate max-w-[220px]">
                              {subject.name}
                            </p>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-[12px] font-mono text-neutral-400 tracking-wide bg-neutral-800/50 border border-neutral-700/40 px-2 py-0.5 rounded">
                            {subject.subject_code}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <span className="text-[12px] font-medium text-neutral-300">
                            Sem {subject.semester}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <TypeBadge type={subject.subject_type} />
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <span className="text-[11px] text-neutral-500">
                            {subject.created_at
                              ? new Date(
                                  subject.created_at
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "—"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleOpenEdit(subject)}
                              className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-500 hover:text-neutral-200 transition-colors"
                              aria-label={`Edit ${subject.name}`}
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(subject)}
                              className="p-2 rounded-lg hover:bg-red-500/10 text-neutral-500 hover:text-red-400 transition-colors"
                              aria-label={`Delete ${subject.name}`}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* ── Mobile Cards ──────────────────────────────────────────────── */}
          <motion.div
            variants={stagger}
            className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {filteredSubjects.map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                onEdit={handleOpenEdit}
                onDelete={setDeleteTarget}
              />
            ))}
          </motion.div>
        </>
      )}

      {/* ── Create / Edit Modal ──────────────────────────────────────────── */}
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
              className="w-full max-w-lg max-h-[85vh] flex flex-col rounded-2xl border border-neutral-800 bg-neutral-950 shadow-2xl overflow-hidden"
            >
              <div className="shrink-0 px-6 pt-6 pb-5 border-b border-neutral-800/50">
                <h2 className="text-lg font-semibold text-white">
                  {editTarget ? "Edit Subject" : "Add Subject"}
                </h2>
                <p className="text-sm text-neutral-500 mt-1">
                  {editTarget
                    ? "Update the subject details below."
                    : "Fill in the subject details to add to your department."}
                </p>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-5">
                <SubjectForm
                  initialData={editTarget}
                  onCancel={handleCloseForm}
                  onSubmit={handleFormSubmit}
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
        title="Delete Subject"
        message={`Are you sure you want to delete "${deleteTarget?.name}" (${deleteTarget?.subject_code})? This will also remove associated marks and exam records. This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        loading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </motion.div>
  );
}

export default SubjectManagement;
