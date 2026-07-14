import { motion } from "framer-motion";
import { Pencil, Trash2, Calendar, Clock, MapPin, Activity } from "lucide-react";

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

// ── Helper ──────────────────────────────────────────────────────────────────────
const getStatus = (date) => {
  if (!date) return "UPCOMING";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const examDate = new Date(date);
  examDate.setHours(0, 0, 0, 0);
  return examDate < today ? "COMPLETED" : "UPCOMING";
};

// ── Badge Component ─────────────────────────────────────────────────────────────
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

// ── Mobile Card ─────────────────────────────────────────────────────────────────
function ExamCard({ exam, onEdit, onDelete, onView }) {
  const status = getStatus(exam.date);
  return (
    <motion.div
      variants={fadeUp}
      layout
      onClick={() => onView && onView(exam)}
      className="group bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-xl overflow-hidden transition-all duration-200 cursor-pointer"
    >
      <div className="h-[3px] w-full bg-gradient-to-r from-indigo-600 via-violet-500 to-indigo-600" />
      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium text-neutral-100 truncate leading-snug">
              {exam.subject_name || "Unknown Subject"}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-mono font-medium text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                {exam.subject_code || "N/A"}
              </span>
              <p className="text-[11px] font-mono text-neutral-500 tracking-wide">
                {exam.exam_type.replace(/([A-Z])/g, " $1").trim()}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <StatusBadge status={status} />
            <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(exam); }}
                className="p-1.5 rounded-md hover:bg-neutral-800 text-neutral-500 hover:text-neutral-200 transition-colors"
                aria-label="Edit Exam"
              >
                <Pencil size={13} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(exam); }}
                className="p-1.5 rounded-md hover:bg-red-500/10 text-neutral-500 hover:text-red-400 transition-colors"
                aria-label="Delete Exam"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-800/60">
          <div className="flex items-center gap-2">
            <Calendar size={13} className="text-neutral-500" />
            <span className="text-[11px] text-neutral-300">
              {new Date(exam.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={13} className="text-neutral-500" />
            <span className="text-[11px] text-neutral-300">
              {exam.time.substring(0, 5)} ({exam.duration}m)
            </span>
          </div>
          <div className="col-span-2 flex items-start gap-2">
            <MapPin size={13} className="text-neutral-500 mt-0.5 shrink-0" />
            <span className="text-[11px] text-neutral-300 truncate">
              {exam.venue}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Table Component ────────────────────────────────────────────────────────
export default function ExamTable({ exams, onEdit, onDelete, onView }) {
  return (
    <>
      {/* ── Desktop Table ──────────────────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="hidden md:block">
        <div className="bg-neutral-900/70 border border-neutral-800/60 rounded-2xl overflow-hidden">
          <div className="h-[3px] w-full bg-gradient-to-r from-indigo-600 via-violet-500 to-indigo-600" />
          <div className="overflow-x-auto">
            <table className="w-full" role="table">
              <thead>
                <tr className="border-b border-neutral-800/60">
                  <th className="px-5 py-3.5 text-left text-[9px] font-semibold text-neutral-500 uppercase tracking-[0.2em]">
                    Subject & Code
                  </th>
                  <th className="px-5 py-3.5 text-left text-[9px] font-semibold text-neutral-500 uppercase tracking-[0.2em]">
                    Type & Marks
                  </th>
                  <th className="px-5 py-3.5 text-left text-[9px] font-semibold text-neutral-500 uppercase tracking-[0.2em]">
                    Schedule
                  </th>
                  <th className="px-5 py-3.5 text-left text-[9px] font-semibold text-neutral-500 uppercase tracking-[0.2em]">
                    Venue
                  </th>
                  <th className="px-5 py-3.5 text-center text-[9px] font-semibold text-neutral-500 uppercase tracking-[0.2em]">
                    Status
                  </th>
                  <th className="px-5 py-3.5 text-center text-[9px] font-semibold text-neutral-500 uppercase tracking-[0.2em]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam, index) => {
                  const status = getStatus(exam.date);
                  return (
                    <motion.tr
                      key={exam.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: index * 0.02, ease }}
                      onClick={() => onView && onView(exam)}
                      className="border-b border-neutral-800/30 last:border-0 hover:bg-neutral-800/20 transition-colors duration-150 group cursor-pointer"
                    >
                      {/* Subject & Type */}
                      <td className="px-5 py-3.5">
                        <p className="text-[13px] font-medium text-neutral-100 truncate max-w-[250px]">
                          {exam.subject_name || "Unknown Subject"}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-mono font-medium text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                            {exam.subject_code || "N/A"}
                          </span>
                          {exam.semester && (
                            <span className="text-[10px] font-medium text-neutral-500">
                              Sem {exam.semester}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Type & Marks */}
                      <td className="px-5 py-3.5">
                        <p className="text-[12px] font-medium text-neutral-200">
                          {exam.exam_type.replace(/([A-Z])/g, " $1").trim()}
                        </p>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          Max: <span className="font-medium text-neutral-400">{exam.maximum_marks || 100}</span>
                        </p>
                      </td>

                      {/* Schedule */}
                      <td className="px-5 py-3.5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-[12px] text-neutral-300">
                            <Calendar size={12} className="text-neutral-500" />
                            {new Date(exam.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                          <div className="flex items-center gap-1.5 text-[12px] text-neutral-300">
                            <Clock size={12} className="text-neutral-500" />
                            {exam.time.substring(0, 5)} ({exam.duration}m)
                          </div>
                        </div>
                      </td>

                      {/* Venue */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5 text-[12px] text-neutral-300">
                          <MapPin size={12} className="text-neutral-500 shrink-0" />
                          <span className="truncate max-w-[180px]">{exam.venue}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5 text-center">
                        <StatusBadge status={status} />
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => { e.stopPropagation(); onEdit(exam); }}
                            className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-500 hover:text-neutral-200 transition-colors"
                            aria-label="Edit Exam"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); onDelete(exam); }}
                            className="p-2 rounded-lg hover:bg-red-500/10 text-neutral-500 hover:text-red-400 transition-colors"
                            aria-label="Delete Exam"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
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
        {exams.map((exam) => (
          <ExamCard
            key={exam.id}
            exam={exam}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
          />
        ))}
      </motion.div>
    </>
  );
}
