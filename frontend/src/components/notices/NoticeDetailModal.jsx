import { AnimatePresence, motion } from "framer-motion";
import { X, Pin, Calendar, Globe, Building2, User, FileText } from "lucide-react";

function NoticeDetailModal({ notice, onClose }) {
  if (!notice) return null;

  const {
    title,
    body,
    category,
    scope,
    department,
    image,
    image_url,
    is_pinned,
    posted_by_name,
    created_at,
  } = notice;

  const imageSrc = image_url || (typeof image === "string" ? image : image?.preview);

  const formattedDate = created_at
    ? new Date(created_at).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "";

  const getScopeIcon = () => {
    if (scope?.toUpperCase() === "DEPARTMENT") {
      return <Building2 size={14} />;
    }
    return <Globe size={14} />;
  };

  const getScopeColor = () => {
    if (scope?.toUpperCase() === "DEPARTMENT") {
      return "bg-violet-500/10 text-violet-400 border-violet-500/20";
    }
    return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl border border-neutral-800/60 bg-neutral-900/95 backdrop-blur-xl shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-neutral-800/50">
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                {scope && (
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getScopeColor()}`}
                  >
                    {getScopeIcon()}
                    {scope}
                  </span>
                )}

                {category && (
                  <span className="px-2.5 py-1 rounded-full bg-neutral-800/50 text-neutral-300 text-xs font-medium border border-neutral-700/50">
                    {category}
                  </span>
                )}

                {is_pinned && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-medium">
                    <Pin size={12} />
                    Pinned
                  </span>
                )}
              </div>

              <h2 className="text-xl font-semibold text-white leading-tight">
                {title}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="flex-shrink-0 p-1.5 rounded-lg hover:bg-neutral-800/50 text-neutral-500 hover:text-neutral-300 transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {imageSrc && (
              <div className="relative w-full pt-[40%] bg-neutral-950">
                <img
                  src={imageSrc}
                  alt={title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            )}

            <div className="px-6 py-5 space-y-5">
              {/* Content */}
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <FileText size={15} className="text-neutral-500" />
                  <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Details
                  </h3>
                </div>
                <p className="text-neutral-300 whitespace-pre-wrap leading-relaxed text-sm">
                  {body}
                </p>
              </div>

              {/* Department Info */}
              {scope?.toUpperCase() === "DEPARTMENT" && department && (
                <div className="rounded-lg border border-neutral-800/50 bg-neutral-800/30 px-4 py-3">
                  <p className="text-xs text-neutral-500 mb-1">Department</p>
                  <p className="text-sm text-white">{department}</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-neutral-800/50 px-6 py-4 flex flex-wrap items-center justify-between gap-3 bg-neutral-900/30">
            <div className="flex items-center gap-4 text-xs text-neutral-400">
              {posted_by_name && (
                <div className="flex items-center gap-1.5">
                  <User size={14} />
                  <span>{posted_by_name}</span>
                </div>
              )}

              {formattedDate && (
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  <span>{formattedDate}</span>
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-neutral-800/50 hover:bg-neutral-700/50 text-white text-sm transition border border-neutral-700/50"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default NoticeDetailModal;