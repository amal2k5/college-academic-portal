import { AnimatePresence, motion } from "framer-motion";
import { X, Building2, User, Mail, Phone, MapPin, Calendar, FileText } from "lucide-react";

const RequestDetailsModal = ({
  isOpen,
  request,
  onClose,
  onApprove,
  onReject,
}) => {
  if (!isOpen || !request) return null;

  const statusClasses = {
    PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    APPROVED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    REJECTED: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  const statusIcons = {
    PENDING: "⏳",
    APPROVED: "✅",
    REJECTED: "❌",
  };

  const DetailItem = ({ icon: Icon, label, value }) => (
    <div className="space-y-1.5">
      <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
        {Icon && <Icon className="w-3.5 h-3.5" />}
        {label}
      </p>
      <p className="text-sm text-neutral-200 bg-neutral-900/50 border border-neutral-800 rounded-lg px-3.5 py-2.5">
        {value || "—"}
      </p>
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl rounded-xl border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-4">
            <div>
              <h2 className="text-lg font-medium text-white">
                Registration Details
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Review the submitted college registration request
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div>
                <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider mb-1.5">
                  Status
                </p>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${statusClasses[request.status]}`}>
                  {statusIcons[request.status]} {request.status}
                </span>
              </div>

              <DetailItem icon={Calendar} label="Submitted On" value={new Date(request.created_at).toLocaleString()} />
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse md:flex-row gap-2 border-t border-neutral-800 px-5 py-4 bg-neutral-900/50">
            <button
              onClick={onClose}
              className="flex-1 md:flex-none px-5 py-2 rounded-lg border border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors text-sm font-medium"
            >
              Close
            </button>

            {request.status === "PENDING" && (
              <div className="flex gap-2 flex-1 md:flex-none">
                <button
                  onClick={onReject}
                  className="flex-1 md:flex-none px-5 py-2 rounded-lg bg-red-600/10 text-red-400 hover:bg-red-600/20 border border-red-600/20 transition-colors text-sm font-medium"
                >
                  Reject
                </button>
                <button
                  onClick={onApprove}
                  className="flex-1 md:flex-none px-5 py-2 rounded-lg bg-emerald-600/10 text-emerald-400 hover:bg-emerald-600/20 border border-emerald-600/20 transition-colors text-sm font-medium"
                >
                  Approve
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RequestDetailsModal;