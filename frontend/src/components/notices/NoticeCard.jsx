import { motion } from "framer-motion";
import { Pin, Calendar, Globe, Building2, Pencil, Trash2, ArrowUpRight } from "lucide-react";

function NoticeCard({ notice, canManage, onEdit, onDelete, onTogglePin, onView }) {
  if (!notice) return null;

  const {
    title = "",
    body = "",
    category = "",
    scope = "",
    department = "",
    image = "",
    image_url = "",
    is_pinned = false,
    posted_by_name = "",
    created_at = "",
  } = notice;

  const getFormattedDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;

      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMs < 0) {
        return date.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      }

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays}d ago`;

      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const isScopeDepartment = scope?.toUpperCase() === "DEPARTMENT";
  const formattedDate = getFormattedDate(created_at);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`group border-l-4 ${
        is_pinned 
          ? "border-indigo-400 bg-neutral-900" 
          : "border-neutral-700 bg-neutral-900/80 hover:bg-neutral-900"
      } transition-colors`}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            {scope && (
              <span className={`text-xs font-medium ${
                isScopeDepartment ? "text-violet-400" : "text-indigo-400"
              }`}>
                {scope}
              </span>
            )}

            {category && (
              <span className="text-xs text-neutral-400">
                • {category}
              </span>
            )}

            {is_pinned && (
              <span className="flex items-center gap-1 text-xs text-indigo-400">
                <Pin size={12} />
                Pinned
              </span>
            )}
          </div>

          {canManage && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {onTogglePin && (
                <button
                  onClick={() => onTogglePin(notice.id)}
                  className="p-1.5 hover:bg-neutral-800 rounded transition"
                >
                  <Pin size={14} className={is_pinned ? "text-indigo-400" : "text-neutral-500"} />
                </button>
              )}
              {onEdit && (
                <button
                  onClick={() => onEdit(notice)}
                  className="p-1.5 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white transition"
                >
                  <Pencil size={14} />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(notice.id)}
                  className="p-1.5 hover:bg-red-500/10 rounded text-neutral-400 hover:text-red-400 transition"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Image */}
        {(image_url || image) && (
          <div className="w-full h-48 mb-3 overflow-hidden bg-neutral-800">
            <img
              src={image_url || (typeof image === "string" ? image : image?.preview)}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
        )}

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-base font-medium text-white leading-snug">
            {title}
          </h3>

          <p className="text-sm text-neutral-300 leading-relaxed line-clamp-2">
            {body}
          </p>

          {isScopeDepartment && department && (
            <p className="text-xs text-neutral-400 flex items-center gap-1.5">
              <Building2 size={12} />
              {department}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-neutral-800">
          <div className="flex items-center gap-2">
            {posted_by_name && (
              <>
                <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-medium text-neutral-300">
                  {getInitials(posted_by_name)}
                </div>
                <span className="text-xs text-neutral-300">
                  {posted_by_name}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {onView && (
              <button
                onClick={() => onView(notice)}
                className="flex items-center gap-1 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium transition"
              >
                View
                <ArrowUpRight size={13} />
              </button>
            )}

            {created_at && (
              <div className="flex items-center gap-1 text-xs text-neutral-400">
                <Calendar size={12} />
                <span>{formattedDate}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default NoticeCard;