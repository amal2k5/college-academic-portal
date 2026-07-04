import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  AlertCircle,
  FileText,
  Pencil,
  Trash2,
  ArrowUpRight,
} from "lucide-react";

function getTimeLeft(deadline) {
  const now = new Date();
  const end = new Date(deadline);
  const diff = end - now;

  if (diff <= 0)
    return { text: "Overdue", isLate: true, color: "text-red-400" };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0)
    return {
      text: `${days}d ${hours}h left`,
      isLate: false,
      color: "text-neutral-300",
    };
  if (hours > 0)
    return { text: `${hours}h left`, isLate: false, color: "text-amber-400" };
  return { text: "Due soon", isLate: false, color: "text-amber-400" };
}

function AssignmentCard({ assignment, onEdit, onDelete, onView }) {
  const [timeInfo, setTimeInfo] = useState(getTimeLeft(assignment.deadline));

  useEffect(() => {
    const interval = setInterval(
      () => setTimeInfo(getTimeLeft(assignment.deadline)),
      60000,
    );
    return () => clearInterval(interval);
  }, [assignment.deadline]);

  const hasAttachment = !!assignment.attachment_url || !!assignment.attachment;
  const attachmentUrl = assignment.attachment_url || assignment.attachment;
  const isImage =
    assignment.attachment_resource_type === "image" ||
    (attachmentUrl && /\.(jpg|jpeg|png|gif|webp)$/i.test(attachmentUrl));

  // Delete handler with confirmation
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(assignment);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      layout
      className={`group relative flex flex-col rounded-xl border border-neutral-800 bg-neutral-900 hover:border-neutral-700 transition-colors duration-200 overflow-hidden 
       
      `}
    >
      {/* Status strip */}
      <div
        className={`h-[3px] w-full ${timeInfo.isLate ? "bg-red-500" : "bg-neutral-700"}`}
      />

      {/* Image preview */}
      {isImage && attachmentUrl && (
        <div className="h-32 w-full overflow-hidden border-b border-neutral-800 bg-neutral-950">
          <img
            src={attachmentUrl}
            alt={assignment.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1.5">
            <span className="inline-block px-2 py-0.5 rounded-md bg-neutral-800 text-[10px] font-bold uppercase tracking-wider text-neutral-400 border border-neutral-700">
              {assignment.subject}
            </span>
            <h3 className="text-[15px] font-semibold text-neutral-100 leading-snug line-clamp-1">
              {assignment.title}
            </h3>
          </div>

          {(onEdit || onDelete) && (
            <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(assignment);
                  }}
                  className="p-1.5 rounded-md hover:bg-neutral-800 text-neutral-500 hover:text-neutral-200 transition-colors"
                  aria-label="Edit assignment"
                >
                  <Pencil size={13} />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={handleDelete}
                  className="p-1.5 rounded-md hover:bg-red-500/10 text-neutral-500 hover:text-red-400 transition-colors"
                  aria-label="Delete assignment"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-[13px] text-neutral-500 line-clamp-2 leading-relaxed">
          {assignment.description}
        </p>

        {/* Meta row — highlighted */}
        <div className="flex items-center justify-between text-xs pt-1">
          <div
            className={`flex items-center gap-1.5 font-semibold ${timeInfo.color}`}
          >
            {timeInfo.isLate ? <AlertCircle size={13} /> : <Clock size={13} />}
            <span>{timeInfo.text}</span>
          </div>
          <span className="text-neutral-500">
            Max Marks{" "}
            <span className="text-neutral-200 font-semibold">
              {assignment.max_marks}
            </span>
          </span>
        </div>

        {/* Footer */}
        <div className="pt-3 mt-auto border-t border-neutral-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 shrink-0 rounded-md bg-neutral-950 border border-neutral-800 flex items-center justify-center text-neutral-500">
              <FileText size={13} />
            </div>
            {hasAttachment ? (
              <span className="text-xs text-neutral-400 truncate">
                {isImage ? "Image attached" : "File attached"}
              </span>
            ) : (
              <span className="text-xs text-neutral-600 italic">
                No attachment
              </span>
            )}
            <span className="ml-1 px-2 py-0.5 rounded-md bg-neutral-950 border border-neutral-800 text-[10px] font-bold text-neutral-400 shrink-0">
              Year {assignment.target_year}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onView?.(assignment);
            }}
            className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium transition-colors"
          >
            View info
            <ArrowUpRight size={13} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default AssignmentCard;
