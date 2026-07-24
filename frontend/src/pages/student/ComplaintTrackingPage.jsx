import React, { useState } from "react";
import { Search, Loader2, AlertCircle } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import EmptyState from "../../components/common/EmptyState";
import { trackComplaint } from "../../services/complaintService";
import ComplaintCard from "../../components/complaints/ComplaintCard";

const ComplaintTrackingPage = () => {
  const [trackingCode, setTrackingCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [complaint, setComplaint] = useState(null);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackingCode.trim()) return;

    setLoading(true);
    setError(null);
    setComplaint(null);
    
    try {
      const data = await trackComplaint(trackingCode);
      if (data) {
        setComplaint(data);
      }
    } catch (err) {
      console.error("Tracking error:", err);
      setError(
        err.response?.data?.detail ||
        "Complaint not found. Please check your tracking code."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-8 px-4 md:px-8">
      <PageHeader
        title="Track Complaint"
        subtitle="Check the current status of your submitted complaints using the tracking code."
      />

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 max-w-3xl mx-auto shadow-2xl space-y-8">
        
        <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <label htmlFor="tracking-code" className="sr-only">Enter Tracking Code</label>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
            <input
              id="tracking-code"
              type="text"
              placeholder="Enter Tracking Code (e.g. TRK-ABC1234)"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-mono text-base md:text-lg tracking-wide uppercase"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !trackingCode.trim()}
            className="md:w-36 bg-white text-black font-semibold rounded-xl px-4 py-3.5 transition-all hover:bg-neutral-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shrink-0 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-900"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span className="text-sm">Tracking...</span>
              </>
            ) : (
              <span className="text-sm">Track</span>
            )}
          </button>
        </form>

        <div className="min-h-[200px]">
          {loading ? (
             <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 h-48 animate-pulse flex flex-col justify-between mt-4">
               <div className="space-y-4">
                 <div className="h-6 bg-neutral-800 rounded w-1/3"></div>
                 <div className="h-4 bg-neutral-800 rounded w-full"></div>
                 <div className="h-4 bg-neutral-800 rounded w-full"></div>
                 <div className="h-4 bg-neutral-800 rounded w-1/2"></div>
               </div>
             </div>
          ) : error ? (
            <EmptyState 
              icon={AlertCircle} 
              title="Tracking Failed" 
              message={error} 
              className="bg-red-500/5 border-red-500/10 text-red-400 mt-4"
            />
          ) : complaint ? (
            <div className="pt-4 border-t border-neutral-800/50 mt-4">
              <h3 className="text-sm font-medium text-neutral-400 mb-4 uppercase tracking-wider">Tracking Result</h3>
              <ComplaintCard complaint={complaint} role="STUDENT" onUpdateStatus={() => {}} clampDescription={false} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 bg-neutral-900/30 border border-neutral-800 border-dashed rounded-2xl mt-4">
              <Search className="text-neutral-600 mb-3" size={28} />
              <p className="text-neutral-500 text-sm">Enter your tracking code above to check status.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintTrackingPage;
