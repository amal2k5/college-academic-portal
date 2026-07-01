import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Eye, X, Mail, Building2, User, CheckCircle, Power, AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";
import PageHeader from "../../components/common/PageHeader";
import { getCollegeAdmins, updateCollegeAdminStatus } from "../../services/collegeAdminService";

function CollegeAdmins() {
  const [collegeAdmins, setCollegeAdmins] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusActionAdmin, setStatusActionAdmin] = useState(null);

  useEffect(() => {
    fetchCollegeAdmins();
  }, []);

  const fetchCollegeAdmins = async () => {
    try {
      const data = await getCollegeAdmins();
      setCollegeAdmins(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load college admins");
    }
  };

  const handleToggleStatus = async (admin) => {
    setStatusActionAdmin(admin);
    setShowStatusModal(true);
  };

  const confirmStatusToggle = async () => {
    if (!statusActionAdmin) return;
    
    try {
      await updateCollegeAdminStatus(
        statusActionAdmin.id,
        !statusActionAdmin.is_active
      );

      toast.success(
        statusActionAdmin.is_active 
          ? "Admin deactivated successfully" 
          : "Admin activated successfully"
      );

      await fetchCollegeAdmins();

      if (selectedAdmin?.id === statusActionAdmin.id) {
        setSelectedAdmin(prev => ({
          ...prev,
          is_active: !statusActionAdmin.is_active,
        }));
      }

      setShowStatusModal(false);
      setStatusActionAdmin(null);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to update admin status");
    }
  };

  const filteredAdmins = collegeAdmins.filter((admin) => {
    const keyword = search.toLowerCase();
    return (
      `${admin.first_name} ${admin.last_name}`.toLowerCase().includes(keyword) ||
      admin.email.toLowerCase().includes(keyword) ||
      (admin.college || "").toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="space-y-6">
      {/* Unified Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-neutral-800/50 pb-6">
        <PageHeader 
          title="College Admins" 
          subtitle="Manage platform administrators and their college assignments."
        />

        {/* Search Control */}
        <div className="relative w-full sm:w-72 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search admins..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl bg-neutral-900/50 border border-neutral-800 py-2.5 pl-9 pr-4 text-sm text-white placeholder:text-neutral-600 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 focus:bg-neutral-900 outline-none transition-all"
          />
        </div>
      </div>

      {/* Table Container */}
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  className="border border-neutral-800/50 rounded-xl bg-neutral-950/30 backdrop-blur-sm overflow-hidden"
>
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b border-neutral-800/50 bg-neutral-950/50">
          <th className="px-6 py-4 text-left">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
              <User className="w-3.5 h-3.5" /> Admin
            </div>
          </th>
          <th className="px-6 py-4 text-left">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
              <Mail className="w-3.5 h-3.5" /> Email
            </div>
          </th>
          <th className="px-6 py-4 text-left">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" /> College
            </div>
          </th>
          <th className="px-6 py-4 text-left">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Status</span>
          </th>
          <th className="px-6 py-4 text-right">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-neutral-800/30">
        {filteredAdmins.length === 0 ? (
          <tr>
            <td colSpan="5" className="px-6 py-12 text-center">
              <div className="flex flex-col items-center gap-2">
                <Search className="w-8 h-8 text-neutral-700" />
                <span className="text-sm text-neutral-500">No admins found matching your search</span>
              </div>
            </td>
          </tr>
        ) : (
          filteredAdmins.map((admin) => (
            <motion.tr
              key={admin.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.015)" }}
              className="group transition-colors duration-150"
            >
              {/* Admin Name */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-neutral-500" />
                  </div>
                  <span className="text-sm text-white font-medium tracking-wide truncate max-w-[180px]">
                    {admin.first_name} {admin.last_name}
                  </span>
                </div>
              </td>

              {/* Email Pill */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
                  <span className="text-xs text-neutral-400 font-mono bg-neutral-900/50 px-2.5 py-1 rounded-md border border-neutral-800/50 truncate max-w-[220px] block">
                    {admin.email}
                  </span>
                </div>
              </td>

              {/* College */}
              <td className="px-6 py-4">
                <span className="text-sm text-neutral-400 truncate max-w-[160px] block">
                  {admin.college || "—"}
                </span>
              </td>

              {/* Status Badge */}
              <td className="px-6 py-4">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                  admin.is_active 
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                    : "bg-red-500/10 text-red-400 border-red-500/20"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${admin.is_active ? "bg-emerald-400" : "bg-red-400"}`} />
                  {admin.is_active ? "ACTIVE" : "INACTIVE"}
                </span>
              </td>

              {/* Actions */}
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  <button
                    onClick={() => setSelectedAdmin(admin)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-400 bg-neutral-900/50 border border-neutral-800/50 hover:text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </button>
                  
                  <button
                    onClick={() => handleToggleStatus(admin)}
                    className={`p-2 rounded-lg transition-all ${
                      admin.is_active
                        ? "text-neutral-500 hover:text-red-400 hover:bg-red-500/10"
                        : "text-neutral-500 hover:text-emerald-400 hover:bg-emerald-500/10"
                    }`}
                    title={admin.is_active ? "Deactivate" : "Activate"}
                  >
                    <Power className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </motion.tr>
          ))
        )}
      </tbody>
    </table>
  </div>
</motion.div>

      {/* Status Confirmation Modal */}
      <AnimatePresence>
        {showStatusModal && statusActionAdmin && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => { setShowStatusModal(false); setStatusActionAdmin(null); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-neutral-950 border border-neutral-900/80 rounded-3xl w-full max-w-sm p-6 relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.85)]"
            >
              <div className="absolute -right-12 -top-12 w-28 h-28 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex gap-4 mb-6 pt-4">
                <div className="p-2.5 bg-neutral-900/50 border border-neutral-800/60 rounded-2xl text-rose-400 shrink-0">
                  <AlertTriangle size={18} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-medium text-white uppercase tracking-wider">
                    {statusActionAdmin.is_active ? "Confirm Deactivation" : "Confirm Activation"}
                  </h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Are you sure you want to {statusActionAdmin.is_active ? "deactivate" : "activate"}{" "}
                    <span className="text-neutral-300">{statusActionAdmin.first_name} {statusActionAdmin.last_name}</span>?
                    {statusActionAdmin.is_active && " They will lose access to the system immediately."}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-neutral-900/60">
                <button
                  onClick={() => { setShowStatusModal(false); setStatusActionAdmin(null); }}
                  className="flex-1 px-4 py-2.5 rounded-2xl border border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white text-xs font-medium uppercase tracking-wider transition-all duration-150 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmStatusToggle}
                  className={`flex-1 px-4 py-2.5 rounded-2xl text-black text-xs font-medium uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                    statusActionAdmin.is_active 
                      ? "bg-white hover:bg-neutral-200" 
                      : "bg-emerald-400 hover:bg-emerald-300"
                  }`}
                >
                  {statusActionAdmin.is_active ? "Deactivate" : "Activate"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Details Modal */}
      <AnimatePresence>
        {selectedAdmin && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setSelectedAdmin(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-neutral-950 border border-neutral-900/80 rounded-3xl w-full max-w-md shadow-[0_0_50px_rgba(0,0,0,0.85)] overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-neutral-900/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white text-sm font-semibold">
                    {`${selectedAdmin.first_name?.charAt(0) || ''}${selectedAdmin.last_name?.charAt(0) || ''}`.toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {selectedAdmin.first_name} {selectedAdmin.last_name}
                    </h3>
                    <p className="text-xs text-neutral-500">College Administrator</p>
                  </div>
                </div>
                <button onClick={() => setSelectedAdmin(null)} className="p-1.5 rounded-xl hover:bg-neutral-900/50 transition-colors">
                  <X className="w-4 h-4 text-neutral-500 hover:text-white" />
                </button>
              </div>

              <div className="px-6 py-6 space-y-5">
                <div>
                  <label className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Email Address</label>
                  <div className="mt-1.5 flex items-center gap-2.5 p-3 rounded-2xl bg-neutral-900/50 border border-neutral-800/60">
                    <Mail className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                    <span className="text-sm text-neutral-300 font-mono truncate">{selectedAdmin.email}</span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Assigned College</label>
                  <div className="mt-1.5 flex items-center gap-2.5 p-3 rounded-2xl bg-neutral-900/50 border border-neutral-800/60">
                    <Building2 className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                    <span className="text-sm text-neutral-300 font-medium">{selectedAdmin.college || "Not Assigned"}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Status</label>
                    <div className="mt-1.5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border ${
                        selectedAdmin.is_active
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${selectedAdmin.is_active ? "bg-emerald-400" : "bg-red-400"}`} />
                        {selectedAdmin.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Joined Date</label>
                    <p className="mt-1.5 text-sm text-neutral-300 font-medium">
                      {selectedAdmin.created_at
                        ? new Date(selectedAdmin.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-neutral-900/60 bg-neutral-900/20">
                <button
                  onClick={() => setSelectedAdmin(null)}
                  className="w-full py-2.5 rounded-2xl border border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white text-xs font-medium uppercase tracking-wider transition-all duration-150 cursor-pointer"
                >
                  Close Details
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CollegeAdmins;