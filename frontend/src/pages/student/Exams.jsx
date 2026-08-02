import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { RefreshCw, GraduationCap, AlertCircle } from "lucide-react";

import examService from "../../services/examService";
import PageHeader from "../../components/common/PageHeader";
import StudentExamCalendar from "../../components/exams/StudentExamCalendar";
import StudentExamHistory from "../../components/exams/StudentExamHistory";
import ExamDetailModal from "../../components/exams/ExamDetailModal";
import { LoadingSkeleton } from "../../components/common/loading";

const ease = [0.22, 1, 0.36, 1];
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.04 } },
};

function StudentExamsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="border-b border-white/[0.08] pb-6">
        <LoadingSkeleton width="w-48" height="h-8" rounded="rounded" className="mb-2" />
        <LoadingSkeleton width="w-64" height="h-4" rounded="rounded" />
      </div>
      <div className="bg-[#0F172A] border border-white/[0.08] rounded-2xl p-6 h-[400px] flex flex-col justify-center items-center shadow-xl">
        <LoadingSkeleton width="w-3/4" height="h-64" rounded="rounded-xl" />
      </div>
      <div className="space-y-4">
        <LoadingSkeleton width="w-32" height="h-6" rounded="rounded" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 bg-[#0F172A] border border-white/[0.08] rounded-2xl p-5 flex flex-col justify-between shadow-xl">
              <div className="space-y-2">
                <LoadingSkeleton width="w-1/2" height="h-5" />
                <LoadingSkeleton width="w-3/4" height="h-4" />
              </div>
              <LoadingSkeleton width="w-1/3" height="h-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Exams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedExam, setSelectedExam] = useState(null);

  const loadExams = useCallback(async () => {
    try {
      const data = await examService.getExams();
      setExams(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      console.error("Failed to load student exams:", err);
      setError("Failed to load your examination schedule. Please try again.");
      toast.error("Failed to load examinations.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadExams();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadExams]);

  const handleRetry = () => {
    setLoading(true);
    setError("");
    loadExams();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 md:px-8">
        <StudentExamsSkeleton />
      </div>
    );
  }

  if (error && exams.length === 0) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 space-y-8">
        <PageHeader
          title="Examinations"
          subtitle="View your upcoming and completed exam schedules."
        />
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
            <AlertCircle size={22} className="text-red-400" />
          </div>
          <p className="text-sm text-red-400 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition-colors border border-neutral-700"
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
      <PageHeader
        title="Examinations"
        subtitle="Track your upcoming and completed academic assessment schedules."
      />

      {exams.length === 0 ? (
        <motion.div variants={fadeUp} className="flex flex-col items-center justify-center py-24 text-center bg-neutral-900/20 border border-neutral-800/60">
          <div className="w-16 h-16 bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-5">
            <GraduationCap size={24} className="text-neutral-600" />
          </div>
          <h4 className="text-sm font-semibold text-neutral-300 mb-1">No Exams Scheduled</h4>
          <p className="text-[11px] text-neutral-500 max-w-sm leading-relaxed">
            There are currently no examinations scheduled for your department and semester.
          </p>
        </motion.div>
      ) : (
        <>
          <motion.div variants={fadeUp}>
            <StudentExamCalendar exams={exams} onExamClick={setSelectedExam} />
          </motion.div>

          <motion.div variants={fadeUp} className="pt-4">
            <StudentExamHistory exams={exams} onExamClick={setSelectedExam} />
          </motion.div>
        </>
      )}

      <AnimatePresence>
        {selectedExam && (
          <ExamDetailModal
            exam={selectedExam}
            onClose={() => setSelectedExam(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}