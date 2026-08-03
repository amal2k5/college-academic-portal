import { AnimatePresence, motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { LoadingButton } from "../common/loading";

/**
 * Reusable delete confirmation dialog.
 *
 * Props:
 *   isOpen     – boolean, controls visibility
 *   onCancel   – called when the user cancels
 *   onConfirm  – async function called when the user confirms; should throw on error
 */
function DeleteConfirmDialog({ isOpen, onCancel, onConfirm }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onConfirm();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="delete-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget && !deleting) onCancel();
          }}
        >
          <motion.div
            key="delete-dialog"
            initial={{ scale: 0.95, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="w-full max-w-sm rounded-2xl border border-neutral-800/60 bg-neutral-900/95 backdrop-blur-xl shadow-2xl overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-desc"
          >
            {/* Icon accent */}
            <div className="px-6 pt-6 pb-0 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                <Trash2 size={16} className="text-red-400" />
              </div>
              <h2
                id="delete-dialog-title"
                className="text-base font-semibold text-white"
              >
                Delete Notice
              </h2>
            </div>

            {/* Body */}
            <div className="px-6 py-4">
              <p
                id="delete-dialog-desc"
                className="text-sm text-neutral-400 leading-relaxed"
              >
                Are you sure you want to delete this notice?
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                This action cannot be undone.
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-neutral-800/50" />

            {/* Actions */}
            <div className="px-6 py-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onCancel}
                disabled={deleting}
                className="px-4 py-2 rounded-lg text-sm font-medium text-neutral-300 bg-neutral-800/50 hover:bg-neutral-700/50 border border-neutral-700/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>

              <LoadingButton
                type="button"
                onClick={handleDelete}
                loading={deleting}
                spinnerSize={14}
                icon={<Trash2 size={14} />}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-500 active:bg-red-700 transition disabled:opacity-60 disabled:cursor-not-allowed min-w-[120px] justify-center"
              >
                Delete Notice
              </LoadingButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default DeleteConfirmDialog;
