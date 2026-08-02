import { useEffect, useState } from "react";
import { Save, X, UploadCloud, Image as ImageIcon, Pin, Building2, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingSpinner } from "../common/loading";

function NoticeForm({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
  role = null,
  departmentName = null,
}) {
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    category: "",
    image: null,
    is_pinned: false,
  });

  const [previewUrl, setPreviewUrl] = useState(null);


  useEffect(() => {
    if (initialData) {
      const { scope, department, ...rest } = initialData;
      setFormData(rest);

      if (initialData.image && typeof initialData.image === "string") {
        setPreviewUrl(initialData.image);
      } else {
        setPreviewUrl(null);
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file" && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      setPreviewUrl(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          type === "checkbox"
            ? checked
            : type === "file"
              ? {
                file: files[0],
                preview: URL.createObjectURL(files[0]),
              }
              : value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };


  const inputBase =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-neutral-500 outline-none transition-all duration-200 focus:border-indigo-500/50 focus:bg-white/10 focus:ring-1 focus:ring-indigo-500/50";
  const labelStyle =
    "block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2 ml-1";


  const isHOD = role === "hod";
  const isCollegeAdmin = role === "college_admin";
  const showAudienceBadge = isHOD || isCollegeAdmin;

  return (
    <>
      {/* Custom Scrollbar Styles (plain CSS, no styled-jsx needed) */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
        /* Firefox Support */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
        }
      `}</style>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        onSubmit={handleSubmit}
        className="flex flex-col h-full min-h-0"
      >
        {/* Scrollable Content Area */}
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2 space-y-6 pb-6">
          {/* Title */}
          <div>
            <label className={labelStyle}>Notice Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Mid-Semester Exam Schedule"
              className={inputBase}
            />
          </div>

          {/* Body */}
          <div>
            <label className={labelStyle}>Description</label>
            <textarea
              rows={4}
              name="body"
              value={formData.body}
              onChange={handleChange}
              placeholder="Write the notice details..."
              className={`${inputBase} resize-none`}
            />
          </div>

          {/* Category — full width when scope is hidden */}
          <div>
            <label className={labelStyle}>Category</label>
            <div className="relative">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`${inputBase} appearance-none cursor-pointer`}
              >
                <option value="" className="bg-neutral-900">Select Category</option>
                <option value="General" className="bg-neutral-900">General</option>
                <option value="Exam" className="bg-neutral-900">Exam</option>
                <option value="Event" className="bg-neutral-900">Event</option>
                <option value="Holiday" className="bg-neutral-900">Holiday</option>
                <option value="Fee" className="bg-neutral-900">Fee</option>
              </select>
              {/* Custom Arrow for Select */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-neutral-400">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Target Audience — read-only for HOD and College Admin */}
          {showAudienceBadge && (
            <div>
              <label className={labelStyle}>Target Audience</label>
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                {isHOD ? (
                  <>
                    <Building2 size={16} className="text-violet-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {departmentName || "Your Department"}
                      </p>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        This notice will be published to your department.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <Globe size={16} className="text-indigo-400 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-white">
                        Entire College
                      </p>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        This notice will be published to all departments.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Attachment Upload */}
          <div>
            <label className={labelStyle}>Attachment</label>
            <motion.label
              whileHover={{ scale: 1.005 }}
              whileTap={{ scale: 0.995 }}
              className="group relative flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/10 bg-white/5 px-4 py-8 cursor-pointer hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all duration-300 overflow-hidden min-h-[160px]"
            >
              <AnimatePresence mode="wait">
                {previewUrl ? (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative w-full h-48"
                  >
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg shadow-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg backdrop-blur-sm">
                      <div className="flex flex-col items-center text-white">
                        <UploadCloud size={24} className="mb-1" />
                        <span className="text-sm font-medium">Change Image</span>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center text-center p-4"
                  >
                    <div className="p-3 rounded-full bg-indigo-500/10 text-indigo-400 mb-3 group-hover:scale-110 transition-transform">
                      <ImageIcon size={24} />
                    </div>
                    <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">
                      Click to upload or drag and drop
                    </span>
                    <span className="text-xs text-neutral-500 mt-1">
                      PNG, JPG up to 5MB
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </motion.label>
          </div>

          {/* Pin Toggle */}
          <motion.div
            whileHover={{ backgroundColor: "rgba(255,255,255,0.08)" }}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-neutral-800 text-neutral-400">
                <Pin size={18} />
              </div>
              <div>
                <p className="text-white font-medium text-sm">Pin Notice</p>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Pinned notices will appear at the top of the feed.
                </p>
              </div>
            </div>

            {/* Custom Toggle Switch */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="is_pinned"
                checked={formData.is_pinned}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </motion.div>
        </div>

        {/* Sticky Footer Actions */}
        <div className="pt-6 mt-2 border-t border-white/5 flex justify-end gap-3 bg-[#0a0a0a] shrink-0">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onCancel}
            className="flex items-center gap-2 rounded-xl border border-white/10 px-5 py-2.5 text-neutral-400 hover:text-white hover:bg-white/5 transition-all font-medium"
          >
            <X size={16} />
            Cancel
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 text-white shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? (
              <LoadingSpinner size={16} color="border-t-white border-white/30" />
            ) : (
              <Save size={16} />
            )}
            Publish Notice
          </motion.button>
        </div>
      </motion.form>
    </>
  );
}

export default NoticeForm;