import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  CheckCheck,
  Ban,
  Loader2,
} from "lucide-react";
import { LoadingSpinner } from "../common/loading";

const statusConfig = {
  PENDING: {
    label: "Pending Review",
    icon: Clock,
    class: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  APPROVED: {
    label: "Approved",
    icon: CheckCircle2,
    class: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  REJECTED: {
    label: "Rejected",
    icon: XCircle,
    class: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  },
};

const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="space-y-2">
    <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-[0.18em] flex items-center gap-1.5">
      {Icon && <Icon size={11} strokeWidth={1.6} />}
      {label}
    </p>
    <p className="text-[13px] font-medium text-neutral-200 bg-neutral-800/60 border border-neutral-700/60 rounded-xl px-4 py-3 break-words leading-relaxed">
      {value || "—"}
    </p>
  </div>
);

const RequestDetailsModal = ({
  isOpen,
  request,
  onClose,
  onApprove,
  onReject,
  isApproving,
}) => {
  if (!isOpen || !request) return null;

  const status = statusConfig[request.status] || statusConfig.PENDING;
  const StatusIcon = status.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Top accent strip */}
            <div className="h-[3px] w-full bg-gradient-to-r from-indigo-600 via-violet-500 to-indigo-600 shrink-0" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4 shrink-0">
              <div className="min-w-0 flex-1">
                <h2 className="text-[15px] font-semibold text-white tracking-tight">
                  Registration Details
                </h2>
                <p className="text-[11px] text-neutral-500 mt-0.5 tracking-wide">
                  {request.college_name}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="ml-4 p-2 rounded-xl text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800 border border-transparent hover:border-neutral-700 transition-all duration-200 shrink-0 cursor-pointer"
              >
                <X size={15} strokeWidth={1.6} />
              </motion.button>
            </div>

            {/* Body */}
            <div
              className="p-6 overflow-y-auto flex-1"
              style={{ scrollbarWidth: "thin", scrollbarColor: "#404040 transparent" }}
            >
              <style>{`
                .modal-body::-webkit-scrollbar { width: 4px; }
                .modal-body::-webkit-scrollbar-track { background: transparent; }
                .modal-body::-webkit-scrollbar-thumb { background-color: #404040; border-radius: 999px; }
                .modal-body::-webkit-scrollbar-thumb:hover { background-color: #525252; }
              `}</style>

              <div className="modal-body grid grid-cols-1 md:grid-cols-2 gap-4">

                <DetailItem icon={Building2} label="College Name" value={request.college_name} />
                <DetailItem icon={User} label="Contact Person" value={request.contact_person} />
                <DetailItem icon={Mail} label="Official Email" value={request.email} />
                <DetailItem icon={Phone} label="Phone Number" value={request.phone} />

                <div className="md:col-span-2">
                  <DetailItem icon={MapPin} label="College Address" value={request.address} />
                </div>

                <DetailItem label="City" value={request.city} />
                <DetailItem label="State" value={request.state} />

                <div className="md:col-span-2">
                  <DetailItem icon={FileText} label="Additional Notes" value={request.notes} />
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-[0.18em]">
                    Status
                  </p>
                  <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-semibold border ${status.class}`}>
                    <StatusIcon size={12} strokeWidth={2} />
                    {status.label}
                  </span>
                </div>

                <DetailItem
                  icon={Calendar}
                  label="Submitted On"
                  value={new Date(request.created_at).toLocaleString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                />

              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col-reverse sm:flex-row items-center gap-2 border-t border-neutral-800 px-6 py-4 shrink-0">

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-neutral-700 hover:border-neutral-600 text-neutral-400 hover:text-neutral-200 transition-all duration-200 text-[11px] font-semibold uppercase tracking-widest cursor-pointer"
              >
                Close
              </motion.button>

              {request.status === "PENDING" && (
                <div className="flex gap-2 w-full sm:w-auto sm:ml-auto">
                  <motion.button
                    whileHover={!isApproving ? { scale: 1.01 } : {}}
                    whileTap={!isApproving ? { scale: 0.98 } : {}}
                    onClick={onReject}
                    disabled={isApproving}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 hover:border-rose-500/40 transition-all duration-200 text-[11px] font-semibold uppercase tracking-widest cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Ban size={13} strokeWidth={2} />
                    Reject
                  </motion.button>

                  <motion.button
                    whileHover={!isApproving ? { scale: 1.01 } : {}}
                    whileTap={!isApproving ? { scale: 0.98 } : {}}
                    onClick={onApprove}
                    disabled={isApproving}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-200 text-[11px] font-semibold uppercase tracking-widest cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isApproving ? (
                      <LoadingSpinner size={13} color="border-t-emerald-400 border-emerald-500/30" />
                    ) : (
                      <CheckCheck size={13} strokeWidth={2} />
                    )}
                    {isApproving ? "Approving..." : "Approve"}
                  </motion.button>
                </div>
              )}

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RequestDetailsModal;