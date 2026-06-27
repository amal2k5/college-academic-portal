import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

const RequestDetailsModal = ({
  isOpen,
  request,
  onClose,
  onApprove,
  onReject,
}) => {
  if (!isOpen || !request) return null;

  const statusClasses = {
    PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    APPROVED: "bg-green-500/20 text-green-400 border-green-500/30",
    REJECTED: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  const DetailItem = ({ label, value }) => (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
        {label}
      </p>

      <p className="rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm text-neutral-200">
        {value || "-"}
      </p>
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-3xl rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl"
        >
          {/* Header */}

          <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-5">
            <div>
              <h2 className="text-2xl font-semibold text-white">
                Registration Details
              </h2>

              <p className="mt-1 text-sm text-neutral-400">
                Review the submitted college registration request.
              </p>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-2 text-neutral-400 transition hover:bg-neutral-800 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}

          <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">

            <DetailItem
              label="College Name"
              value={request.college_name}
            />

            <DetailItem
              label="Contact Person"
              value={request.contact_person}
            />

            <DetailItem
              label="Official Email"
              value={request.email}
            />

            <DetailItem
              label="Phone Number"
              value={request.phone}
            />

            <div className="md:col-span-2">
              <DetailItem
                label="College Address"
                value={request.address}
              />
            </div>

            <DetailItem
              label="City"
              value={request.city}
            />

            <DetailItem
              label="State"
              value={request.state}
            />

            <div className="md:col-span-2">
              <DetailItem
                label="Additional Notes"
                value={request.notes}
              />
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Status
              </p>

              <span
                className={`rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-wider ${
                  statusClasses[request.status]
                }`}
              >
                {request.status}
              </span>
            </div>

            <DetailItem
              label="Submitted On"
              value={new Date(
                request.created_at
              ).toLocaleString()}
            />

          </div>

          {/* Footer */}

          <div className="flex flex-col-reverse gap-3 border-t border-neutral-800 px-6 py-5 md:flex-row md:justify-end">

            <button
              onClick={onClose}
              className="rounded-xl border border-neutral-700 px-5 py-3 text-white transition hover:bg-neutral-800"
            >
              Close
            </button>

            {request.status === "PENDING" && (
              <>
                <button
                  onClick={onReject}
                  className="rounded-xl bg-red-600 px-5 py-3 font-medium text-white transition hover:bg-red-500"
                >
                  Reject
                </button>

                <button
                  onClick={onApprove}
                  className="rounded-xl bg-green-600 px-5 py-3 font-medium text-white transition hover:bg-green-500"
                >
                  Approve
                </button>
              </>
            )}

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RequestDetailsModal;