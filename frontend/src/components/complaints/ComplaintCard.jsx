import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, CheckCircle, Clock, MoreVertical, ShieldAlert } from "lucide-react";
import ConfirmModal from "../common/ConfirmModal";

const statusConfig = {
  Pending: { color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20", icon: Clock },
  Seen: { color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", icon: Eye },
  Resolved: { color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20", icon: CheckCircle },
};

const ComplaintCard = ({ complaint, role, onUpdateStatus }) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const status = complaint.status || "Pending";
  const { color, bg, border, icon: StatusIcon } = statusConfig[status] || statusConfig.Pending;

  const handleActionClick = (action) => {
    setPendingAction(action);
    setIsConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!pendingAction) return;
    setActionLoading(true);
    try {
      await onUpdateStatus(complaint.id || complaint.trackingCode, pendingAction);
      setIsConfirmOpen(false);
    } catch (error) {
      console.error("Failed to update status", error);
    } finally {
      setActionLoading(false);
    }
  };

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
              <span className="text-sm font-mono text-neutral-400">#{complaint.trackingCode}</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-neutral-800 text-neutral-300">
                {complaint.scope}
              </span>
            </div>
            <h3 className="text-lg font-medium text-white">{complaint.category}</h3>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${bg} ${border} ${color}`}>
            <StatusIcon size={14} />
            <span className="text-xs font-semibold uppercase tracking-wider">{status}</span>
          </div>
        </div>

        {/* Description */}
        <div className="flex-1">
          <p className="text-sm text-neutral-400 line-clamp-3 leading-relaxed">
            {complaint.description}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-800/50 mt-auto">
          <div className="text-xs text-neutral-500">
            {complaint.submittedDate ? new Date(complaint.submittedDate).toLocaleDateString() : "Unknown Date"}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Action Buttons based on role and status */}
            {(role === "HOD" || role === "COLLEGE_ADMIN") && (
              <>
                {status === "Pending" && (
                  <button
                    onClick={() => handleActionClick("Seen")}
                    className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
                  >
                    <Eye size={14} />
                    Mark Seen
                  </button>
                )}
                
                {status !== "Resolved" && (
                  <button
                    onClick={() => handleActionClick("Resolved")}
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
