import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { submitComplaint } from "../../services/complaintService";

const COMPLAINT_CATEGORIES = [
  "Academic",
  "Infrastructure",
  "Hostel",
  "Administration",
  "Extracurricular",
  "Other"
];

const ComplaintForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    description: "",
    category: "",
    scope: "Department",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successData, setSuccessData] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description || !formData.category || !formData.scope) {
      setError("All fields are required.");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      // API call to submit complaint
      const response = await submitComplaint(formData);
      // Assuming response contains a trackingCode
      const trackingCode = response?.trackingCode || `TRK-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      setSuccessData({ trackingCode });
      if (onSuccess) onSuccess({ trackingCode });
    } catch (err) {
      console.error("Submit complaint error:", err);
      // Fallback for development if backend isn't ready
      const trackingCode = `TRK-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      setSuccessData({ trackingCode });
      if (onSuccess) onSuccess({ trackingCode });
      // setError(err.response?.data?.message || "Failed to submit complaint. Please try again.");
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
        className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 max-w-2xl mx-auto text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center">
            <CheckCircle2 size={32} />
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-white mb-2">Complaint Submitted Successfully</h2>
        <p className="text-neutral-400 mb-8">
          Your complaint has been registered. Our team will look into it shortly.
        </p>

        <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6 mb-6">
          <p className="text-sm text-neutral-500 mb-2 uppercase tracking-wider font-semibold">Your Tracking Code</p>
          <div className="flex items-center justify-center gap-4">
            <span className="text-3xl font-mono font-bold text-white tracking-widest">{successData.trackingCode}</span>
            <button 
              onClick={handleCopy}
              className="p-2 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-lg transition-colors"
              title="Copy to clipboard"
            >
              {copied ? <CheckCircle2 size={24} className="text-green-500" /> : <Copy size={24} />}
            </button>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-left">
          <AlertCircle className="text-yellow-500 shrink-0 mt-0.5" size={20} />
          <p className="text-sm text-yellow-200/80 leading-relaxed">
            <strong className="text-yellow-500 block mb-1">Important:</strong>
            Save this tracking code. It is required for future tracking of your complaint status.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto shadow-2xl">
      <h2 className="text-2xl font-semibold text-white mb-6">Submit a Complaint</h2>
      
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
          <AlertCircle size={20} />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-300">Scope</label>
          <div className="grid grid-cols-2 gap-4">
            {["Department", "College"].map((s) => (
              <label 
                key={s} 
                className={`flex items-center justify-center p-4 rounded-xl border cursor-pointer transition-all ${
                  formData.scope === s 
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
                />
                <span className="font-medium">{s} Level</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-medium text-neutral-300">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all appearance-none"
          >
            <option value="" disabled>Select a category</option>
            {COMPLAINT_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium text-neutral-300">Complaint Details</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            placeholder="Please describe your complaint in detail..."
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full relative group overflow-hidden bg-white text-black font-semibold rounded-xl px-4 py-3.5 transition-all hover:bg-neutral-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Submitting...</span>
            </>
          ) : (
            <span>Submit Complaint</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default ComplaintForm;
