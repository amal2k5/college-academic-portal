import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import { LoadingButton } from "../common/loading";

const SEMESTERS = Array.from({ length: 8 }, (_, i) => ({
  value: String(i + 1),
  label: `Semester ${i + 1}`,
}));

const SUBJECT_TYPES = [
  { value: "THEORY", label: "Theory" },
  { value: "PRACTICAL", label: "Practical" },
  { value: "LAB", label: "Lab" },
];

function SubjectForm({ initialData = null, onSubmit, onCancel, loading = false }) {
  const [formData, setFormData] = useState({
    name: "",
    subject_code: "",
    semester: "1",
    subject_type: "THEORY",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        subject_code: initialData.subject_code || "",
        semester: String(initialData.semester || "1"),
        subject_type: initialData.subject_type || "THEORY",
      });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Subject name is required.";
    if (!formData.subject_code.trim()) newErrors.subject_code = "Subject code is required.";
    if (!formData.semester) newErrors.semester = "Semester is required.";
    if (!formData.subject_type) newErrors.subject_type = "Subject type is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear inline error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: formData.name.trim(),
      subject_code: formData.subject_code.trim(),
      semester: Number(formData.semester),
      subject_type: formData.subject_type,
    };

    onSubmit(payload);
  };

  const inputClass =
    "w-full rounded-lg border bg-neutral-900/50 px-4 py-2.5 text-white placeholder-neutral-500 outline-none focus:bg-neutral-900 transition text-sm";
  const labelClass = "block text-xs font-medium text-neutral-400 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Subject Name */}
      <div>
        <label htmlFor="subject-name" className={labelClass}>
          Subject Name <span className="text-red-400">*</span>
        </label>
        <input
          id="subject-name"
          type="text"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Data Structures"
          className={`${inputClass} ${
            errors.name
              ? "border-red-500/50 focus:border-red-400"
              : "border-neutral-700 focus:border-neutral-500"
          }`}
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-400" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      {/* Subject Code + Semester */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="subject-code" className={labelClass}>
            Subject Code <span className="text-red-400">*</span>
          </label>
          <input
            id="subject-code"
            type="text"
            name="subject_code"
            required
            value={formData.subject_code}
            onChange={handleChange}
            placeholder="e.g. CS201"
            className={`${inputClass} ${
              errors.subject_code
                ? "border-red-500/50 focus:border-red-400"
                : "border-neutral-700 focus:border-neutral-500"
            }`}
          />
          {errors.subject_code && (
            <p className="mt-1 text-xs text-red-400" role="alert">
              {errors.subject_code}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="subject-semester" className={labelClass}>
            Semester <span className="text-red-400">*</span>
          </label>
          <select
            id="subject-semester"
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            className={`${inputClass} ${
              errors.semester
                ? "border-red-500/50 focus:border-red-400"
                : "border-neutral-700 focus:border-neutral-500"
            }`}
          >
            {SEMESTERS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          {errors.semester && (
            <p className="mt-1 text-xs text-red-400" role="alert">
              {errors.semester}
            </p>
          )}
        </div>
      </div>

      {/* Subject Type */}
      <div>
        <label htmlFor="subject-type" className={labelClass}>
          Subject Type <span className="text-red-400">*</span>
        </label>
        <select
          id="subject-type"
          name="subject_type"
          value={formData.subject_type}
          onChange={handleChange}
          className={`${inputClass} ${
            errors.subject_type
              ? "border-red-500/50 focus:border-red-400"
              : "border-neutral-700 focus:border-neutral-500"
          }`}
        >
          {SUBJECT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        {errors.subject_type && (
          <p className="mt-1 text-xs text-red-400" role="alert">
            {errors.subject_type}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 rounded-lg text-sm text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50 transition disabled:opacity-50"
        >
          Cancel
        </button>
        <LoadingButton
          type="submit"
          loading={loading}
          spinnerSize={16}
          icon={<Save size={16} />}
          className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {initialData ? "Update Subject" : "Create Subject"}
        </LoadingButton>
      </div>
    </form>
  );
}

export default SubjectForm;
