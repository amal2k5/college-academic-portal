import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Loader2, UploadCloud, FileText, X } from "lucide-react";
import { LoadingButton } from "../common/loading";

function AssignmentForm({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
}) {
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    description: "",
    target_year: "1",
    deadline: "",
    max_marks: "",
    attachment: null,
  });
  const [fileName, setFileName] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        deadline: initialData.deadline ? initialData.deadline.slice(0, 16) : "",
      });
      if (initialData.attachment_original_name) {
        setFileName(initialData.attachment_original_name);
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "attachment" && files[0]) {
      setFormData((prev) => ({ ...prev, attachment: files[0] }));
      setFileName(files[0].name);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRemoveFile = () => {
    setFormData((prev) => ({ ...prev, attachment: null }));
    setFileName(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClass = 
    "w-full rounded-lg border border-neutral-700 bg-neutral-900/50 px-4 py-2.5 text-white placeholder-neutral-500 outline-none focus:border-neutral-500 focus:bg-neutral-900 transition text-sm";
  const labelClass = 
    "block text-xs font-medium text-neutral-400 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title & Subject */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Title</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="Assignment title"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Subject</label>
          <input
            type="text"
            name="subject"
            required
            value={formData.subject}
            onChange={handleChange}
            placeholder="e.g. Mathematics"
            className={inputClass}
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Description</label>
        <textarea
          rows={3}
          name="description"
          required
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the assignment..."
          className={`${inputClass} resize-none min-h-[80px]`}
        />
      </div>

      {/* Meta Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Year</label>
          <select
            name="target_year"
            value={formData.target_year}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="1">Year 1</option>
            <option value="2">Year 2</option>
            <option value="3">Year 3</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Max Marks</label>
          <input
            type="number"
            name="max_marks"
            required
            min="1"
            max="100"
            value={formData.max_marks}
            onChange={handleChange}
            placeholder="100"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Deadline</label>
          <input
            type="datetime-local"
            name="deadline"
            required
            value={formData.deadline}
            onChange={handleChange}
            className={`${inputClass} [color-scheme:dark]`}
          />
        </div>
      </div>

      {/* File Upload */}
      <div>
        <label className={labelClass}>Attachment</label>
        <div className="relative">
          <input
            type="file"
            name="attachment"
            id="file-upload"
            accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip"
            onChange={handleChange}
            className="hidden"
          />
          <label
            htmlFor="file-upload"
            className="flex items-center justify-between rounded-lg border border-neutral-700 bg-neutral-900/50 px-4 py-3 cursor-pointer hover:border-neutral-500 transition"
          >
            <div className="flex items-center gap-3">
              <UploadCloud size={18} className="text-neutral-400" />
              <span className="text-sm text-neutral-400">
                {fileName || "Upload file"}
              </span>
            </div>
            {fileName && (
              <button
                type="button"
                onClick={handleRemoveFile}
                className="p-1 rounded hover:bg-neutral-800 text-neutral-500 hover:text-neutral-300 transition"
              >
                <X size={16} />
              </button>
            )}
          </label>
          {fileName && (
            <div className="mt-2 flex items-center gap-2 text-xs text-neutral-400">
              <FileText size={14} />
              <span>{fileName}</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg text-sm text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50 transition"
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
          {initialData ? "Update" : "Create"}
        </LoadingButton>
      </div>
    </form>
  );
}

export default AssignmentForm;