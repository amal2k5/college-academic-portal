import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { Copy, CheckCircle2, AlertCircle, Loader2, UploadCloud, X } from "lucide-react";
import { createComplaint } from "../../services/complaintService";
import { AuthContext } from "../../context/AuthContext";

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
        console.log("Current User:", user);

        const deptId = user?.department || user?.department_id;

        console.log("Department ID:", deptId);

        if (!deptId) {
          setError("Your account is not assigned to a department...");
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
          // Extract first field-level error
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 max-w-2xl mx-auto text-center shadow-2xl"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center">
            <CheckCircle2 size={32} />
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-white mb-2">Complaint Submitted Successfully</h2>
        <p className="text-neutral-400 mb-8 text-sm">
          Your complaint has been registered. Our team will look into it shortly.
        </p>

        <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6 mb-6">
          <p className="text-xs text-neutral-500 mb-3 uppercase tracking-widest font-semibold">Your Tracking Code</p>
          <div className="flex items-center justify-center gap-4">
            <span className="text-3xl font-mono font-bold text-white tracking-widest">{successData.trackingCode}</span>
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-neutral-950"
              aria-label="Copy tracking code"
              title="Copy to clipboard"
            >
              {copied ? <CheckCircle2 size={24} className="text-green-500" /> : <Copy size={24} />}
            </button>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-left mb-8">
          <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={18} />
          <p className="text-sm text-amber-200/80 leading-relaxed">
            <strong className="text-amber-500 block mb-0.5">Important:</strong>
            Save this tracking code. It is required for future tracking of your complaint status.
          </p>
        </div>

        <button
          onClick={() => window.location.href = '/student/complaints/track'}
          className="w-full sm:w-auto bg-white text-black font-semibold rounded-xl px-8 py-3 transition-all hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-900"
        >
          Track Complaint
        </button>
      </motion.div>
    );
  }

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto shadow-2xl">
      <h2 className="text-2xl font-semibold text-white mb-6">Submit a Complaint</h2>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
          <AlertCircle size={20} className="shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-neutral-300">Scope</legend>
          <div className="grid grid-cols-2 gap-4">
            {["Department", "College"].map((s) => (
              <label
                key={s}
                className={`flex items-center justify-center p-3.5 rounded-xl border cursor-pointer transition-all ${formData.scope === s
                  ? "bg-indigo-500/10 border-indigo-500 text-indigo-400"
                  : "bg-neutral-950 border-neutral-800 text-neutral-500 hover:border-neutral-700 hover:bg-neutral-900"
                  }`}
              >
                <input
                  type="radio"
                  name="scope"
                  value={s}
                  checked={formData.scope === s}
                  onChange={handleChange}
                  className="sr-only"
                  aria-label={`${s} Level`}
                />
                <span className="text-sm font-medium">{s} Level</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-medium text-neutral-300">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="" disabled>
              Select a category
            </option>

            {COMPLAINT_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="text" className="text-sm font-medium text-neutral-300">Complaint Details</label>
          <textarea
            id="text"
            name="text"
            value={formData.text}
            onChange={handleChange}
            rows={5}
            placeholder="Please describe your complaint in detail..."
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none custom-scrollbar"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-300">Attachment (Optional)</label>
          {attachment ? (
            <div className="flex items-center justify-between bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3">
              <span className="text-sm text-neutral-300 truncate pr-4">{attachment.name}</span>
              <button
                type="button"
                onClick={removeAttachment}
                className="text-neutral-500 hover:text-red-400 p-1 rounded-md hover:bg-neutral-900 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Remove attachment"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <label className="flex items-center justify-center gap-2 w-full bg-neutral-950 border border-neutral-800 border-dashed rounded-xl px-4 py-6 text-neutral-400 hover:bg-neutral-900 hover:border-neutral-700 cursor-pointer transition-all focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-neutral-900">
              <UploadCloud size={20} />
              <span className="text-sm font-medium">Click to upload a file</span>
              <input
                type="file"
                className="sr-only"
                onChange={handleFileChange}
                aria-label="Upload an attachment"
              />
            </label>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full relative group overflow-hidden bg-white text-black font-semibold rounded-xl px-4 py-3.5 transition-all hover:bg-neutral-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-900"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              <span className="text-sm">Submitting...</span>
            </>
          ) : (
            <span className="text-sm">Submit Complaint</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default ComplaintForm;
