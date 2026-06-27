import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";

const StatusModal = ({
  isOpen,
  type = "success",
  title,
  message,
  onClose,
}) => {
  if (!isOpen) return null;

  const isSuccess = type === "success";

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.9,
            y: 20,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            scale: 0.9,
            y: 20,
          }}
          transition={{
            duration: 0.25,
          }}
          className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl"
        >
          {/* Close Button */}

          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 transition hover:text-gray-700"
          >
            <X size={20} />
          </button>

          {/* Content */}

          <div className="px-8 py-10 text-center">
            <div
              className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${
                isSuccess
                  ? "bg-green-100"
                  : "bg-red-100"
              }`}
            >
              {isSuccess ? (
                <CheckCircle
                  size={42}
                  className="text-green-600"
                />
              ) : (
                <AlertCircle
                  size={42}
                  className="text-red-600"
                />
              )}
            </div>

            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              {title}
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              {message}
            </p>

            <button
              onClick={onClose}
              className={`mt-8 w-full rounded-xl px-5 py-3 font-semibold text-white transition ${
                isSuccess
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {isSuccess ? "Continue" : "Try Again"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StatusModal;