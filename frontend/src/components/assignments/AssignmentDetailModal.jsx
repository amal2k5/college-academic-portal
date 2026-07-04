import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Clock, Calendar, BookOpen, Award, AlertCircle, FileText, User, Layers, CalendarDays } from "lucide-react";
import { useState, useEffect } from "react";

function getStatus(deadline) {
  const now = new Date();
  const end = new Date(deadline);
  const totalHours = (end - now) / (1000 * 60 * 60);

  if (totalHours <= 0) return { label: "Overdue", color: "bg-red-500/10 text-red-400 border-red-500/20", dot: "bg-red-500" };
  if (totalHours < 24) return { label: "Due Today", color: "bg-red-500/10 text-red-400 border-red-500/20", dot: "bg-red-500" };
  if (totalHours < 72) return { label: "Due Soon", color: "bg-amber-500/10 text-amber-400 border-amber-500/20", dot: "bg-amber-500" };
  return { label: "On Track", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", dot: "bg-emerald-500" };
}

function getCreatorName(createdBy) {
  if (!createdBy) return "Unknown";
  if (typeof createdBy === "object") {
    return createdBy.name || createdBy.username || "Unknown";
  }
  if (typeof createdBy === "number" || /^\d+$/.test(String(createdBy))) return "Faculty";
  return createdBy;
}

function getSubjectDisplay(subject) {
  if (typeof subject === "object" && subject !== null) {
    return subject.name || subject.title || "Unknown Subject";
  }
  return subject || "Unknown Subject";
}

const cardVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.25, ease: "easeOut" },
  }),
};

function InfoCard({ icon: Icon, label, value, index }) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="bg-neutral-900 border border-neutral-800 rounded-xl p-3.5"
    >
      <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 font-semibold uppercase tracking-wider mb-1.5">
        <Icon size={12} />
        {label}
      </div>
      <p className="text-sm text-neutral-100 font-medium truncate">{value}</p>
    </motion.div>
  );
}

function AssignmentDetailModal({ assignment, onClose }) {
  const [status, setStatus] = useState(getStatus(assignment?.deadline));

  useEffect(() => {
    if (assignment) setStatus(getStatus(assignment.deadline));
    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [assignment, onClose]);

  if (!assignment) return null;

  const attachmentUrl = assignment.attachment_url || assignment.attachment;
  const isImage =
    assignment.attachment_resource_type === "image" ||
    (attachmentUrl && /\.(jpg|jpeg|png|gif|webp)$/i.test(attachmentUrl));

  const deadlineDate = new Date(assignment.deadline);
  const deadlineDay = deadlineDate.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  const deadlineTime = deadlineDate.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

  const postedDate = assignment.created_at
    ? new Date(assignment.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
    : "N/A";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-6"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.97, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.97, opacity: 0, y: 16 }}
          transition={{ type: "spring", damping: 28, stiffness: 320 }}
          className="relative w-full max-w-3xl bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Status strip */}
          <div className={`absolute top-0 left-0 right-0 h-[3px] ${status.dot}`} />

          {/* Header */}
          <div className="shrink-0 px-5 sm:px-8 pt-7 sm:pt-8 pb-5 sm:pb-6 border-b border-neutral-900">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${status.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                    {status.label}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-neutral-900 text-[10px] font-bold uppercase tracking-wider text-neutral-400 border border-neutral-800">
                    {getSubjectDisplay(assignment.subject)}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-white leading-snug break-words">
                  {assignment.title}
                </h2>
              </div>

              <button
                onClick={onClose}
                className="shrink-0 p-2 rounded-full hover:bg-neutral-900 text-neutral-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-5 sm:px-8 py-6 space-y-6">
            {/* Info grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <InfoCard icon={BookOpen} label="Subject" value={getSubjectDisplay(assignment.subject)} index={0} />
              <InfoCard icon={Layers} label="Year" value={`Year ${assignment.target_year ?? "N/A"}`} index={1} />
              <InfoCard icon={Award} label="Max Marks" value={assignment.max_marks ?? "N/A"} index={2} />
              <InfoCard icon={CalendarDays} label="Posted" value={postedDate} index={3} />
            </div>

            {/* Description */}
            {assignment.description && (
              <motion.div
                custom={4}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 sm:p-5"
              >
                <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                  Description
                </div>
                <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-wrap">
                  {assignment.description}
                </p>
              </motion.div>
            )}

            {/* Attachment */}
            {attachmentUrl && (
              <motion.div
                custom={5}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden"
              >
                <div className="flex items-center justify-between gap-3 p-4">
                  <div className="flex items-center gap-2 text-neutral-400 min-w-0">
                    <FileText size={16} className="shrink-0" />
                    <span className="text-sm font-medium truncate">Attachment</span>
                  </div>
                <a  
                    href={attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-medium transition-colors"
                  >
                    <Download size={14} />
                    <span className="hidden sm:inline">{isImage ? "View Image" : "Download File"}</span>
                  </a>
                </div>
                {isImage && (
                  <div className="px-4 pb-4">
                    <img
                      src={attachmentUrl}
                      alt="Attachment"
                      className="w-full rounded-lg border border-neutral-800 max-h-[360px] object-contain bg-neutral-950"
                    />
                  </div>
                )}
              </motion.div>
            )}

            {/* Deadline / Created by */}
            <motion.div
              custom={6}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1"
            >
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 uppercase font-semibold tracking-wider mb-1.5">
                  <Clock size={12} />
                  Deadline
                </div>
                <p className="text-sm text-neutral-100 font-medium">{deadlineDay}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{deadlineTime}</p>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 uppercase font-semibold tracking-wider mb-1.5">
                  <User size={12} />
                  Created By
                </div>
                <p className="text-sm text-neutral-100 font-medium truncate">
                  {getCreatorName(assignment.created_by)}
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default AssignmentDetailModal;