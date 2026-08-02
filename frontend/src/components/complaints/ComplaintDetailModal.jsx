import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle, Clock, Eye, Loader2, ArrowRight } from "lucide-react";
import AttachmentViewer from "./AttachmentViewer";
import { LoadingSpinner } from "../common/loading";

const statusConfig = {
  PENDING: { color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20", icon: Clock, label: "Pending" },
  SUBMITTED: { color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20", icon: Clock, label: "Submitted" },
  SEEN: { color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", icon: Eye, label: "Seen" },
  RESOLVED: { color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20", icon: CheckCircle, label: "Resolved" },
};

function StatusBadge({ status }) {
  const statusKey = status?.toUpperCase() || "PENDING";
  const { color, bg, border, icon: StatusIcon, label } = statusConfig[statusKey] || statusConfig.PENDING;
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${bg} ${border} ${color}`}>
      <StatusIcon size={14} />
      <span className="text-[11px] font-semibold uppercase tracking-wider">{label}</span>
    </span>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">{label}</span>
      <span className="text-sm text-neutral-200 font-medium">{value || "-"}</span>
    </div>
  );
}

function ComplaintDetailModal({ complaint, isOpen, onClose, onUpdateStatus, isUpdating }) {
  const [resolutionNote, setResolutionNote] = useState("");

  if (!isOpen || !complaint) return null;

  const currentStatus = complaint.status?.toUpperCase() || "PENDING";
  const canMarkSeen = currentStatus === "SUBMITTED";
  const canResolve = currentStatus === "SEEN" || currentStatus === "SUBMITTED";

  const handleUpdate = (newStatus) => {
    onUpdateStatus(complaint.id || complaint.tracking_code, newStatus, newStatus === "RESOLVED" ? resolutionNote : "");
  };

  const text = complaint.text || complaint.description || "No description provided.";
  const history = complaint.history || [];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget && !isUpdating) onClose();
        }}
      >
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 12 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="w-full max-w-3xl overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-4 px-6 py-5 border-b border-neutral-800 bg-neutral-950/50 flex-shrink-0">
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-neutral-500 uppercase tracking-widest font-semibold">Tracking Code</span>
                <span className="text-lg font-mono font-bold text-white tracking-wide">#{complaint.tracking_code || complaint.trackingCode}</span>
              </div>
              <div className="h-8 w-px bg-neutral-800 mx-2"></div>
              <StatusBadge status={complaint.status} />
            </div>
            <button
              onClick={onClose}
              disabled={isUpdating}
              className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors disabled:opacity-50"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
            
            {/* Information Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 bg-neutral-950/30 p-5 rounded-xl border border-neutral-800/50">
              <InfoItem label="Category" value={complaint.category} />
              <InfoItem label="Scope" value={complaint.scope} />
              <InfoItem label="College" value={complaint.college} />
              <InfoItem label="Department" value={complaint.department} />
              <InfoItem label="Submitted Date" value={complaint.created_at ? new Date(complaint.created_at).toLocaleString() : "-"} />
              <InfoItem label="Updated Date" value={complaint.updated_at ? new Date(complaint.updated_at).toLocaleString() : "-"} />
            </div>

            {/* Complaint Description */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                Description
              </h3>
              <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-950/50 shadow-inner">
                <p className="text-sm text-neutral-300 whitespace-pre-wrap leading-relaxed">
                  {text}
                </p>
              </div>
            </div>

            {/* Attachment Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                Attachment
              </h3>
              <AttachmentViewer url={complaint.attachment} className="max-w-md" />
            </div>

            {/* Resolution Section */}
            {(complaint.resolution_note || currentStatus === "RESOLVED") && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-green-500 uppercase tracking-wider flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  Resolution Note
                </h3>
                <div className="p-5 rounded-xl border border-green-500/20 bg-green-500/10 shadow-inner">
                  <p className="text-sm text-green-200/90 leading-relaxed">
                    {complaint.resolution_note || "Resolved successfully without additional notes."}
                  </p>
                </div>
              </div>
            )}

            {/* History Section */}
            {history.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                  Status History
                </h3>
                <div className="relative pl-4 space-y-6 before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-neutral-800">
                  {history.map((record, idx) => (
                    <div key={record.id || idx} className="relative pl-6">
                      <div className="absolute left-[-11px] top-1.5 w-2 h-2 rounded-full bg-neutral-500 ring-4 ring-neutral-900 z-10"></div>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                            <span className="text-neutral-500">{record.old_status}</span>
                            <ArrowRight size={12} className="text-neutral-600" />
                            <span className="text-white">{record.new_status}</span>
                          </div>
                          <span className="text-[10px] text-neutral-500 font-medium">
                            {new Date(record.changed_at).toLocaleString()}
                          </span>
                        </div>
                        <div className="text-xs text-neutral-400 font-medium">
                          By: <span className="text-neutral-300">{record.changed_by || "System"}</span>
                        </div>
                        {record.note && (
                          <div className="mt-1 p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-400">
                            {record.note}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Resolution Note Input (if resolving) */}
            {onUpdateStatus && currentStatus !== "RESOLVED" && (
              <div className="pt-6 border-t border-neutral-800/50 space-y-3">
                <label className="text-sm font-semibold text-neutral-300 uppercase tracking-wider">Add Resolution Note (required to resolve)</label>
                <textarea
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="Enter details about how this complaint was resolved..."
                  rows={3}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-5 py-4 text-white placeholder-neutral-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none text-sm shadow-inner"
                />
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="border-t border-neutral-800 px-6 py-5 flex items-center justify-between bg-neutral-950 flex-shrink-0">
            <button
              onClick={onClose}
              disabled={isUpdating}
              className="px-5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 text-sm font-medium transition-colors disabled:opacity-50 shadow-sm"
            >
              Close Window
            </button>

            {onUpdateStatus && (
              <div className="flex items-center gap-3">
                {canMarkSeen && (
                  <button
                    onClick={() => handleUpdate("SEEN")}
                    disabled={isUpdating}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-semibold transition-all hover:bg-blue-600 disabled:opacity-50 shadow-lg shadow-blue-500/20"
                  >
                    {isUpdating ? <LoadingSpinner size={16} color="border-t-white border-white/30" /> : <Eye size={16} />}
                    Mark as Seen
                  </button>
                )}

                {currentStatus !== "RESOLVED" && (
                  <button
                    onClick={() => handleUpdate("RESOLVED")}
                    disabled={isUpdating || !resolutionNote.trim()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-xl text-sm font-semibold transition-all hover:bg-green-600 disabled:opacity-50 shadow-lg shadow-green-500/20"
                  >
                    {isUpdating ? <LoadingSpinner size={16} color="border-t-white border-white/30" /> : <CheckCircle size={16} />}
                    Resolve Complaint
                  </button>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ComplaintDetailModal;
