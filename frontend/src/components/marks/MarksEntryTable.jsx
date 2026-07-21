import { motion } from "framer-motion";
import { MarksTableRow, MarksMobileCard } from "./MarksRow";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.04 } },
};

export default function MarksEntryTable({ students, marksMap, maxMarks, onMarksChange }) {
  return (
    <>
      {/* ── Desktop Table ──────────────────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="hidden md:block">
        <div className="bg-neutral-900/70 border border-neutral-800/60 rounded-2xl overflow-hidden">
          <div className="h-[3px] w-full bg-gradient-to-r from-indigo-600 via-violet-500 to-indigo-600" />
          <div className="overflow-x-auto">
            <table className="w-full" role="table">
              <thead>
                <tr className="border-b border-neutral-800/60">
                  <th
                    scope="col"
                    className="text-left px-5 py-3.5 text-[9px] font-semibold text-neutral-500 uppercase tracking-[0.2em]"
                  >
                    Student
                  </th>
                  <th
                    scope="col"
                    className="text-left px-5 py-3.5 text-[9px] font-semibold text-neutral-500 uppercase tracking-[0.2em]"
                  >
                    Roll Number
                  </th>
                  <th
                    scope="col"
                    className="text-center px-5 py-3.5 text-[9px] font-semibold text-neutral-500 uppercase tracking-[0.2em]"
                  >
                    Max Marks
                  </th>
                  <th
                    scope="col"
                    className="text-center px-5 py-3.5 text-[9px] font-semibold text-neutral-500 uppercase tracking-[0.2em]"
                  >
                    Marks Obtained
                  </th>
                  <th
                    scope="col"
                    className="text-center px-5 py-3.5 text-[9px] font-semibold text-neutral-500 uppercase tracking-[0.2em]"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => {
                  const sid = student.id;
                  const entry = marksMap[sid] || {};
                  
                  return (
                    <MarksTableRow
                      key={sid}
                      student={student}
                      marksEntry={entry}
                      maxMarks={maxMarks}
                      index={index}
                      onChange={(val) => onMarksChange(sid, val)}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* ── Mobile Cards ──────────────────────────────────────────────── */}
      <motion.div
        variants={stagger}
        className="md:hidden space-y-3"
      >
        {students.map((student) => {
          const sid = student.id;
          const entry = marksMap[sid] || {};
          
          return (
            <MarksMobileCard
              key={sid}
              student={student}
              marksEntry={entry}
              maxMarks={maxMarks}
              onChange={(val) => onMarksChange(sid, val)}
            />
          );
        })}
      </motion.div>
    </>
  );
}
