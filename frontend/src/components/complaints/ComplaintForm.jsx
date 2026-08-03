import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, CheckCircle2, AlertCircle, Loader2, UploadCloud, X, Send, FileText, Tag, Globe } from "lucide-react";
import { createComplaint } from "../../services/complaintService";
import { AuthContext } from "../../context/AuthContext";
import { LoadingButton } from "../common/loading";

const COMPLAINT_CATEGORIES = [
  { label: "Academic", value: "ACADEMIC" },
  { label: "Faculty", value: "FACULTY" },
  { label: "Facilities", value: "FACILITIES" },
  { label: "Discipline", value: "DISCIPLINE" },
  { label: "Examination", value: "EXAMINATION" },
  { label: "Other", value: "OTHER" },
];

const ComplaintForm = ({ onSuccess }) => {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    text: "",
    category: "",
    scope: "Department",
  });
  const [attachment, setAttachment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successData, setSuccessData] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.text || !formData.category || !formData.scope) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const payload = new FormData();
      payload.append("text", formData.text);
      payload.append("category", formData.category);
      payload.append("scope", formData.scope.toUpperCase());

      if (formData.scope === "Department") {
        const deptId = user?.department || user?.department_id;

        if (!deptId) {
          setError("Your account is not assigned to a department. Please contact admin.");
          setLoading(false);
          return;
        }

        payload.append("department", deptId);
      }

      if (attachment) {
        payload.append("attachment", attachment);
      }

      const response = await createComplaint(payload);

      const trackingCode = response?.tracking_code || response?.data?.tracking_code;
      setSuccessData({ trackingCode });
      if (onSuccess) onSuccess({ trackingCode });
    } catch (err) {
      console.error("Submit complaint error:", err);

      const data = err.response?.data;
      let errorMsg = "Failed to submit complaint. Please try again.";

      if (data) {
        if (data.detail) {
          errorMsg = data.detail;
        } else if (data.non_field_errors && data.non_field_errors.length > 0) {
          errorMsg = data.non_field_errors[0];
        } else if (typeof data === 'object') {
          const firstKey = Object.keys(data)[0];
          if (firstKey && Array.isArray(data[firstKey])) {
            errorMsg = data[firstKey][0];
          } else if (firstKey && typeof data[firstKey] === 'string') {
            errorMsg = data[firstKey];
          }
        }
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (successData?.trackingCode) {
      navigator.clipboard.writeText(successData.trackingCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (successData) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto shadow-2xl"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 size={32} />
          </div>

          <h2 className="text-2xl font-semibold text-white mb-2">Complaint Submitted Successfully</h2>
          <p className="text-neutral-400 text-sm mb-8 max-w-md">
            Your complaint has been registered. Our team will review it shortly.
          </p>

          <div className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-6 mb-6">
            <p className="text-xs text-neutral-500 uppercase tracking-widest font-semibold mb-3">
              Tracking Code
            </p>
            <div className="flex items-center justify-center gap-4">
              <span className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-widest">
                {successData.trackingCode}
              </span>
              <button
                onClick={handleCopy}
                className="p-2 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-neutral-950"
                aria-label="Copy tracking code"
              >
                {copied ? <CheckCircle2 size={20} className="text-emerald-500" /> : <Copy size={20} />}
              </button>
            </div>
          </div>

          <div className="w-full flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-left mb-8">
            <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={18} />
            <div className="text-sm text-amber-200/80">
              <strong className="text-amber-500 block mb-0.5">Important:</strong>
              <span>Save this tracking code. You'll need it to track your complaint status.</span>
            </div>
          </div>

          <button
            onClick={() => window.location.href = '/student/complaints/track'}
            className="w-full sm:w-auto bg-white text-black font-semibold rounded-xl px-8 py-3.5 transition-all hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-900"
          >
            Track Complaint
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto shadow-2xl">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-1">Submit a Complaint</h2>
        <p className="text-sm text-neutral-400">
          Please provide detailed information about your concern
        </p>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400"
          >
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p className="text-sm font-medium leading-relaxed">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Scope Selection */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Globe size={16} className="text-neutral-400" />
            <label className="text-sm font-medium text-neutral-300">Scope</label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {["Department", "College"].map((s) => (
              <label
                key={s}
                className={`relative flex items-center justify-center p-3.5 rounded-xl border-2 cursor-pointer transition-all ${formData.scope === s
                    ? "border-indigo-500 bg-indigo-500/10 text-indigo-400"
                    : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700 hover:bg-neutral-900"
                  }`}
              >
                <input
                  type="radio"
                  name="scope"
                  value={s}
                  checked={formData.scope === s}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span className="text-sm font-medium">{s} Level</span>
              </label>
            ))}
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            {formData.scope === "Department"
              ? "Complaint will be sent to your department head"
              : "Complaint will be sent to college administration"}
          </p>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Tag size={16} className="text-neutral-400" />
            <label htmlFor="category" className="text-sm font-medium text-neutral-300">
              Category <span className="text-red-400">*</span>
            </label>
          </div>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none"
            required
          >
            <option value="" disabled>Select a category</option>
            {COMPLAINT_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Complaint Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-neutral-400" />
            <label htmlFor="text" className="text-sm font-medium text-neutral-300">
              Complaint Details <span className="text-red-400">*</span>
            </label>
          </div>
          <textarea
            id="text"
            name="text"
            value={formData.text}
            onChange={handleChange}
            rows={5}
            placeholder="Describe your complaint in detail. Include relevant information such as dates, times, and individuals involved if applicable..."
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-y min-h-[120px]"
            required
          />
          <p className="text-xs text-neutral-500">
            Minimum 20 characters recommended for clarity
          </p>
        </div>

        {/* Attachment */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-300">Attachment (Optional)</label>
          <AnimatePresence mode="wait">
            {attachment ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center justify-between bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FileText size={18} className="text-indigo-400 shrink-0" />
                  <span className="text-sm text-neutral-300 truncate">{attachment.name}</span>
                  <span className="text-xs text-neutral-500 shrink-0">
                    ({(attachment.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={removeAttachment}
                  className="text-neutral-500 hover:text-red-400 p-1.5 rounded-md hover:bg-neutral-900 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 shrink-0 ml-2"
                  aria-label="Remove attachment"
                >
                  <X size={16} />
                </button>
              </motion.div>
            ) : (
              <motion.label
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center gap-2 w-full bg-neutral-950 border-2 border-dashed border-neutral-800 rounded-xl px-4 py-6 text-neutral-400 hover:bg-neutral-900 hover:border-neutral-700 cursor-pointer transition-all focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-neutral-900"
              >
                <UploadCloud size={24} className="text-neutral-500" />
                <div className="text-center">
                  <p className="text-sm font-medium">Click to upload or drag & drop</p>
                  <p className="text-xs text-neutral-500 mt-0.5">PDF, JPG, PNG (Max 5MB)</p>
                </div>
                <input
                  type="file"
                  className="sr-only"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </motion.label>
            )}
          </AnimatePresence>
        </div>

        {/* Submit Button */}
        <LoadingButton
          type="submit"
          loading={loading}
          spinnerSize={18}
          spinnerColor="border-t-black border-black/20"
          icon={<Send size={18} />}
          className="w-full relative group overflow-hidden bg-white text-black font-semibold rounded-xl px-4 py-3.5 transition-all hover:bg-neutral-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-900 text-sm"
        >
          Submit Complaint
        </LoadingButton>

        {/* Form Footer Note */}
        <div className="pt-2 border-t border-neutral-800/50">
          <p className="text-xs text-neutral-500 text-center">
            By submitting this complaint, you agree to our <button type="button" className="text-indigo-400 hover:text-indigo-300 underline-offset-2 hover:underline transition-colors">terms of service</button> and <button type="button" className="text-indigo-400 hover:text-indigo-300 underline-offset-2 hover:underline transition-colors">privacy policy</button>.
            All complaints are treated confidentially.
          </p>
        </div>
      </form>
    </div>
  );
};

export default ComplaintForm;