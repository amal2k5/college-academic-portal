import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MarksStatusBadge from "./MarksStatusBadge";

const ease = [0.22, 1, 0.36, 1];
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
};

// ── Inline marks input with validation ──────────────────────────────────────────
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
    if (isNaN(num)) {
      setError("Must be a number");
      return false;
    }
    if (num < 0) {
      setError("Cannot be negative");
      return false;
    }
    if (num > Number(maxMarks)) {
      setError(`Max ${maxMarks}`);
      return false;
    }
    setError("");
    return true;
  };

  const handleChange = (e) => {
    const v = e.target.value;
    setLocalValue(v);
    if (validate(v)) {
      onChange(v);
    }
  };

  const handleBlur = () => {
    validate(localValue);
  };

  return (
    <div className="relative">
      <input
        type="text"
        inputMode="decimal"
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        aria-label="Marks obtained"
        aria-invalid={!!error}
        className={`w-full max-w-[100px] px-3 py-2 rounded-lg text-sm font-medium text-center transition-all duration-150 outline-none
          ${
            error
              ? "bg-red-500/10 border-red-500/40 text-red-300 focus:border-red-400"
              : "bg-neutral-800/60 border-neutral-700/50 text-neutral-100 focus:border-indigo-500/60 focus:bg-neutral-800"
          }
          border disabled:opacity-50 disabled:cursor-not-allowed`}
      />
      {error && (
        <p
          className="absolute -bottom-5 left-0 text-[9px] font-medium text-red-400 whitespace-nowrap"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

// ── Desktop Table Row ───────────────────────────────────────────────────────────
export function MarksTableRow({
  student,
  marksEntry,
  maxMarks,
  index,
  onChange,
}) {
  const isPublished = marksEntry.status === "PUBLISHED";
  const studentName = student.name || `${student.first_name || ""} ${student.last_name || ""}`.trim() || "—";

  return (
    <motion.tr
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.02, ease }}
      className="border-b border-neutral-800/30 last:border-0 hover:bg-neutral-800/20 transition-colors duration-150"
    >
      <td className="px-5 py-3.5">
        <p className="text-[13px] font-medium text-neutral-100 truncate max-w-[200px]">
          {studentName}
        </p>
      </td>
      <td className="px-5 py-3.5">
        <p className="text-[12px] font-mono text-neutral-400 tracking-wide">
          {student.roll_number || "—"}
        </p>
      </td>
      <td className="px-5 py-3.5 text-center">
        <span className="text-[13px] font-medium text-neutral-300">
          {maxMarks}
        </span>
      </td>
      <td className="px-5 py-7 flex justify-center">
        <MarksInput
          value={marksEntry.marks ?? ""}
          maxMarks={maxMarks}
          onChange={onChange}
          disabled={isPublished}
        />
      </td>
      <td className="px-5 py-3.5 text-center">
        <MarksStatusBadge status={marksEntry.status || "DRAFT"} />
      </td>
    </motion.tr>
  );
}

// ── Mobile Card ─────────────────────────────────────────────────────────────────
export function MarksMobileCard({
  student,
  marksEntry,
  maxMarks,
  onChange,
}) {
  const isPublished = marksEntry.status === "PUBLISHED";
  const studentName = student.name || `${student.first_name || ""} ${student.last_name || ""}`.trim() || "—";

  return (
    <motion.div
      variants={fadeUp}
      className="bg-neutral-900/70 border border-neutral-800/60 rounded-xl p-4 space-y-3"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-neutral-100 truncate">
            {studentName}
          </p>
          <p className="text-[10px] text-neutral-500 font-mono tracking-wide mt-0.5">
            {student.roll_number || "—"}
          </p>
        </div>
        <MarksStatusBadge status={marksEntry.status || "DRAFT"} />
      </div>

      <div className="flex items-end gap-4 pt-2 border-t border-neutral-800/50">
        <div className="flex-1">
          <p className="text-[9px] font-semibold text-neutral-500 uppercase tracking-[0.2em] mb-1.5">
            Marks (Max: {maxMarks})
          </p>
          <MarksInput
            value={marksEntry.marks ?? ""}
            maxMarks={maxMarks}
            onChange={onChange}
            disabled={isPublished}
          />
        </div>
        {marksEntry.grade && (
          <div className="text-center pb-2">
            <p className="text-[9px] font-semibold text-neutral-500 uppercase tracking-[0.2em] mb-1">
              Grade
            </p>
            <span className="text-sm font-bold text-indigo-400">{marksEntry.grade}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
