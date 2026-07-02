import { motion } from "framer-motion";
import {
  Pin,
  Calendar,
  Globe,
  Building2,
  Pencil,
  Trash2,
} from "lucide-react";

function NoticeCard({
  notice,
  onEdit,
  onDelete,
  onTogglePin,
}) {
  if (!notice) return null;

  const {
    title = "",
    body = "",
    category = "",
    scope = "",
    department = "",
    image = "",
    is_pinned = false,
    posted_by = "",
    created_at = ""
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

      // If in the future or system time mismatch
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

  // Extract initials for the posted_by avatar
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
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.005 }}
      transition={{ 
        duration: 0.3, 
        ease: [0.25, 1, 0.5, 1] 
      }}
      className={`relative flex flex-col justify-between overflow-hidden rounded-2xl bg-neutral-900/60 border backdrop-blur-xl transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.4)] ${
        is_pinned
          ? "border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.08)] bg-neutral-900/70"
          : "border-neutral-800/80 hover:border-neutral-700/80"
      }`}
    >
      {/* Pinned Glow Overlay */}
      {is_pinned && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500" />
      )}

      {/* Notice Image */}
      {image && (
        <div className="relative w-full h-44 overflow-hidden border-b border-neutral-800/50">
          <img
            src={typeof image === "string" ? image : image?.preview}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
          {/* Subtle image bottom vignette gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/20 to-transparent pointer-events-none" />
        </div>
      )}

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col gap-4">
        
        {/* Top Badges & Meta Row */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            {/* Scope Badge */}
            {scope && (
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  isScopeDepartment
                    ? "bg-violet-500/10 text-violet-400 border border-violet-500/20"
                    : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                }`}
              >
                {isScopeDepartment ? (
                  <Building2 size={10} strokeWidth={2} />
                ) : (
                  <Globe size={10} strokeWidth={2} />
                )}
                {scope}
              </span>
            )}

            {/* Category Badge */}
            {category && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-neutral-800 text-neutral-400 border border-neutral-700/40">
                {category}
              </span>
            )}
          </div>

          {/* Pin Icon / Badge */}
          {is_pinned && (
            <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/25">
              <Pin size={10} strokeWidth={2} className="rotate-45" />
              <span>Pinned</span>
            </div>
          )}
        </div>

        {/* Title and Body */}
        <div className="space-y-2 flex-1">
          <h3 className="text-[15px] font-semibold text-neutral-100 tracking-tight leading-snug line-clamp-2 hover:text-white transition-colors duration-150">
            {title}
          </h3>
          
          <p className="text-[13px] text-neutral-400 leading-relaxed line-clamp-3 font-normal">
            {body}
          </p>

          {/* Department Detail (when scope is department) */}
          {isScopeDepartment && department && (
            <div className="pt-1">
              <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-violet-500" />
                Department: {department}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info Row */}
      <div className="px-5 py-4 border-t border-neutral-800/40 bg-neutral-900/20 flex items-center justify-between gap-3 flex-wrap">
        
        {/* Poster identity info */}
        {posted_by && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-[10px] font-semibold text-neutral-300 shadow-inner">
              {getInitials(posted_by)}
            </div>
            <span className="text-[11px] font-medium text-neutral-400 tracking-wide">
              {posted_by}
            </span>
          </div>
        )}

        <div className="px-5 py-4 border-t border-neutral-800/40 bg-neutral-900/20 flex items-center justify-between gap-3 flex-wrap">

  <div className="flex items-center gap-3">

    {posted_by && (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-[10px] font-semibold text-neutral-300">
          {getInitials(posted_by)}
        </div>

        <span className="text-[11px] text-neutral-400">
          {posted_by}
        </span>
      </div>
    )}

  </div>

  <div className="flex items-center gap-2">

    <button
      onClick={() => onTogglePin?.(notice.id)}
      className="p-2 rounded-lg hover:bg-neutral-800 transition"
      title="Pin Notice"
    >
      <Pin
        size={15}
        className={
          is_pinned
            ? "text-indigo-400 fill-indigo-400"
            : "text-neutral-500"
        }
      />
    </button>

    <button
      onClick={() => onEdit?.(notice)}
      className="p-2 rounded-lg hover:bg-neutral-800 transition"
      title="Edit Notice"
    >
      <Pencil
        size={15}
        className="text-neutral-400"
      />
    </button>

    <button
      onClick={() => onDelete?.(notice.id)}
      className="p-2 rounded-lg hover:bg-red-500/10 transition"
      title="Delete Notice"
    >
      <Trash2
        size={15}
        className="text-red-400"
      />
    </button>

    {created_at && (
      <div className="flex items-center gap-1 text-neutral-500 text-[10px] ml-3">
        <Calendar size={12} />
        <span>{formattedDate}</span>
      </div>
    )}

  </div>

</div>

        {/* Created Date */}
        {created_at && (
          <div className="flex items-center gap-1.5 text-neutral-500 text-[10px] font-medium tracking-wide">
            <Calendar size={12} strokeWidth={1.5} className="shrink-0" />
            <span>{formattedDate}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default NoticeCard;
