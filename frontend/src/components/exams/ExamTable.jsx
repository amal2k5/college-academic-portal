import { motion } from "framer-motion";
import { Pencil, Calendar, Clock, MapPin, Ban } from "lucide-react";
import { EXAM_TYPES } from "../../constants/examConstants";

function StatusBadge({ status }) {
  const config = {
    SCHEDULED: { label: "Scheduled", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    RESCHEDULED: { label: "Rescheduled", className: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    CANCELLED: { label: "Cancelled", className: "bg-red-500/10 text-red-400 border-red-500/20" }
  }[status] || { label: status || "Scheduled", className: "bg-neutral-800/50 text-neutral-400 border-neutral-700/50" };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-medium uppercase tracking-wider border ${config.className}`}>
      {config.label}
    </span>
  );
}

function ExamTypeBadge({ type }) {
  const config = EXAM_TYPES.find(t => t.value === type);
  const colors = {
    SERIES_TEST: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    MODEL_EXAM: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    UNIVERSITY_EXAM: "bg-red-500/10 text-red-400 border-red-500/20"
  };

  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-medium border ${colors[type] || "bg-neutral-500/10 text-neutral-400 border-neutral-500/20"}`}>
      {config?.label || type || "Exam"}
    </span>
  );
}

function formatTime(time) {
  if (!time) return "N/A";
  const [hours, minutes] = time.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${String(minutes).padStart(2, '0')} ${ampm}`;
}

function formatDate(date) {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function ExamTable({ exams, subjects = [], onEdit, onCancel, onView }) {
  const getSubject = (id) => subjects.find(s => String(s.id) === String(id));

  return (
    <div className="bg-neutral-900/60 border border-neutral-800/60 rounded-xl overflow-hidden shadow-xl">
      <div className="h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-900/80 border-b border-neutral-800/60">
            <tr>
              <th className="px-4 py-3 text-left text-[9px] font-semibold text-neutral-500 uppercase tracking-wider">Subject</th>
              <th className="px-4 py-3 text-left text-[9px] font-semibold text-neutral-500 uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-[9px] font-semibold text-neutral-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-[9px] font-semibold text-neutral-500 uppercase tracking-wider">Time</th>
              <th className="px-4 py-3 text-left text-[9px] font-semibold text-neutral-500 uppercase tracking-wider">Venue</th>
              <th className="px-4 py-3 text-left text-[9px] font-semibold text-neutral-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-right text-[9px] font-semibold text-neutral-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          <tbody>
            {exams.map((exam, index) => {
              const subject = getSubject(exam.subject);
              const isCancelled = exam.status === "CANCELLED";

              return (
                <motion.tr
                  key={exam.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                  onClick={() => onView?.(exam)}
                  className="border-b border-neutral-800/20 last:border-0 hover:bg-neutral-800/20 transition-colors cursor-pointer group"
                >
                  <td className="px-4 py-3">
                    <p className="text-[12px] font-medium text-white leading-tight">{exam.subject_name || subject?.name || "Unknown"}</p>
                    <p className="text-[9px] font-mono text-indigo-400/70">{exam.subject_code || subject?.subject_code || "N/A"}</p>
                  </td>

                  <td className="px-4 py-3"><ExamTypeBadge type={exam.exam_type} /></td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} className="text-neutral-500 shrink-0" />
                      <span className="text-[11px] text-neutral-300">{formatDate(exam.exam_date)}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} className="text-neutral-500 shrink-0" />
                      <span className="text-[11px] text-neutral-300 whitespace-nowrap">{formatTime(exam.start_time)} - {formatTime(exam.end_time)}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={12} className="text-neutral-500 shrink-0" />
                      <span className="text-[11px] text-neutral-300 truncate max-w-[120px]" title={exam.venue}>{exam.venue || "TBA"}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3"><StatusBadge status={exam.status} /></td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!isCancelled ? (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); onEdit?.(exam); }}
                            className="p-1.5 rounded hover:bg-neutral-800 text-neutral-500 hover:text-white transition-colors"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); onCancel?.(exam); }}
                            className="p-1.5 rounded hover:bg-red-500/10 text-neutral-500 hover:text-red-400 transition-colors"
                          >
                            <Ban size={13} />
                          </button>
                        </>
                      ) : (
                        <span className="text-[11px] text-neutral-200 ">Cancelled</span>
                      )}
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}