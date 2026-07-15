import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { RefreshCw, GraduationCap, Calendar, Clock, MapPin, Activity, AlertCircle, Search, Filter, Hourglass } from "lucide-react";

import examService from "../../services/examService";
import PageHeader from "../../components/common/PageHeader";

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

// ── Helpers ──────────────────────────────────────────────────────────────────────
const getStatus = (dateStr) => {
  if (!dateStr) return "UPCOMING";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const examDate = new Date(dateStr);
  examDate.setHours(0, 0, 0, 0);

  const diffTime = examDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "COMPLETED";
  if (diffDays === 0) return "TODAY";
  if (diffDays === 1) return "TOMORROW";
  return "UPCOMING";
};

const getCountdown = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return null;
  const dateTimeStr = `${dateStr}T${timeStr.length === 5 ? timeStr + ':00' : timeStr}`;
  const examDateTime = new Date(dateTimeStr);
  
  if (isNaN(examDateTime.getTime())) return null;

  const now = new Date();
  const diff = examDateTime - now;

  if (diff < 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  
  if (days > 0) return `in ${days}d ${hours}h`;
  if (hours > 0) return `in ${hours}h ${minutes}m`;
  return `in ${minutes}m`;
};

// ── Badges ───────────────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const styles = {
    COMPLETED: "text-neutral-400 bg-neutral-800/50 border-neutral-700/50",
    TODAY: "text-rose-400 bg-rose-500/10 border-rose-500/25",
    TOMORROW: "text-amber-400 bg-amber-500/10 border-amber-500/25",
    UPCOMING: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
  };

  const labels = {
    COMPLETED: "Completed",
    TODAY: "Today",
    TOMORROW: "Tomorrow",
    UPCOMING: "Upcoming",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-widest border ${styles[status] || styles.UPCOMING}`}
    >
      <Activity size={10} strokeWidth={2} />
      {labels[status] || "Upcoming"}
    </span>
  );
}

function ExamTypeBadge({ type }) {
  const colors = {
    "Internal 1": "bg-blue-500/10 text-blue-400 border-blue-500/20",
    "Internal 2": "bg-purple-500/10 text-purple-400 border-purple-500/20",
    "Model Exam": "bg-amber-500/10 text-amber-400 border-amber-500/20",
    "Semester Exam": "bg-rose-500/10 text-rose-400 border-rose-500/20",
  };

  const colorClass = colors[type] || "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
  const formattedType = type
    ?.replace(/([A-Z])/g, " $1")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim() || "Exam";

  return (
    <span className={`inline-flex items-center rounded-lg border px-2 py-0.5 text-[10px] font-medium leading-none ${colorClass}`}>
      {formattedType}
    </span>
  );
}

// ── Skeleton Loader ─────────────────────────────────────────────────────────────
function ExamSkeleton() {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden animate-pulse">
      <div className="h-[3px] w-full bg-neutral-800" />
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-3">
            <div className="h-4 bg-neutral-800 rounded w-3/4"></div>
            <div className="flex items-center gap-2">
              <div className="h-4 bg-neutral-800 rounded w-12"></div>
              <div className="h-4 bg-neutral-800 rounded w-16"></div>
              <div className="h-4 bg-neutral-800 rounded w-20"></div>
            </div>
          </div>
          <div className="h-6 bg-neutral-800 rounded-lg w-20 shrink-0"></div>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-neutral-800/60">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 bg-neutral-800 rounded-full"></div>
            <div className="h-3 bg-neutral-800 rounded w-20"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 bg-neutral-800 rounded-full"></div>
            <div className="h-3 bg-neutral-800 rounded w-20"></div>
          </div>
          <div className="col-span-2 flex items-center gap-2 mt-1">
            <div className="h-3 w-3 bg-neutral-800 rounded-full"></div>
            <div className="h-3 bg-neutral-800 rounded w-32"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Exam Card ───────────────────────────────────────────────────────────────────
function StudentExamCard({ exam }) {
  const status = getStatus(exam.date);
  const isCompleted = status === "COMPLETED";
  const countdown = !isCompleted ? getCountdown(exam.date, exam.time) : null;

  return (
    <motion.div
      variants={fadeUp}
      layout
      className="group bg-neutral-900/60 border border-neutral-800/60 hover:border-neutral-700 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-black/20"
    >
      <div className={`h-[3px] w-full bg-gradient-to-r ${isCompleted ? 'from-neutral-600 via-neutral-500 to-neutral-600' : 'from-indigo-500 via-violet-400 to-indigo-500'}`} />
      
      <div className="p-5 flex flex-col h-full">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-semibold text-white truncate leading-snug group-hover:text-indigo-50 transition-colors">
              {exam.subject_name || "Unknown Subject"}
            </p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {exam.subject_code && (
                <span className="text-[10px] font-mono font-medium text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                  {exam.subject_code}
                </span>
              )}
              {exam.semester && (
                <span className="text-[10px] font-medium text-neutral-400 bg-neutral-800/50 px-1.5 py-0.5 rounded border border-neutral-700/50">
                  Sem {exam.semester}
                </span>
              )}
              <ExamTypeBadge type={exam.exam_type} />
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <StatusBadge status={status} />
            {countdown && (
              <div className="flex items-center gap-1 text-[10px] font-medium text-indigo-400 bg-indigo-500/5 px-2 py-0.5 rounded-full border border-indigo-500/10">
                <Hourglass size={10} />
                {countdown}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-y-3 gap-x-4 pt-4 mt-auto border-t border-neutral-800/60">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-neutral-500" />
            <span className="text-[12px] font-medium text-neutral-300">
              {new Date(exam.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-neutral-500" />
            <span className="text-[12px] font-medium text-neutral-300">
              {exam.time?.substring(0, 5)} <span className="text-neutral-600 px-0.5">•</span> {exam.duration}m
            </span>
          </div>
          <div className="col-span-2 flex items-start gap-2">
            <MapPin size={14} className="text-neutral-500 mt-0.5 shrink-0" />
            <span className="text-[12px] font-medium text-neutral-300 truncate">
              {exam.venue || "TBA"}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────────
export default function StudentExams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("ALL");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await examService.getExams();
      setExams(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load student exams:", err);
      setError("Failed to load examinations. Please try again.");
      toast.error("Failed to load examinations.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Extract unique semesters for filter
  const semesters = useMemo(() => {
    const sems = new Set(exams.map(e => e.semester).filter(Boolean));
    return Array.from(sems).sort((a, b) => a - b);
  }, [exams]);

  // Filter & categorize exams
  const { upcomingExams, completedExams } = useMemo(() => {
    let filtered = exams;

    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (exam) =>
          exam.subject_name?.toLowerCase().includes(lowerQuery) ||
          exam.subject_code?.toLowerCase().includes(lowerQuery)
      );
    }

    if (selectedSemester !== "ALL") {
      filtered = filtered.filter((exam) => String(exam.semester) === String(selectedSemester));
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = [];
    const completed = [];

    filtered.forEach((exam) => {
      if (!exam.date) {
        upcoming.push(exam);
        return;
      }
      const examDate = new Date(exam.date);
      examDate.setHours(0, 0, 0, 0);
      if (examDate >= today) {
        upcoming.push(exam);
      } else {
        completed.push(exam);
      }
    });

    // Sort upcoming (soonest first)
    upcoming.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
    // Sort completed (most recent first)
    completed.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

    return { upcomingExams: upcoming, completedExams: completed };
  }, [exams, searchQuery, selectedSemester]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 space-y-8 min-h-screen">
        <PageHeader
          title="My Exams"
          subtitle="View your upcoming examinations and previous schedules."
        />
        <div className="space-y-6">
          <div className="flex gap-4 flex-col sm:flex-row">
            <div className="h-11 w-full sm:max-w-sm bg-neutral-900 rounded-xl animate-pulse"></div>
            <div className="h-11 w-full sm:w-32 bg-neutral-900 rounded-xl animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <ExamSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error && exams.length === 0) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 space-y-8 min-h-screen flex flex-col">
        <PageHeader
          title="My Exams"
          subtitle="View your upcoming examinations and previous schedules."
        />
        <div className="flex-1 flex flex-col items-center justify-center text-center pb-20">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-5">
            <AlertCircle size={28} className="text-rose-400" />
          </div>
          <p className="text-base text-rose-300 font-medium mb-5">{error}</p>
          <button
            onClick={loadData}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-sm font-semibold transition-all duration-200 border border-neutral-700/50 hover:border-neutral-600 shadow-lg shadow-black/20 hover:-translate-y-0.5"
          >
            <RefreshCw size={16} />
            Try Again
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
      className="max-w-7xl mx-auto py-8 px-4 md:px-8 min-h-screen space-y-8"
    >
      <PageHeader
        title="My Exams"
        subtitle="View your upcoming examinations and previous schedules."
      />

      {/* Filters & Search */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search size={16} className="text-neutral-500" />
          </div>
          <input
            type="text"
            placeholder="Search by subject name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-900/50 border border-neutral-800 focus:border-indigo-500/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
          />
        </div>

        {semesters.length > 0 && (
          <div className="w-full sm:w-auto flex items-center gap-3">
            <Filter size={16} className="text-neutral-500 hidden sm:block" />
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full sm:w-auto bg-neutral-900/50 border border-neutral-800 focus:border-indigo-500/50 rounded-xl px-4 py-2.5 text-sm text-neutral-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23737373' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: '36px' }}
            >
              <option value="ALL">All Semesters</option>
              {semesters.map(sem => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>
          </div>
        )}
      </motion.div>

      {exams.length === 0 ? (
        <motion.div variants={fadeUp} className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-3xl bg-neutral-900/80 border border-neutral-800/80 flex items-center justify-center mb-6 shadow-xl shadow-black/20">
            <GraduationCap size={32} className="text-neutral-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No exams scheduled yet</h3>
          <p className="text-sm text-neutral-400 max-w-sm">
            Your examination schedules will appear here once published by the department. Check back later.
          </p>
        </motion.div>
      ) : (upcomingExams.length === 0 && completedExams.length === 0) ? (
        <motion.div variants={fadeUp} className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-3xl bg-neutral-900/80 border border-neutral-800/80 flex items-center justify-center mb-6 shadow-xl shadow-black/20">
            <Search size={32} className="text-neutral-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No matches found</h3>
          <p className="text-sm text-neutral-400 max-w-sm">
            We couldn't find any exams matching your search criteria. Try adjusting your filters.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-12 pb-10">
          
          {/* Upcoming Exams Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-lg font-bold text-white tracking-wide">Upcoming & Ongoing</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold">
                {upcomingExams.length}
              </span>
            </div>

            {upcomingExams.length === 0 ? (
              <div className="p-10 border border-dashed border-neutral-800/80 rounded-2xl bg-neutral-900/20 flex flex-col items-center justify-center text-center">
                <Calendar size={28} className="text-neutral-600 mb-4" />
                <p className="text-base font-medium text-neutral-300">No upcoming exams</p>
                <p className="text-sm text-neutral-500 mt-1">
                  You have no upcoming examinations matching the current filters.
                </p>
              </div>
            ) : (
              <motion.div layout variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <AnimatePresence mode="popLayout">
                  {upcomingExams.map(exam => (
                    <StudentExamCard key={exam.id} exam={exam} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </section>

          {/* Completed Exams Section */}
          {completedExams.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-lg font-bold text-white tracking-wide">Past Examinations</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-neutral-800 border border-neutral-700/50 text-neutral-400 text-xs font-bold">
                  {completedExams.length}
                </span>
              </div>

              <motion.div layout variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <AnimatePresence mode="popLayout">
                  {completedExams.map(exam => (
                    <StudentExamCard key={exam.id} exam={exam} />
                  ))}
                </AnimatePresence>
              </motion.div>
            </section>
          )}

        </div>
      )}
    </motion.div>
  );
}
