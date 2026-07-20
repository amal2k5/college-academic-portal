import { useMemo } from "react";
import { motion } from "framer-motion";
import { GraduationCap, ChevronDown } from "lucide-react";
import { getExamTypeLabel } from "../../constants/examConstants";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

function SelectField({ label, value, onChange, options, placeholder, disabled }) {
  const selectId = useMemo(() => `select-${label.toLowerCase().replace(/\s+/g, "-")}`, [label]);
  return (
    <div className="relative flex-1 min-w-[160px]">
      <label htmlFor={selectId} className="block text-[9px] font-semibold text-neutral-500 uppercase tracking-[0.2em] mb-2">
        {label}
      </label>
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          aria-label={label}
          className="w-full appearance-none px-4 py-2.5 pr-10 rounded-xl bg-neutral-800/60 border border-neutral-700/50 text-sm text-neutral-200 outline-none transition-all duration-150 focus:border-indigo-500/60 focus:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none"
        />
      </div>
    </div>
  );
}

export default function MarksToolbar({
  subjects,
  exams,
  selectedSemester,
  setSelectedSemester,
  selectedSubject,
  setSelectedSubject,
  selectedExam,
  setSelectedExam,
  loadingSubjects,
}) {
  // Semester Options
  const semesterOptions = Array.from({ length: 8 }, (_, i) => ({
    value: String(i + 1),
    label: `Semester ${i + 1}`,
  }));

  // Subject Options (filtered by semester)
  const subjectOptions = useMemo(() => {
    let filtered = subjects;
    if (selectedSemester) {
      filtered = subjects.filter((s) => String(s.semester) === String(selectedSemester));
    }
    return filtered.map((s) => ({
      value: String(s.id),
      label: `${s.subject_code} — ${s.name}`,
    }));
  }, [subjects, selectedSemester]);

  // Exam Options (filtered by subject)
  const examOptions = useMemo(() => {
    if (!selectedSubject) return [];
    return exams
      .filter((e) => String(e.subject) === String(selectedSubject))
      .map((e) => ({
        value: String(e.id),
        label: `${getExamTypeLabel(e.exam_type)}${
          e.date ? ` · ${e.date}` : ""
        }`,
      }));
  }, [exams, selectedSubject]);

  return (
    <motion.div
      variants={fadeUp}
      className="bg-neutral-900/70 border border-neutral-800/60 rounded-2xl p-5"
    >
      <div className="flex items-center gap-2.5 mb-4">
        <div className="text-indigo-400">
          <GraduationCap size={14} strokeWidth={1.6} />
        </div>
        <h2 className="text-[10px] font-bold text-neutral-300 uppercase tracking-[0.22em]">
          Exam Selection
        </h2>
        <div className="flex-1 h-px bg-neutral-800/60" />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <SelectField
          label="Semester"
          value={selectedSemester}
          onChange={(val) => {
            setSelectedSemester(val);
            setSelectedSubject("");
            setSelectedExam("");
          }}
          options={semesterOptions}
          placeholder="Select Semester"
          disabled={false}
        />
        
        <SelectField
          label="Subject"
          value={selectedSubject}
          onChange={(val) => {
            setSelectedSubject(val);
            setSelectedExam("");
          }}
          options={subjectOptions}
          placeholder={
            loadingSubjects
              ? "Loading..."
              : !selectedSemester
              ? "Select semester first"
              : subjectOptions.length === 0
              ? "No subjects found"
              : "Select Subject"
          }
          disabled={loadingSubjects || !selectedSemester || subjectOptions.length === 0}
        />
        
        <SelectField
          label="Exam Type"
          value={selectedExam}
          onChange={setSelectedExam}
          options={examOptions}
          placeholder={
            !selectedSubject
              ? "Select subject first"
              : examOptions.length === 0
              ? "No exams found"
              : "Select Exam"
          }
          disabled={!selectedSubject || examOptions.length === 0}
        />
      </div>
    </motion.div>
  );
}
