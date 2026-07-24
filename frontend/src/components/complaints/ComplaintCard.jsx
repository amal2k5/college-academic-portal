import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, CheckCircle, Clock, MoreVertical, ShieldAlert, Paperclip } from "lucide-react";
import ConfirmModal from "../common/ConfirmModal";
import AttachmentViewer from "./AttachmentViewer";

const statusConfig = {
  PENDING: { color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20", icon: Clock, label: "Pending" },
  SUBMITTED: { color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20", icon: Clock, label: "Submitted" },
  SEEN: { color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", icon: Eye, label: "Seen" },
  RESOLVED: { color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20", icon: CheckCircle, label: "Resolved" },
};

const ComplaintCard = ({ complaint, role, onUpdateStatus, clampDescription = true }) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  // Fallback to "PENDING" if status not found
  const statusKey = complaint.status?.toUpperCase() || "PENDING";
  const { color, bg, border, icon: StatusIcon, label } = statusConfig[statusKey] || statusConfig.PENDING;

  const handleActionClick = (action) => {
    setPendingAction(action);
    setIsConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!pendingAction) return;
    setActionLoading(true);
    try {
      await onUpdateStatus(complaint.id || complaint.tracking_code || complaint.trackingCode, pendingAction);
      setIsConfirmOpen(false);
    } catch (error) {
      console.error("Failed to update status", error);
    } finally {
      setActionLoading(false);
    }
  };

  const code = complaint.tracking_code || complaint.trackingCode;
  const description = complaint.text || complaint.description;
  const createdDate = complaint.created_at || complaint.submittedDate;
  const updatedDate = complaint.updated_at;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 hover:border-neutral-700 transition-all flex flex-col gap-4"
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono text-neutral-400">#{code}</span>
              {complaint.scope && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-neutral-800 text-neutral-300">
                  {complaint.scope}
                </span>
              )}
            </div>
            {complaint.category && <h3 className="text-lg font-medium text-white">{complaint.category}</h3>}
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${bg} ${border} ${color}`}>
            <StatusIcon size={14} />
            <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
          </div>
        </div>

        {/* Description */}
        {(description) && (
          <div className="flex-1">
            <p className={`text-sm text-neutral-400 leading-relaxed whitespace-pre-wrap ${clampDescription ? "line-clamp-3" : ""}`}>
              {description}
            </p>
          </div>
        )}

        {/* Attachment */}
        <div className="pt-2">
          <AttachmentViewer url={complaint.attachment} />
        </div>

        {/* Resolution Note */}
        {complaint.resolution_note && (
          <div className="mt-2 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
            <h4 className="text-xs font-semibold text-green-500 uppercase tracking-wider mb-1">Resolution Note</h4>
            <p className="text-sm text-green-200/80">{complaint.resolution_note}</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-800/50 mt-auto">
          <div className="flex flex-col gap-1">
            <div className="text-xs text-neutral-500">
              Created: {createdDate ? new Date(createdDate).toLocaleDateString() : "Unknown"}
            </div>
            {updatedDate && (
              <div className="text-xs text-neutral-500">
                Updated: {new Date(updatedDate).toLocaleDateString()}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Action Buttons based on role and status */}
            {(role === "HOD" || role === "COLLEGE_ADMIN") && (
              <>
                {statusKey === "SUBMITTED" && (
                  <button
                    onClick={() => handleActionClick("SEEN")}
                    className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
                  >
                    <Eye size={14} />
                    Mark Seen
                  </button>
                )}
                
                {statusKey !== "RESOLVED" && (
                  <button
                    onClick={() => handleActionClick("RESOLVED")}
                    className="px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle size={14} />
                    Resolve
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </motion.div>

      <ConfirmModal
        open={isConfirmOpen}
        title="Update Complaint Status"
        message={`Are you sure you want to mark this complaint as ${pendingAction}?`}
        confirmText={`Mark as ${pendingAction}`}
        loading={actionLoading}
        onConfirm={handleConfirm}
        onCancel={() => !actionLoading && setIsConfirmOpen(false)}
      />
    </>
  );
};

export default ComplaintCard;
