import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MarksStatusBadge from "./MarksStatusBadge";

const ease = [0.22, 1, 0.36, 1];
const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease } },
};

// ── Marks Input ──────────────────────────────────────────────────────────────
function MarksInput({ value, maxMarks, onChange, disabled }) {
  const [localValue, setLocalValue] = useState(value ?? "");
  const [error, setError] = useState("");

  useEffect(() => {
    setLocalValue(value ?? "");
  }, [value]);

  const validate = (v) => {
    if (v === "" || v === null || v === undefined) {
      setError("Required");
      return false;
    }
    const num = Number(v);
    if (isNaN(num)) { setError("Invalid"); return false; }
    if (num < 0) { setError("Min 0"); return false; }
    if (num > Number(maxMarks)) { setError(`Max ${maxMarks}`); return false; }
    setError("");
    return true;
  };

  const handleChange = (e) => {
    const v = e.target.value;
    setLocalValue(v);
    if (validate(v)) onChange(v);
  };

  return (
    <div className="relative">
      <input
        type="text"
        inputMode="decimal"
        value={localValue}
        onChange={handleChange}
        onBlur={() => validate(localValue)}
        disabled={disabled}
        className={`w-full max-w-[90px] px-3 py-1.5 rounded-lg text-sm font-medium text-center transition-all outline-none
          ${error
            ? "bg-red-500/10 border-red-500/40 text-red-300"
            : "bg-neutral-800/60 border-neutral-700/50 text-neutral-100 focus:border-indigo-500/60 focus:bg-neutral-800"
          } border disabled:opacity-50 disabled:cursor-not-allowed`}
      />
      {error && <p className="absolute -bottom-4 left-0 text-[8px] text-red-400">{error}</p>}
    </div>
  );
}

// ── Desktop Row ──────────────────────────────────────────────────────────────
export function MarksTableRow({ student, marksEntry, maxMarks, index, onChange }) {
  const isPublished = marksEntry.status === "PUBLISHED";
  const name = student.name || `${student.first_name || ""} ${student.last_name || ""}`.trim() || "—";

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.02 }}
      className="border-b border-neutral-800/30 last:border-0 hover:bg-neutral-800/20 transition-colors"
    >
      <td className="px-4 py-3.5">
        <p className="text-sm font-medium text-white truncate max-w-[180px]">{name}</p>
      </td>
      <td className="px-4 py-3.5">
        <p className="text-xs font-mono text-neutral-400">{student.roll_number || "—"}</p>
      </td>
      <td className="px-4 py-3.5 text-center text-sm font-medium text-neutral-300">{maxMarks}</td>
      <td className="px-4 py-3.5">
        <div className="flex justify-center">
          <MarksInput value={marksEntry.marks ?? ""} maxMarks={maxMarks} onChange={onChange} disabled={isPublished} />
        </div>
      </td>
      <td className="px-4 py-3.5 text-center">
        <MarksStatusBadge status={marksEntry.status || "DRAFT"} />
      </td>
    </motion.tr>
  );
}

// ── Mobile Card ──────────────────────────────────────────────────────────────
export function MarksMobileCard({ student, marksEntry, maxMarks, onChange }) {
  const isPublished = marksEntry.status === "PUBLISHED";
  const name = student.name || `${student.first_name || ""} ${student.last_name || ""}`.trim() || "—";

  return (
    <motion.div
      variants={fadeUp}
      className="bg-neutral-900/60 border border-neutral-800/60 rounded-xl p-4 space-y-3 hover:border-neutral-700/60 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-white truncate">{name}</p>
          <p className="text-[10px] text-neutral-500 font-mono mt-0.5">{student.roll_number || "—"}</p>
        </div>
        <MarksStatusBadge status={marksEntry.status || "DRAFT"} />
      </div>

      <div className="flex items-center gap-4 pt-3 border-t border-neutral-800/40">
        <div className="flex-1">
          <p className="text-[9px] text-neutral-500 font-medium uppercase tracking-wider mb-1.5">Marks / {maxMarks}</p>
          <MarksInput value={marksEntry.marks ?? ""} maxMarks={maxMarks} onChange={onChange} disabled={isPublished} />
        </div>
        {marksEntry.grade && (
          <div className="text-center">
            <p className="text-[9px] text-neutral-500 font-medium uppercase tracking-wider mb-1">Grade</p>
            <span className="text-sm font-bold text-indigo-400">{marksEntry.grade}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}