import { motion } from "framer-motion";
import { GraduationCap, Info } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export default function EmptyMarks({ type = "default" }) {
  if (type === "no-students") {
    return (
      <motion.div
        variants={fadeUp}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-4">
          <Info size={22} className="text-neutral-600" />
        </div>
        <p className="text-sm text-neutral-400">
          No students found for this selection.
        </p>
        <p className="text-[11px] text-neutral-600 mt-1">
          Students need to be added to the department before marks can be entered.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={fadeUp}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-5">
        <GraduationCap size={24} className="text-neutral-600" />
      </div>
      <p className="text-sm text-neutral-400 mb-1">
        Select a semester, subject and exam to begin
      </p>
      <p className="text-[11px] text-neutral-600">
        Student marks will appear here once you select an exam.
      </p>
    </motion.div>
  );
}
