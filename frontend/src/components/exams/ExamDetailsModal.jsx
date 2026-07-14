import { motion } from "framer-motion";
import { X, Calendar, Clock, MapPin, Hash, GraduationCap, CheckCircle2, Bookmark } from "lucide-react";

export default function ExamDetailsModal({ exam, onClose }) {
  if (!exam) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const examDate = new Date(exam.date);
  examDate.setHours(0, 0, 0, 0);
  const isCompleted = examDate < today;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
      >
        <div className={`h-[3px] w-full bg-gradient-to-r ${isCompleted ? 'from-neutral-600 via-neutral-400 to-neutral-600' : 'from-indigo-600 via-violet-500 to-indigo-600'}`} />
        
        <div className="shrink-0 px-6 pt-6 pb-5 border-b border-neutral-800/50 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white tracking-wide">
              {exam.subject_name || "Unknown Subject"}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border ${
                isCompleted 
                  ? "text-neutral-400 bg-neutral-800/50 border-neutral-700/50" 
                  : "text-amber-300 bg-amber-500/10 border-amber-500/25"
              }`}>
                {isCompleted ? "Completed" : "Upcoming"}
              </span>
              <span className="text-[11px] font-medium text-neutral-400">
                {exam.exam_type.replace(/([A-Z])/g, " $1").trim()}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-2 -mt-2 text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900 rounded-xl transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col gap-1">
              <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest flex items-center gap-1.5">
                <Hash size={12} className="text-indigo-400" />
                Subject Code
              </span>
              <span className="text-sm font-medium text-neutral-200">
                {exam.subject_code || "—"}
              </span>
            </div>
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col gap-1">
              <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest flex items-center gap-1.5">
                <Bookmark size={12} className="text-indigo-400" />
                Semester
              </span>
              <span className="text-sm font-medium text-neutral-200">
                {exam.semester ? `Semester ${exam.semester}` : "—"}
              </span>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-neutral-800/50 flex items-center gap-3">
              <div className="p-2 bg-neutral-800 rounded-lg">
                <Calendar size={16} className="text-neutral-400" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest">Date</p>
                <p className="text-sm font-medium text-neutral-200">
                  {new Date(exam.date).toLocaleDateString("en-US", {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
            <div className="p-4 border-b border-neutral-800/50 flex items-center gap-3">
              <div className="p-2 bg-neutral-800 rounded-lg">
                <Clock size={16} className="text-neutral-400" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest">Time & Duration</p>
                <p className="text-sm font-medium text-neutral-200">
                  {exam.time.substring(0, 5)} ({exam.duration} mins)
                </p>
              </div>
            </div>
            <div className="p-4 flex items-center gap-3">
              <div className="p-2 bg-neutral-800 rounded-lg">
                <MapPin size={16} className="text-neutral-400" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest">Venue</p>
                <p className="text-sm font-medium text-neutral-200">{exam.venue}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col gap-1">
              <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest flex items-center gap-1.5">
                <CheckCircle2 size={12} className="text-emerald-400" />
                Max Marks
              </span>
              <span className="text-sm font-medium text-neutral-200">
                {exam.maximum_marks || 100}
              </span>
            </div>
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col gap-1">
              <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest flex items-center gap-1.5">
                <GraduationCap size={12} className="text-violet-400" />
                Students
              </span>
              <span className="text-sm font-medium text-neutral-500 italic">
                Data unavailable
              </span>
            </div>
          </div>
          
        </div>
        
        <div className="p-5 border-t border-neutral-800/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-[11px] font-semibold tracking-wide text-neutral-300 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-lg transition-colors"
          >
            Close Details
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
