import { useState } from "react";
import { Loader2 } from "lucide-react";

export const EXAM_TYPES = [
  { value: "INTERNAL1", label: "Internal 1" },
  { value: "INTERNAL2", label: "Internal 2" },
  { value: "MODEL", label: "Model Exam" },
  { value: "SEMESTER", label: "Semester Exam" },
];

export default function ExamForm({ initialData, subjects, onSubmit, onCancel, loading }) {
  const [formData, setFormData] = useState({
    subject: initialData?.subject || "",
    exam_type: initialData?.exam_type || "",
    maximum_marks: initialData?.maximum_marks || 100,
    date: initialData?.date || "",
    time: initialData?.time || "",
    duration: initialData?.duration || 180,
    venue: initialData?.venue || "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.subject) newErrors.subject = "Subject is required.";
    if (!formData.exam_type) newErrors.exam_type = "Exam Type is required.";
    
    if (!formData.maximum_marks) {
      newErrors.maximum_marks = "Maximum marks is required.";
    } else if (Number(formData.maximum_marks) <= 0) {
      newErrors.maximum_marks = "Maximum marks must be positive.";
    }

    if (!formData.date) newErrors.date = "Date is required.";
    if (!formData.time) newErrors.time = "Time is required.";
    
    if (!formData.duration) {
      newErrors.duration = "Duration is required.";
    } else if (Number(formData.duration) <= 0) {
      newErrors.duration = "Duration must be a positive number.";
    }

    if (!formData.venue.trim()) newErrors.venue = "Venue is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Shared classes
  const inputBase =
    "w-full px-4 py-2.5 rounded-xl bg-neutral-900/50 border text-sm text-neutral-200 outline-none transition-colors";
  const inputNormal =
    "border-neutral-800/60 focus:border-indigo-500/60 focus:bg-neutral-900/80";
  const inputError =
    "border-red-500/40 bg-red-500/5 focus:border-red-500/60";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="space-y-5">
        {/* Subject & Exam Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
              Subject
            </label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              disabled={loading}
              className={`${inputBase} ${errors.subject ? inputError : inputNormal} cursor-pointer appearance-none`}
            >
              <option value="">Select Subject</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.subject_code} — {sub.name}
                </option>
              ))}
            </select>
            {errors.subject && (
              <p className="text-[10px] text-red-400 font-medium">{errors.subject}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
              Exam Type
            </label>
            <select
              name="exam_type"
              value={formData.exam_type}
              onChange={handleChange}
              disabled={loading}
              className={`${inputBase} ${errors.exam_type ? inputError : inputNormal} cursor-pointer appearance-none`}
            >
              <option value="">Select Type</option>
              {EXAM_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.exam_type && (
              <p className="text-[10px] text-red-400 font-medium">{errors.exam_type}</p>
            )}
          </div>
        </div>

        {/* Date, Time, Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              disabled={loading}
              className={`${inputBase} ${errors.date ? inputError : inputNormal} [color-scheme:dark]`}
            />
            {errors.date && (
              <p className="text-[10px] text-red-400 font-medium">{errors.date}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
              Start Time
            </label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              disabled={loading}
              className={`${inputBase} ${errors.time ? inputError : inputNormal} [color-scheme:dark]`}
            />
            {errors.time && (
              <p className="text-[10px] text-red-400 font-medium">{errors.time}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
              Duration (mins)
            </label>
            <input
              type="number"
              name="duration"
              min="1"
              value={formData.duration}
              onChange={handleChange}
              disabled={loading}
              placeholder="e.g. 180"
              className={`${inputBase} ${errors.duration ? inputError : inputNormal}`}
            />
            {errors.duration && (
              <p className="text-[10px] text-red-400 font-medium">{errors.duration}</p>
            )}
          </div>
        </div>

        {/* Venue & Max Marks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
              Venue
            </label>
            <input
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              disabled={loading}
              placeholder="e.g. Main Hall A"
              className={`${inputBase} ${errors.venue ? inputError : inputNormal}`}
            />
            {errors.venue && (
              <p className="text-[10px] text-red-400 font-medium">{errors.venue}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
              Max Marks
            </label>
            <input
              type="number"
              name="maximum_marks"
              min="1"
              value={formData.maximum_marks}
              onChange={handleChange}
              disabled={loading}
              placeholder="e.g. 100"
              className={`${inputBase} ${errors.maximum_marks ? inputError : inputNormal}`}
            />
            {errors.maximum_marks && (
              <p className="text-[10px] text-red-400 font-medium">{errors.maximum_marks}</p>
            )}
          </div>
        </div>
      </div>

      {/* Footer / Buttons */}
      <div className="mt-8 pt-5 border-t border-neutral-800/50 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 rounded-lg text-sm font-medium text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-[0_4px_12px_rgba(99,102,241,0.25)] hover:shadow-[0_4px_16px_rgba(99,102,241,0.35)] disabled:opacity-50 flex items-center gap-2"
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          {initialData ? "Update Exam" : "Create Exam"}
        </button>
      </div>
    </form>
  );
}
