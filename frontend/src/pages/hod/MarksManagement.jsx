import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Save, Send, Loader2, AlertCircle, RefreshCw } from "lucide-react";

import marksService from "../../services/marksService";
import { getStudents } from "../../services/studentService";
import PageHeader from "../../components/common/PageHeader";

// Modular components
import MarksToolbar from "../../components/marks/MarksToolbar";
import MarksEntryTable from "../../components/marks/MarksEntryTable";
import PublishMarksModal from "../../components/marks/PublishMarksModal";
import EmptyMarks from "../../components/marks/EmptyMarks";

// ── Animation variants ──────────────────────────────────────────────────────────
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.04 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

// ── Skeleton Loader ─────────────────────────────────────────────────────────────
function TableSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 bg-neutral-900/50 rounded-xl border border-neutral-800/50"
        >
          <div className="h-4 bg-neutral-800 rounded-lg w-1/4" />
          <div className="h-4 bg-neutral-800 rounded-lg w-1/6" />
          <div className="h-4 bg-neutral-800 rounded-lg w-1/6" />
          <div className="h-8 bg-neutral-800 rounded-lg w-20" />
          <div className="h-4 bg-neutral-800 rounded-lg w-12" />
          <div className="h-5 bg-neutral-800 rounded-lg w-16" />
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function MarksManagement() {
  // ── Data state ──────────────────────────────────────────────────────────────
  const [subjects, setSubjects] = useState([]);
  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);
  const [marksMap, setMarksMap] = useState({});

  // ── Filter state ────────────────────────────────────────────────────────────
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedExam, setSelectedExam] = useState("");

  // ── UI state ────────────────────────────────────────────────────────────────
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [error, setError] = useState("");

  // ── Load subjects on mount ──────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await marksService.getSubjects();
        if (!cancelled) setSubjects(data);
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load subjects:", err);
          toast.error("Failed to load subjects.");
        }
      } finally {
        if (!cancelled) setLoadingSubjects(false);
      }
    };
    const timer = setTimeout(() => {
      load();
    }, 0);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  // ── Load exams when subject changes ─────────────────────────────────────────
  useEffect(() => {
    if (!selectedSubject) {
      const timer = setTimeout(() => {
        setExams([]);
      }, 0);
      return () => clearTimeout(timer);
    }
    let cancelled = false;
    const load = async () => {
      try {
        const allExams = await marksService.getExams();
        if (!cancelled) setExams(allExams);
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load exams:", err);
          toast.error("Failed to load exams.");
        }
      }
    };
    const timer = setTimeout(() => {
      load();
    }, 0);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [selectedSubject]);

  // ── Load students + existing marks when exam changes ────────────────────────
  useEffect(() => {
    if (!selectedExam) {
      const timer = setTimeout(() => {
        setStudents([]);
        setMarksMap({});
      }, 0);
      return () => clearTimeout(timer);
    }
    let cancelled = false;

    const load = async () => {
      try {
        // Fetch students and trigger draft to get existing marks
        const [studentList, savedMarks] = await Promise.all([
          getStudents(),
          marksService.getExamMarks(Number(selectedExam)),
        ]);

        const list = Array.isArray(studentList) ? studentList : [];
        if (!cancelled) setStudents(list);

        // Build marks map
        if (!cancelled) {
          const newMap = {};

          for (const m of savedMarks) {
            newMap[String(m.student)] = {
              marks: m.marks,
              grade: m.grade,
              status: m.status,
              percentage: m.percentage,
            };
          }

          setMarksMap(newMap);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load students:", err);
          setError("Failed to load students. Please try again.");
          toast.error("Failed to load students.");
        }
      } finally {
        if (!cancelled) setLoadingStudents(false);
      }
    };

    const timer = setTimeout(() => {
      setLoadingStudents(true);
      setError("");
      load();
    }, 0);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [selectedExam]);

  // ── Derived data ────────────────────────────────────────────────────────────
  const selectedExamObj = useMemo(
    () => exams.find((e) => String(e.id) === String(selectedExam)),
    [exams, selectedExam]
  );
  const maxMarks = selectedExamObj?.maximum_marks ?? 100;

  // ── Counts ──────────────────────────────────────────────────────────────────
  const draftCount = useMemo(
    () => Object.values(marksMap).filter((m) => m.status === "DRAFT").length,
    [marksMap]
  );
  const publishedCount = useMemo(
    () => Object.values(marksMap).filter((m) => m.status === "PUBLISHED").length,
    [marksMap]
  );
  const enteredCount = useMemo(() => Object.keys(marksMap).length, [marksMap]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleMarksChange = useCallback((studentId, value) => {
    setMarksMap((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        marks: value,
        status: prev[studentId]?.status || "DRAFT",
      },
    }));
  }, []);

  const hasValidMarks = useMemo(() => {
    const entries = Object.entries(marksMap);
    if (entries.length === 0) return false;
    return entries.every(([, m]) => {
      const num = Number(m.marks);
      return (
        m.marks !== "" &&
        m.marks !== null &&
        m.marks !== undefined &&
        !isNaN(num) &&
        num >= 0 &&
        num <= Number(maxMarks)
      );
    });
  }, [marksMap, maxMarks]);

  const handleSaveDraft = async () => {
    if (!selectedExam || !hasValidMarks) return;

    const marksArray = Object.entries(marksMap).map(([studentId, m]) => ({
      student: Number(studentId),
      marks: Number(m.marks),
    }));

    setSaving(true);
    try {
      const response = await marksService.saveDraft(
        Number(selectedExam),
        marksArray
      );

      if (response?.results) {
        const newMap = {};
        for (const m of response.results) {
          newMap[m.student] = {
            marks: m.marks,
            grade: m.grade,
            status: m.status,
            percentage: m.percentage,
          };
        }
        setMarksMap((prev) => ({ ...prev, ...newMap }));
      }

      toast.success("Marks saved as draft successfully.");
    } catch (err) {
      console.error("Failed to save draft:", err);
      toast.error(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Failed to save draft. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!selectedExam) return;

    setPublishing(true);
    try {
      await marksService.publishMarks(Number(selectedExam));

      setMarksMap((prev) => {
        const updated = {};
        for (const [key, val] of Object.entries(prev)) {
          updated[key] = { ...val, status: "PUBLISHED" };
        }
        return updated;
      });

      setShowPublishModal(false);
      toast.success("Marks published successfully. Students have been notified.");
    } catch (err) {
      console.error("Failed to publish marks:", err);
      toast.error(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Failed to publish marks. Please try again."
      );
    } finally {
      setPublishing(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="space-y-8 max-w-7xl mx-auto py-8 px-4 md:px-8"
    >
      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <PageHeader
        title="Marks Management"
        subtitle="Manage, review and publish student assessment marks."
        actions={
          selectedExam && students.length > 0 ? (
            <div className="flex items-center gap-3">
              {/* Summary Badges */}
              {enteredCount > 0 && (
                <div className="hidden sm:flex items-center gap-2">
                  {draftCount > 0 && (
                    <span className="text-[10px] font-semibold text-neutral-400 bg-neutral-800/50 border border-neutral-700/50 px-2.5 py-1 rounded-lg">
                      {draftCount} Draft
                    </span>
                  )}
                  {publishedCount > 0 && (
                    <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-lg">
                      {publishedCount} Published
                    </span>
                  )}
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleSaveDraft}
                disabled={saving || !hasValidMarks || publishedCount === students.length}
                className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg transition-colors text-xs font-semibold tracking-wide border border-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Save size={14} strokeWidth={2} />
                )}
                Save Draft
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setShowPublishModal(true)}
                disabled={publishing || draftCount === 0}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors text-xs font-semibold tracking-wide shadow-[0_4px_12px_rgba(99,102,241,0.25)] hover:shadow-[0_4px_16px_rgba(99,102,241,0.35)] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {publishing ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Send size={14} strokeWidth={2} />
                )}
                Publish
              </motion.button>
            </div>
          ) : null
        }
      />

      {/* ── Toolbar ────────────────────────────────────────────────────────── */}
      <MarksToolbar
        subjects={subjects}
        exams={exams}
        selectedSemester={selectedSemester}
        setSelectedSemester={setSelectedSemester}
        selectedSubject={selectedSubject}
        setSelectedSubject={setSelectedSubject}
        selectedExam={selectedExam}
        setSelectedExam={setSelectedExam}
        loadingSubjects={loadingSubjects}
      />

      {/* ── Initial Empty State ────────────────────────────────────────────── */}
      {!selectedExam && !loadingStudents && <EmptyMarks type="default" />}

      {/* ── Loading Skeleton ───────────────────────────────────────────────── */}
      {loadingStudents && <TableSkeleton />}

      {/* ── Error State ────────────────────────────────────────────────────── */}
      {error && !loadingStudents && (
        <motion.div
          variants={fadeUp}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
            <AlertCircle size={22} className="text-red-400" />
          </div>
          <p className="text-sm text-red-400 mb-4">{error}</p>
          <button
            onClick={() => {
              setError("");
              setSelectedExam(selectedExam); // Trigger effect
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs font-semibold transition-colors border border-neutral-700"
          >
            <RefreshCw size={12} />
            Retry
          </button>
        </motion.div>
      )}

      {/* ── No Students State ──────────────────────────────────────────────── */}
      {selectedExam && !loadingStudents && !error && students.length === 0 && (
        <EmptyMarks type="no-students" />
      )}

      {/* ── Data Table / Cards ─────────────────────────────────────────────── */}
      {selectedExam && !loadingStudents && !error && students.length > 0 && (
        <>
          <MarksEntryTable
            students={students}
            marksMap={marksMap}
            maxMarks={maxMarks}
            onMarksChange={handleMarksChange}
          />

          {/* Mobile Action Buttons sticky at bottom */}
          <div className="md:hidden flex gap-3 sticky bottom-4 pt-4">
            <button
              onClick={handleSaveDraft}
              disabled={saving || !hasValidMarks || publishedCount === students.length}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl transition-colors text-xs font-semibold tracking-wide border border-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Save Draft
            </button>
            <button
              onClick={() => setShowPublishModal(true)}
              disabled={publishing || draftCount === 0}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors text-xs font-semibold tracking-wide shadow-[0_4px_12px_rgba(99,102,241,0.25)] hover:shadow-[0_4px_16px_rgba(99,102,241,0.35)] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {publishing ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              Publish
            </button>
          </div>
        </>
      )}

      {/* ── Publish Confirmation Modal ─────────────────────────────────────── */}
      <PublishMarksModal
        open={showPublishModal}
        loading={publishing}
        onConfirm={handlePublish}
        onCancel={() => setShowPublishModal(false)}
      />
    </motion.div>
  );
}
