import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Loader2, X } from "lucide-react";

export default function DeleteExamDialog({
  open,
  loading = false,
  onConfirm,
  onCancel,
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={(e) => {
            if (loading) return;
            if (e.target === e.currentTarget) {
              onCancel();
            }
          }}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ 
              duration: 0.25,
              ease: "easeOut"
            }}
            className="w-full max-w-[420px] rounded-2xl border border-neutral-800/60 bg-neutral-900/95 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800/50">
              <h3 className="text-sm font-medium text-white">Cancel Exam?</h3>
              <button
                onClick={onCancel}
                disabled={loading}
                className="p-1 rounded-lg hover:bg-neutral-800 text-neutral-500 hover:text-neutral-300 transition-colors disabled:opacity-50"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-5">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="h-10 w-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <AlertTriangle className="text-red-400" size={18} />
                  </div>
                </div>
                <div>
                  <p className="text-[15px] text-neutral-200 leading-relaxed">
                    Are you sure you want to cancel this exam? This will mark it as cancelled but will not permanently delete it.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-800/50 bg-neutral-900/30">
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="px-4 py-2 rounded-lg border border-neutral-700 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50 transition text-sm font-medium disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white transition text-sm font-medium disabled:opacity-50 flex items-center gap-2 shadow-[0_4px_12px_rgba(239,68,68,0.25)] hover:shadow-[0_4px_16px_rgba(239,68,68,0.35)]"
              >
                {loading && <Loader2 size={14} className="animate-spin" />}
                Confirm
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
