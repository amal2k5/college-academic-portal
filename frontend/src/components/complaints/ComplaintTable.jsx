import React from "react";
import { Eye, Clock, CheckCircle } from "lucide-react";

const statusConfig = {
  PENDING: { color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20", icon: Clock, label: "Pending" },
  SUBMITTED: { color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20", icon: Clock, label: "Submitted" },
  SEEN: { color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", icon: Eye, label: "Seen" },
  RESOLVED: { color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20", icon: CheckCircle, label: "Resolved" },
};

function StatusBadge({ status }) {
  const statusKey = status?.toUpperCase() || "PENDING";
  const { color, bg, border, icon: StatusIcon, label } = statusConfig[statusKey] || statusConfig.PENDING;
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${bg} ${border} ${color}`}>
      <StatusIcon size={12} />
      <span className="text-[10px] font-semibold uppercase tracking-wider">{label}</span>
    </span>
  );
}

function ComplaintTable({ complaints = [], onView }) {
  return (
    <div className="bg-neutral-900/70 border border-neutral-800/60 rounded-2xl overflow-hidden shadow-xl backdrop-blur-xl relative">
      <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-indigo-500/20 to-transparent rounded-l-2xl z-20" />
      
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
        <table className="w-full text-left border-collapse whitespace-nowrap relative z-10">
          <thead className="bg-neutral-900/50 border-b border-neutral-800/60">
            <tr>
              <th scope="col" className="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-widest">Tracking Code</th>
              <th scope="col" className="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-widest">Category</th>
              <th scope="col" className="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-widest">Scope</th>
              <th scope="col" className="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-widest">Status</th>
              <th scope="col" className="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-widest">Created Date</th>
              <th scope="col" className="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-widest text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/40 bg-transparent">
            {complaints.map((complaint) => (
              <tr key={complaint.id || complaint.tracking_code} className="hover:bg-neutral-800/30 transition-colors duration-200 group">
                <td className="px-6 py-4 text-sm font-mono font-medium text-white">
                  {complaint.tracking_code}
                </td>
                <td className="px-6 py-4 text-xs font-medium text-neutral-200">
                  {complaint.category}
                </td>
                <td className="px-6 py-4 text-xs">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-neutral-800 text-neutral-300">
                    {complaint.scope}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs">
                  <StatusBadge status={complaint.status} />
                </td>
                <td className="px-6 py-4 text-xs font-normal text-neutral-400">
                  {new Date(complaint.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-xs text-center">
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => onView(complaint)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-medium uppercase tracking-widest text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors duration-200 shadow-sm cursor-pointer"
                    >
                      <Eye size={14} />
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ComplaintTable;
