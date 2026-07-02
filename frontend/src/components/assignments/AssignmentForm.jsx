import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, X, UploadCloud, FileText } from "lucide-react";

function AssignmentForm({ initialData = null, onSubmit, onCancel, loading = false }) {
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
      setFormData(initialData);
      if (initialData.attachment) setFileName("question_paper.pdf");
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "attachment" && files[0]) {
      setFormData(prev => ({ ...prev, attachment: files[0] }));
      setFileName(files[0].name);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClass = "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-neutral-500 outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all";
  const labelClass = "block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2 ml-1";

  return (
    <motion.form 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      onSubmit={handleSubmit} 
      className="space-y-6"
    >
      {/* Title & Subject Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Assignment Title</label>
          <input type="text" name="title" required value={formData.title} onChange={handleChange} placeholder="e.g. Data Structures Lab 4" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Subject</label>
          <input type="text" name="subject" required value={formData.subject} onChange={handleChange} placeholder="e.g. Computer Science" className={inputClass} />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Instructions</label>
        <textarea rows={4} name="description" required value={formData.description} onChange={handleChange} placeholder="Detailed instructions for students..." className={`${inputClass} resize-none`} />
      </div>

      {/* Meta Data Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className={labelClass}>Target Year</label>
          <select name="target_year" value={formData.target_year} onChange={handleChange} className={inputClass}>
            <option value="1" className="bg-neutral-900">Year 1</option>
            <option value="2" className="bg-neutral-900">Year 2</option>
            <option value="3" className="bg-neutral-900">Year 3</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Max Marks</label>
          <input type="number" name="max_marks" required min="1" max="100" value={formData.max_marks} onChange={handleChange} placeholder="100" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Deadline</label>
          <input type="datetime-local" name="deadline" required value={formData.deadline} onChange={handleChange} className={`${inputClass} [color-scheme:dark]`} />
        </div>
      </div>

      {/* File Upload */}
      <div>
        <label className={labelClass}>Question Paper / Attachment</label>
        <label className="group relative flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/10 bg-white/5 px-4 py-8 cursor-pointer hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all">
          <AnimatePresence mode="wait">
            {fileName ? (
              <motion.div key="file" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center text-indigo-400">
                <FileText size={24} className="mb-2" />
                <span className="text-sm font-medium">{fileName}</span>
                <span className="text-xs text-neutral-500 mt-1">Click to change file</span>
              </motion.div>
            ) : (
              <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center text-neutral-400">
                <UploadCloud size={24} className="mb-2 group-hover:text-indigo-400 transition-colors" />
                <span className="text-sm font-medium group-hover:text-white transition-colors">Click to upload PDF</span>
                <span className="text-xs text-neutral-600 mt-1">PDF up to 10MB</span>
              </motion.div>
            )}
          </AnimatePresence>
          <input type="file" name="attachment" accept=".pdf,.doc,.docx" onChange={handleChange} className="hidden" />
        </label>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
        <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl border border-white/10 text-neutral-400 hover:text-white hover:bg-white/5 transition-all text-sm font-medium">Cancel</button>
        <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 text-sm font-medium flex items-center gap-2">
          <Save size={16} /> {initialData ? "Update Assignment" : "Publish Assignment"}
        </button>
      </div>
    </motion.form>
  );
}

export default AssignmentForm;