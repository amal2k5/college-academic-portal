import { Building2, Mail, Calendar, Eye } from "lucide-react";
import { motion } from "framer-motion";

const StatusBadge = ({ status }) => {
  const colors = {
    PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    APPROVED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    REJECTED: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  const dots = {
    PENDING: "bg-amber-400",
    APPROVED: "bg-emerald-400",
    REJECTED: "bg-red-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-wider ${
        colors[status] || colors.PENDING
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status] || dots.PENDING}`} />
      {status}
    </span>
  );
};

const CollegeRequestsTable = ({ loading, requests, onView }) => {
  if (loading) {
    return (
      <div className="border border-neutral-800/50 rounded-xl bg-neutral-900/30 p-16 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="mx-auto w-6 h-6 rounded-full border-2 border-neutral-700 border-t-blue-500 mb-3"
        />
        <p className="text-sm text-neutral-500">Loading requests...</p>
      </div>
    );
  }

  if (!requests.length) {
    return (
      <div className="border border-neutral-800/50 rounded-xl bg-neutral-900/30 p-16 text-center">
        <Building2 className="mx-auto w-10 h-10 text-neutral-700 mb-3" />
        <h3 className="text-sm font-medium text-white">No Requests Found</h3>
        <p className="mt-1 text-sm text-neutral-500">
          No pending college registration requests
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border border-neutral-800/50 rounded-xl bg-neutral-900/30 overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-neutral-800/50 bg-neutral-900/50">
            <tr>
              <th className="px-5 py-3 text-left w-[30%]">
                <div className="flex items-center gap-2 text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
                  <Building2 className="w-3.5 h-3.5" />
                  College
                </div>
              </th>
              <th className="px-5 py-3 text-left w-[25%]">
                <div className="flex items-center gap-2 text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
                  <Mail className="w-3.5 h-3.5" />
                  Email
                </div>
              </th>
              <th className="px-5 py-3 text-left w-[15%]">
                <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
                  Status
                </span>
              </th>
              <th className="px-5 py-3 text-left w-[15%]">
                <div className="flex items-center gap-2 text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5" />
                  Submitted
                </div>
              </th>
              <th className="px-5 py-3 text-right w-[15%]">
                <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/30">
            {requests.map((request, index) => (
              <motion.tr
                key={request.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.015)" }}
                className="group transition-colors duration-150"
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-neutral-800/50 border border-neutral-700/50 flex items-center justify-center shrink-0">
                      <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                    </div>
                    <span className="text-sm text-white font-medium truncate">
                      {request.college_name}
                    </span>
                  </div>
                </td>

                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    <span className="text-xs text-neutral-300 font-mono bg-neutral-800/30 px-2 py-0.5 rounded border border-neutral-700/30 truncate max-w-[200px]">
                      {request.email}
                    </span>
                  </div>
                </td>

                <td className="px-5 py-3.5">
                  <StatusBadge status={request.status} />
                </td>

                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <Calendar className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    {new Date(request.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </td>

                <td className="px-5 py-3.5 text-right">
                  <button
                    onClick={() => onView(request)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-400 bg-neutral-800/50 border border-neutral-700/50 hover:text-indigo-400 hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all duration-150 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default CollegeRequestsTable;