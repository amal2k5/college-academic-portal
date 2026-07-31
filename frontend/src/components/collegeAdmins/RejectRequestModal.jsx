import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Loader2 } from "lucide-react";

const RejectRequestModal = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setReason("");
      setError("");
      setLoading(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reason.trim()) {
      setError("Rejection reason is required.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await onSubmit(reason.trim());
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl"
        >
          {/* Header */}

          <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-5">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Reject Registration Request
              </h2>

              <p className="mt-1 text-sm text-neutral-400">
                Please provide a reason for rejecting this request.
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

          <form onSubmit={handleSubmit}>

            <div className="p-6">

              <label className="mb-2 block text-sm font-medium text-neutral-300">
                Rejection Reason
              </label>

              <textarea
                rows={5}
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);

                  if (error) {
                    setError("");
                  }
                }}
                placeholder="Enter the reason for rejecting this registration request..."
                className={`w-full resize-none rounded-xl border bg-neutral-950 px-4 py-3 text-white outline-none transition ${
                  error
                    ? "border-red-500"
                    : "border-neutral-700 focus:border-red-500"
                }`}
              />

              {error && (
                <p className="mt-2 text-sm text-red-400">
                  {error}
                </p>
              )}

            </div>

            {/* Footer */}

            <div className="flex flex-col-reverse gap-3 border-t border-neutral-800 px-6 py-5 md:flex-row md:justify-end">

              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="rounded-xl border border-neutral-700 px-5 py-3 text-white transition hover:bg-neutral-800 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-medium text-white transition hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? "Rejecting..." : "Reject Request"}
              </button>

            </div>

          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RejectRequestModal;