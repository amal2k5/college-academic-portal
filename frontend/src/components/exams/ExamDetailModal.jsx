import { motion } from "framer-motion";
import { X, Calendar, Clock, MapPin, Hash, CheckCircle2, Bookmark, Activity } from "lucide-react";
import { getExamTypeLabel } from "../../constants/examConstants";

function formatTime(time) {
  if (!time) return "N/A";
  const [hours, minutes] = time.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

function formatDate(date, style = 'full') {
  if (!date) return "N/A";
  const options = style === 'full'
    ? { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    : { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(date).toLocaleDateString("en-US", options);
}

const statusConfig = {
  SCHEDULED: { label: "Scheduled", className: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25" },
  RESCHEDULED: { label: "Rescheduled", className: "text-amber-400 bg-amber-500/10 border-amber-500/25" },
  CANCELLED: { label: "Cancelled", className: "text-red-400 bg-red-500/10 border-red-500/25" },
};

export default function ExamDetailModal({ exam, onClose }) {
  if (!exam) return null;

  const isCancelled = exam.status === "CANCELLED";
  const status = statusConfig[exam.status] || {
    label: exam.status || "Scheduled",
    className: "text-neutral-400 bg-neutral-800/50 border-neutral-700/50"
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl"
      >
        <div className={`h-[3px] bg-gradient-to-r ${isCancelled ? 'from-red-600 via-neutral-400 to-red-600' : 'from-indigo-600 via-violet-500 to-indigo-600'}`} />

        {/* Header */}
        <div className="px-6 pt-6 pb-5 border-b border-neutral-800/50 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">{exam.subject_name || "Unknown Subject"}</h2>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border flex items-center gap-1 ${status.className}`}>
                <Activity size={10} />
                {status.label}
              </span>
              <span className="text-[11px] font-medium text-neutral-400">{getExamTypeLabel(exam.exam_type)}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 -mr-2 -mt-2 text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900 rounded-xl transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Subject Code & Semester */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3.5">
              <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest flex items-center gap-1.5">
                <Hash size={12} className="text-indigo-400" /> Code
              </span>
              <span className="text-sm font-medium text-neutral-200 font-mono mt-1 block">{exam.subject_code || "—"}</span>
            </div>
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3.5">
              <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest flex items-center gap-1.5">
                <Bookmark size={12} className="text-indigo-400" /> Semester
              </span>
              <span className="text-sm font-medium text-neutral-200 mt-1 block">{exam.semester ? `Sem ${exam.semester}` : "—"}</span>
            </div>
          </div>

          {/* Date, Time, Venue */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl divide-y divide-neutral-800/50">
            <div className="p-3.5 flex items-center gap-3">
              <div className="p-2 bg-neutral-800 rounded-lg"><Calendar size={16} className="text-neutral-400" /></div>
              <div><p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest">Date</p><p className="text-sm font-medium text-neutral-200">{formatDate(exam.exam_date)}</p></div>
            </div>
            <div className="p-3.5 flex items-center gap-3">
              <div className="p-2 bg-neutral-800 rounded-lg"><Clock size={16} className="text-neutral-400" /></div>
              <div><p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest">Time</p><p className="text-sm font-medium text-neutral-200">{formatTime(exam.start_time)} - {formatTime(exam.end_time)}</p></div>
            </div>
            <div className="p-3.5 flex items-center gap-3">
              <div className="p-2 bg-neutral-800 rounded-lg"><MapPin size={16} className="text-neutral-400" /></div>
              <div><p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest">Venue</p><p className="text-sm font-medium text-neutral-200">{exam.venue || "TBA"}</p></div>
            </div>
          </div>

          {/* Marks & Original Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3.5">
              <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest flex items-center gap-1.5">
                <CheckCircle2 size={12} className="text-emerald-400" /> Max Marks
              </span>
              <span className="text-sm font-medium text-neutral-200 mt-1 block">{exam.maximum_marks || "—"}</span>
            </div>
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3.5">
              <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest flex items-center gap-1.5">
                <Calendar size={12} className="text-violet-400" /> Original Date
              </span>
              <span className="text-sm font-medium text-neutral-300 mt-1 block">{exam.original_date ? formatDate(exam.original_date, 'short') : "No Reschedule"}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-800/50 flex justify-end">
          <button onClick={onClose} className="px-5 py-2 text-[11px] font-semibold text-neutral-300 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-lg transition-colors">
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}