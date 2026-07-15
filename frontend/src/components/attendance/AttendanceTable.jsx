import { motion } from "framer-motion";
import { User, Check, X, Clock } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export default function AttendanceTable({
  students,
  attendanceMap,
  onAttendanceChange,
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="bg-neutral-900/70 border border-neutral-800/60 rounded-2xl overflow-hidden shadow-2xl"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-900/80 border-b border-neutral-800 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.15em]">
              <th className="py-4 px-6 w-16 text-center">#</th>
              <th className="py-4 px-6 min-w-[200px]">Student Details</th>
              <th className="py-4 px-6 text-center min-w-[280px]">Attendance Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/50">
            {students.map((student, idx) => {
              if (!student) return null;

              const currentStatus = attendanceMap[student.id]?.status || "PRESENT";

              const studentName =
                student.name ||
                student.full_name ||
                `${student.first_name || ""} ${student.last_name || ""}`.trim() ||
                "Unknown";

              return (
                <tr
                  key={student.id}
                  className="group hover:bg-neutral-800/40 transition-colors duration-200"
                >
                  <td className="py-4 px-6">
                    <span className="text-xs font-semibold text-neutral-500 tabular-nums flex justify-center">
                      {(idx + 1).toString().padStart(2, "0")}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700/50 flex items-center justify-center text-neutral-400 shrink-0">
                        <User size={14} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-neutral-100 group-hover:text-white transition-colors">
                          {studentName}
                        </div>
                        <div className="text-xs text-neutral-500 flex items-center gap-2 mt-0.5">
                          <span className="font-mono">{student.roll_number || "N/A"}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center">
                      <div className="inline-flex items-center p-1 bg-neutral-950/50 rounded-xl border border-neutral-800/50">
                        <button
                          onClick={() => onAttendanceChange(student.id, "PRESENT")}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${currentStatus === "PRESENT"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 border border-transparent"
                            }`}
                        >
                          <Check size={14} />
                          Present
                        </button>
                        <button
                          onClick={() => onAttendanceChange(student.id, "ABSENT")}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${currentStatus === "ABSENT"
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 border border-transparent"
                            }`}
                        >
                          <X size={14} />
                          Absent
                        </button>
                        <button
                          onClick={() => onAttendanceChange(student.id, "LEAVE")}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${currentStatus === "LEAVE"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 border border-transparent"
                            }`}
                        >
                          <Clock size={14} />
                          Leave
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}