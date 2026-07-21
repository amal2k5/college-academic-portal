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
    department_name,
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
  const isDept = scope?.toUpperCase() === "DEPARTMENT";
  const getScopeIcon = () => (isDept ? <Building2 size={14} /> : <Globe size={14} />);
  const getScopeColor = () =>
    isDept
      ? "bg-violet-500/10 text-violet-400 border-violet-500/20"
      : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 12 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl flex flex-col"
        >
          {/* Gradient top strip */}
          <div className="h-[3px] w-full bg-gradient-to-r from-indigo-600 via-violet-500 to-cyan-500 flex-shrink-0" />
          {/* Header */}
          <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-neutral-800 flex-shrink-0">
            <div className="flex-1 min-w-0 space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                {scope && (
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide border ${getScopeColor()}`}
                  >
                    {getScopeIcon()}
                    {scope}
                  </span>
                )}

                {category && (
                  <span className="px-2.5 py-1 rounded-full bg-neutral-800 text-neutral-300 text-[11px] font-semibold uppercase tracking-wide border border-neutral-700">
                    {category}
                  </span>
                )}

                {is_pinned && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-semibold uppercase tracking-wide">
                    <Pin size={12} />
                    Pinned
                  </span>
                )}
              </div>

              <h2 className="text-xl font-semibold text-neutral-100 leading-snug tracking-tight">
                {title}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="flex-shrink-0 p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-500 hover:text-neutral-200 transition-colors duration-200 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {imageSrc && (
              <div className="w-full bg-neutral-950 flex items-center justify-center border-b border-neutral-800 max-h-[380px] overflow-hidden">
                <img
                  src={imageSrc}
                  alt={title}
                  className="w-full h-full object-contain max-h-[380px]"
                />
              </div>
            )}

            <div className="px-6 py-5 space-y-5">
              {/* Content */}
              <div className="rounded-xl border border-neutral-800 bg-neutral-800/40 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-md bg-indigo-500/10 flex items-center justify-center">
                    <FileText size={13} className="text-indigo-400" />
                  </div>
                  <h3 className="text-[11px] font-semibold text-neutral-400 uppercase tracking-[0.15em]">
                    Details
                  </h3>
                </div>
                <p className="text-neutral-200 whitespace-pre-wrap leading-relaxed text-[13px]">
                  {body}
                </p>
              </div>

              {/* Department Info */}
              {isDept && (department_name || department) && (
                <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 px-4 py-3.5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                    <Building2 size={15} className="text-violet-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-wide mb-0.5">
                      Department
                    </p>
                    <p className="text-sm text-neutral-100 font-medium">
                      {department_name || department}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-neutral-800 px-6 py-4 flex flex-wrap items-center justify-between gap-3 bg-neutral-900 flex-shrink-0">
            <div className="flex items-center gap-4 text-[12px] text-neutral-400">
              {posted_by_name && (
                <div className="flex items-center gap-1.5">
                  <User size={13} className="text-neutral-500" />
                  <span>{posted_by_name}</span>
                </div>
              )}

              {formattedDate && (
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-neutral-500" />
                  <span>{formattedDate}</span>
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[13px] font-medium transition-colors duration-200 border border-neutral-700 cursor-pointer"
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