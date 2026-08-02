import { useState } from "react";
import { Loader2 } from "lucide-react";
import { EXAM_TYPES } from "../../constants/examConstants";
import { LoadingSpinner } from "../common/loading";


export default function ExamForm({
  initialData,
  subjects = [],
  onSubmit,
  onCancel,
  loading = false,
  backendErrors = {},
}) {
  const [formData, setFormData] = useState({
    subject: initialData?.subject || "",
    exam_type: initialData?.exam_type || "",
    maximum_marks: initialData?.maximum_marks || 100,
    exam_date: initialData?.exam_date || "",
    start_time: initialData?.start_time ? initialData.start_time.substring(0, 5) : "",
    end_time: initialData?.end_time ? initialData.end_time.substring(0, 5) : "",
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

    if (!formData.exam_date) newErrors.exam_date = "Exam Date is required.";
    if (!formData.start_time) newErrors.start_time = "Start Time is required.";
    if (!formData.end_time) newErrors.end_time = "End Time is required.";

    if (formData.start_time && formData.end_time) {
      if (formData.start_time >= formData.end_time) {
        newErrors.end_time = "End time must be after start time.";
      }
    }

    if (!formData.venue.trim()) newErrors.venue = "Venue is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        subject: Number(formData.subject),
        maximum_marks: Number(formData.maximum_marks),
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const getFieldError = (name) => {
    if (errors[name]) return errors[name];
    if (backendErrors && backendErrors[name]) {
      return Array.isArray(backendErrors[name])
        ? backendErrors[name].join(" ")
        : backendErrors[name];
    }
    return null;
  };

  // Shared CSS styles matching the premium dashboard theme
  const inputBase =
    "w-full px-4 py-2.5 rounded-xl bg-neutral-900/50 border text-sm text-neutral-200 outline-none transition-all";
  const inputNormal =
    "border-neutral-800/60 focus:border-indigo-500/60 focus:bg-neutral-900/80 focus:ring-1 focus:ring-indigo-500/30";
  const inputError =
    "border-red-500/40 bg-red-500/5 focus:border-red-500/60 focus:ring-1 focus:ring-red-500/30";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full space-y-5">
      {/* Subject & Exam Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="subject-select" className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
            Subject
          </label>
          <div className="relative">
            <select
              id="subject-select"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              disabled={loading}
              className={`${inputBase} ${getFieldError("subject") ? inputError : inputNormal} cursor-pointer appearance-none`}
            >
              <option value="">Select Subject</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.subject_code} — {sub.name} (Sem {sub.semester})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-neutral-500">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          {getFieldError("subject") && (
            <p className="text-[10px] text-red-400 font-medium">{getFieldError("subject")}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="exam-type-select" className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
            Exam Type
          </label>
          <div className="relative">
            <select
              id="exam-type-select"
              name="exam_type"
              value={formData.exam_type}
              onChange={handleChange}
              disabled={loading}
              className={`${inputBase} ${getFieldError("exam_type") ? inputError : inputNormal} cursor-pointer appearance-none`}
            >
              <option value="">Select Type</option>
              {EXAM_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-neutral-500">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          {getFieldError("exam_type") && (
            <p className="text-[10px] text-red-400 font-medium">{getFieldError("exam_type")}</p>
          )}
        </div>
      </div>

      {/* Date & Max Marks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="exam-date-input" className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
            Exam Date
          </label>
          <input
            id="exam-date-input"
            type="date"
            name="exam_date"
            value={formData.exam_date}
            onChange={handleChange}
            disabled={loading}
            className={`${inputBase} ${getFieldError("exam_date") ? inputError : inputNormal} [color-scheme:dark]`}
          />
          {getFieldError("exam_date") && (
            <p className="text-[10px] text-red-400 font-medium">{getFieldError("exam_date")}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="maximum-marks-input" className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
            Maximum Marks
          </label>
          <input
            id="maximum-marks-input"
            type="number"
            name="maximum_marks"
            min="1"
            value={formData.maximum_marks}
            onChange={handleChange}
            disabled={loading}
            placeholder="e.g. 100"
            className={`${inputBase} ${getFieldError("maximum_marks") ? inputError : inputNormal}`}
          />
          {getFieldError("maximum_marks") && (
            <p className="text-[10px] text-red-400 font-medium">{getFieldError("maximum_marks")}</p>
          )}
        </div>
      </div>

      {/* Start Time & End Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="start-time-input" className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
            Start Time
          </label>
          <input
            id="start-time-input"
            type="time"
            name="start_time"
            value={formData.start_time}
            onChange={handleChange}
            disabled={loading}
            className={`${inputBase} ${getFieldError("start_time") ? inputError : inputNormal} [color-scheme:dark]`}
          />
          {getFieldError("start_time") && (
            <p className="text-[10px] text-red-400 font-medium">{getFieldError("start_time")}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="end-time-input" className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
            End Time
          </label>
          <input
            id="end-time-input"
            type="time"
            name="end_time"
            value={formData.end_time}
            onChange={handleChange}
            disabled={loading}
            className={`${inputBase} ${getFieldError("end_time") ? inputError : inputNormal} [color-scheme:dark]`}
          />
          {getFieldError("end_time") && (
            <p className="text-[10px] text-red-400 font-medium">{getFieldError("end_time")}</p>
          )}
        </div>
      </div>

      {/* Venue */}
      <div className="space-y-1.5">
        <label htmlFor="venue-input" className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
          Venue
        </label>
        <input
          id="venue-input"
          type="text"
          name="venue"
          value={formData.venue}
          onChange={handleChange}
          disabled={loading}
          placeholder="e.g. Seminar Hall A, block II"
          className={`${inputBase} ${getFieldError("venue") ? inputError : inputNormal}`}
        />
        {getFieldError("venue") && (
          <p className="text-[10px] text-red-400 font-medium">{getFieldError("venue")}</p>
        )}
      </div>

      {/* Form Submission Buttons */}
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
          {loading && <LoadingSpinner size={14} color="border-t-white border-white/30" />}
          {initialData ? "Update Exam" : "Create Exam"}
        </button>
      </div>
    </form>
  );
}
