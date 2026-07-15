import { motion } from "framer-motion";
import { Pencil, Trash2, Calendar, Clock, MapPin, Activity, MoreVertical } from "lucide-react";
import { useState } from "react";

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

const getRelativeTime = (date) => {
  if (!date) return "";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const examDate = new Date(date);
  examDate.setHours(0, 0, 0, 0);

  const diffTime = examDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Finished";
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays <= 7) return `${diffDays} days left`;
  return `${diffDays} days left`;
};

// ── Badge Components ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const isCompleted = status === "COMPLETED";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-widest border ${isCompleted
        ? "text-neutral-400 bg-neutral-800/50 border-neutral-700/50"
        : "text-emerald-300 bg-emerald-500/10 border-emerald-500/25"
        }`}
    >
      <Activity size={10} strokeWidth={2} />
      {isCompleted ? "Completed" : "Upcoming"}
    </span>
  );
}

function ExamTypeBadge({ type }) {
  const colors = {
    "Internal 1": "bg-blue-500/10 text-blue-400 border-blue-500/20",
    "Internal 2": "bg-purple-500/10 text-purple-400 border-purple-500/20",
    "Model Exam": "bg-amber-500/10 text-amber-400 border-amber-500/20",
    "Semester Exam": "bg-red-500/10 text-red-400 border-red-500/20",
  };

  const colorClass = colors[type] || "bg-neutral-500/10 text-neutral-400 border-neutral-500/20";

  return (
    <span
      className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-medium leading-none ${colorClass}`}
    >
      {type
        ?.replace(/([A-Z])/g, " $1")
        .replace(/\b\w/g, (c) => c.toUpperCase())
        .trim() || "Exam"}
    </span>
  );
}

// ── Mobile Card ─────────────────────────────────────────────────────────────────
function ExamCard({ exam, onEdit, onDelete, onView }) {
  const status = getStatus(exam.date);
  const [showActions, setShowActions] = useState(false);

  return (
    <motion.div
      variants={fadeUp}
      layout
      onClick={() => onView && onView(exam)}
      className="group bg-neutral-900/60 border border-neutral-800/60 hover:border-neutral-700/60 rounded-xl overflow-hidden transition-all duration-200 cursor-pointer"
    >
      <div className="h-[3px] w-full bg-gradient-to-r from-indigo-600 via-violet-500 to-indigo-600" />
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white truncate leading-snug">
              {exam.subject_name || "Unknown Subject"}
            </p>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <span className="text-[10px] font-mono font-medium text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                {exam.subject_code || "N/A"}
              </span>
              {exam.semester && (
                <span className="text-[10px] font-medium text-neutral-500 bg-neutral-800/50 px-1.5 py-0.5 rounded">
                  Sem {exam.semester}
                </span>
              )}
              <ExamTypeBadge type={exam.exam_type} />
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <StatusBadge status={status} />
            <span className="text-[10px] font-medium text-neutral-500">
              {getRelativeTime(exam.date)}
            </span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-800/50">
          <div className="flex items-center gap-1.5">
            <Calendar size={12} className="text-neutral-500 shrink-0" />
            <span className="text-[11px] text-neutral-300">
              {new Date(exam.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={12} className="text-neutral-500 shrink-0" />
            <span className="text-[11px] text-neutral-300">
              {exam.time?.substring(0, 5)} <span className="text-neutral-500">·</span> {exam.duration}m
            </span>
          </div>
          <div className="col-span-2 flex items-start gap-1.5">
            <MapPin size={12} className="text-neutral-500 mt-0.5 shrink-0" />
            <span className="text-[11px] text-neutral-300 truncate">
              {exam.venue || "TBA"}
            </span>
          </div>
          <div className="col-span-2 flex items-center justify-between pt-1">
            <span className="text-[10px] text-neutral-500">
              Max Marks: <span className="font-medium text-neutral-400">{exam.maximum_marks || 100}</span>
            </span>
            <div className="flex items-center gap-1">
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
        <div className="bg-neutral-900/70 border border-neutral-800/60 rounded-2xl overflow-hidden shadow-xl">
          <div className="h-[3px] w-full bg-gradient-to-r from-indigo-600 via-violet-500 to-indigo-600" />
          <div className="overflow-x-auto">
            <table className="w-full" role="table">
              <thead>
                <tr className="border-b border-neutral-800/60 bg-neutral-900/50">
                  <th className="px-6 py-4 text-left text-[10px] font-semibold text-neutral-400 uppercase tracking-[0.15em]">
                    Exam Details
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-semibold text-neutral-400 uppercase tracking-[0.15em]">
                    Schedule
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-semibold text-neutral-400 uppercase tracking-[0.15em]">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-[10px] font-semibold text-neutral-400 uppercase tracking-[0.15em]">
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
                      className="border-b border-neutral-800/30 last:border-0 hover:bg-neutral-800/30 transition-colors duration-150 group cursor-pointer"
                    >
                      {/* Exam Details */}
                      <td className="px-6 py-4">
                        <div className="space-y-1.5">
                          <p className="text-[14px] font-semibold text-white leading-snug">
                            {exam.subject_name || "Unknown Subject"}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-mono font-medium text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                              {exam.subject_code || "N/A"}
                            </span>
                            {exam.semester && (
                              <span className="text-[10px] font-medium text-neutral-400 bg-neutral-800/50 px-2 py-0.5 rounded">
                                Sem {exam.semester}
                              </span>
                            )}
                            <ExamTypeBadge type={exam.exam_type} />
                            <span className="text-[10px] font-medium text-neutral-500 bg-neutral-800/30 px-2 py-0.5 rounded">
                              {exam.maximum_marks || 100} marks
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Schedule */}
                      <td className="px-6 py-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-[13px] text-neutral-200">
                            <Calendar size={14} className="text-neutral-500 shrink-0" />
                            {new Date(exam.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                          <div className="flex items-center gap-3 text-[13px] text-neutral-200">
                            <div className="flex items-center gap-2">
                              <Clock size={14} className="text-neutral-500 shrink-0" />
                              {exam.time?.substring(0, 5)}
                            </div>
                            <span className="text-neutral-600">•</span>
                            <span className="text-neutral-400">{exam.duration}m</span>
                            <span className="text-neutral-600">•</span>
                            <div className="flex items-center gap-1.5">
                              <MapPin size={14} className="text-neutral-500 shrink-0" />
                              <span className="text-neutral-300 truncate max-w-[120px]">
                                {exam.venue || "TBA"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <StatusBadge status={status} />
                          <p className="text-[11px] font-medium text-neutral-500">
                            {getRelativeTime(exam.date)}
                          </p>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => { e.stopPropagation(); onEdit(exam); }}
                            className="p-2 rounded-lg hover:bg-neutral-800/80 text-neutral-500 hover:text-neutral-200 transition-colors"
                            aria-label="Edit Exam"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); onDelete(exam); }}
                            className="p-2 rounded-lg hover:bg-red-500/10 text-neutral-500 hover:text-red-400 transition-colors"
                            aria-label="Delete Exam"
                          >
                            <Trash2 size={15} />
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