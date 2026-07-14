import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { RefreshCw, GraduationCap, Calendar, Clock, MapPin, Activity, AlertCircle } from "lucide-react";

import examService from "../../services/examService";
import PageHeader from "../../components/common/PageHeader";

const ease = [0.22, 1, 0.36, 1];
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.04 } },
};

function StatusBadge({ status }) {
  const isCompleted = status === "COMPLETED";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-widest border ${
        isCompleted
          ? "text-neutral-400 bg-neutral-800/50 border-neutral-700/50"
          : "text-amber-300 bg-amber-500/10 border-amber-500/25"
      }`}
    >
      <Activity size={10} strokeWidth={2} />
      {isCompleted ? "Completed" : "Upcoming"}
    </span>
  );
}

function StudentExamCard({ exam, isCompleted }) {
  return (
    <motion.div
      variants={fadeUp}
      className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-xl overflow-hidden transition-all duration-200"
    >
      <div className={`h-[3px] w-full bg-gradient-to-r ${isCompleted ? 'from-neutral-600 via-neutral-400 to-neutral-600' : 'from-indigo-600 via-violet-500 to-indigo-600'}`} />
      <div className="p-5 space-y-4">
        
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-semibold text-neutral-100 truncate leading-snug">
              {exam.subject_name || "Unknown Subject"}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[10px] font-mono font-medium text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                {exam.subject_code || "N/A"}
              </span>
              <p className="text-[11px] font-mono text-neutral-500 tracking-wide">
                {exam.exam_type.replace(/([A-Z])/g, " $1").trim()}
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <StatusBadge status={isCompleted ? "COMPLETED" : "UPCOMING"} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-neutral-800/60">
          <div className="flex items-center gap-2">
            <Calendar size={13} className="text-neutral-500" />
            <span className="text-[11px] font-medium text-neutral-300">
              {new Date(exam.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={13} className="text-neutral-500" />
            <span className="text-[11px] font-medium text-neutral-300">
              {exam.time.substring(0, 5)} ({exam.duration}m)
            </span>
          </div>
          <div className="col-span-2 flex items-start gap-2">
            <MapPin size={13} className="text-neutral-500 mt-0.5 shrink-0" />
            <span className="text-[11px] font-medium text-neutral-300 truncate">
              {exam.venue}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function StudentExams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const { upcomingExams, completedExams } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = [];
    const completed = [];

    exams.forEach((exam) => {
      const examDate = new Date(exam.date);
      examDate.setHours(0, 0, 0, 0);
      if (examDate >= today) {
        upcoming.push(exam);
      } else {
        completed.push(exam);
      }
    });

    upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
    completed.sort((a, b) => new Date(b.date) - new Date(a.date));

    return { upcomingExams: upcoming, completedExams: completed };
  }, [exams]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 gap-5">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-6 h-6 rounded-full border-2 border-neutral-800 border-t-indigo-400"
        />
        <p className="text-[11px] text-neutral-500 tracking-[0.2em] uppercase">
          Loading exams
        </p>
      </div>
    );
  }

  if (error && exams.length === 0) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 space-y-8 min-h-screen">
        <PageHeader
          title="Examinations"
          subtitle="View your upcoming and past examination schedules."
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
      className="max-w-7xl mx-auto py-8 px-4 md:px-8 min-h-screen space-y-8"
    >
      <PageHeader
        title="Examinations"
        subtitle="View your upcoming and past examination schedules."
      />

      {exams.length === 0 ? (
        <motion.div variants={fadeUp} className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-5">
            <GraduationCap size={24} className="text-neutral-600" />
          </div>
          <p className="text-sm text-neutral-400 mb-1">No exams scheduled yet.</p>
          <p className="text-[11px] text-neutral-600 mb-5">
            Your examination schedules will appear here once published by the department.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-12">
          
          {/* Upcoming Exams Section */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-sm font-semibold text-neutral-200 tracking-wide">Upcoming Examinations</h2>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold">
                {upcomingExams.length}
              </span>
            </div>

            {upcomingExams.length === 0 ? (
              <div className="p-8 border border-neutral-800/60 rounded-2xl bg-neutral-900/50 flex flex-col items-center justify-center text-center">
                <Calendar size={24} className="text-neutral-600 mb-3" />
                <p className="text-sm text-neutral-400">No upcoming exams.</p>
                <p className="text-[11px] text-neutral-600 mt-1">
                  Your upcoming examinations will appear here once scheduled.
                </p>
              </div>
            ) : (
              <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {upcomingExams.map(exam => (
                  <StudentExamCard key={exam.id} exam={exam} isCompleted={false} />
                ))}
              </motion.div>
            )}
          </section>

          {/* Completed Exams Section */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-sm font-semibold text-neutral-200 tracking-wide">Completed Examinations</h2>
              <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 text-[10px] font-bold">
                {completedExams.length}
              </span>
            </div>

            {completedExams.length > 0 && (
              <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {completedExams.map(exam => (
                  <StudentExamCard key={exam.id} exam={exam} isCompleted={true} />
                ))}
              </motion.div>
            )}
            
            {completedExams.length === 0 && (
              <div className="p-8 border border-neutral-800/60 rounded-2xl bg-neutral-900/50 flex flex-col items-center justify-center text-center">
                <p className="text-[11px] text-neutral-600">
                  No completed examinations found.
                </p>
              </div>
            )}
          </section>

        </div>
      )}
    </motion.div>
  );
}
