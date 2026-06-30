import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Eye,
  X,
  Calendar,
  Mail,
  Building2,
  User,
  CheckCircle,
  Clock,
  Power,
  UserCircle,
  AlertTriangle,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import {
  getCollegeAdmins,
  updateCollegeAdminStatus,
} from "../../services/collegeAdminService";

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

      await fetchCollegeAdmins();

      if (selectedAdmin?.id === statusActionAdmin.id) {
        setSelectedAdmin({
          ...selectedAdmin,
          is_active: !statusActionAdmin.is_active,
        });
      }

      setShowStatusModal(false);
      setStatusActionAdmin(null);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredAdmins = collegeAdmins.filter((admin) => {
    const keyword = search.toLowerCase();
    return (
      `${admin.first_name} ${admin.last_name}`
        .toLowerCase()
        .includes(keyword) ||
      admin.email.toLowerCase().includes(keyword) ||
      (admin.college || "").toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-8 font-sans">
      <PageHeader title="College Admins" />

      {/* Search Bar */}
      <div className="mt-6 mb-6">
        <input
          type="text"
          placeholder="Search admins..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md rounded-lg border border-white/10 bg-zinc-900/50 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:bg-zinc-900 focus:outline-none transition-all"
        />
      </div>

      {/* Table Container */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="border border-neutral-800/50 rounded-xl bg-neutral-900/20 backdrop-blur-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-800/50 bg-neutral-900/30">
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center gap-2 text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
                    <User className="w-3.5 h-3.5" />
                    Admin
                  </div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center gap-2 text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
                    <Mail className="w-3.5 h-3.5" />
                    Email
                  </div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center gap-2 text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
                    <Building2 className="w-3.5 h-3.5" />
                    College
                  </div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center gap-2 text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Status
                  </div>
                </th>
                <th className="px-6 py-3 text-right">
                  <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
                    Actions
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/30">
              {filteredAdmins.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="w-8 h-8 text-neutral-700" />
                      <span className="text-sm text-neutral-500">
                        No admins found
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAdmins.map((admin) => (
                  <motion.tr
                    key={admin.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="group hover:bg-white/[0.02] transition-colors duration-150"
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center border border-blue-500/10">
                          <span className="text-xs font-medium text-blue-400">
                            {`${admin.first_name?.charAt(0) || ""}${admin.last_name?.charAt(0) || ""}`.toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm text-white font-medium tracking-wide">
                          {admin.first_name} {admin.last_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="text-sm text-neutral-400 font-mono">
                        {admin.email}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="text-sm text-neutral-400">
                        {admin.college || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            admin.is_active
                              ? "bg-emerald-400"
                              : "bg-neutral-500"
                          }`}
                        />
                        <span
                          className={`text-xs font-medium ${
                            admin.is_active
                              ? "text-emerald-400"
                              : "text-neutral-400"
                          }`}
                        >
                          {admin.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedAdmin(admin)}
                          className="p-2 rounded-lg text-neutral-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-150"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(admin)}
                          className={`p-2 rounded-lg transition-all duration-150 group/btn ${
                            admin.is_active
                              ? "text-neutral-500 hover:text-red-400 hover:bg-red-500/10"
                              : "text-neutral-500 hover:text-emerald-400 hover:bg-emerald-500/10"
                          }`}
                          title={admin.is_active ? "Deactivate" : "Activate"}
                        >
                          <Power className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => {
              setShowStatusModal(false);
              setStatusActionAdmin(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-black border border-neutral-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-neutral-800 flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  statusActionAdmin.is_active
                    ? "bg-red-500/10 text-red-400"
                    : "bg-emerald-500/10 text-emerald-400"
                }`}>
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-white">
                  {statusActionAdmin.is_active ? "Deactivate" : "Activate"} Admin
                </h3>
              </div>

              {/* Body */}
              <div className="px-6 py-6">
                <p className="text-sm text-neutral-300">
                  Are you sure you want to{" "}
                  <span className={`font-medium ${
                    statusActionAdmin.is_active ? "text-red-400" : "text-emerald-400"
                  }`}>
                    {statusActionAdmin.is_active ? "deactivate" : "activate"}
                  </span>{" "}
                  <span className="text-white font-medium">
                    {statusActionAdmin.first_name} {statusActionAdmin.last_name}
                  </span>
                  ?
                </p>
                <p className="text-xs text-neutral-500 mt-2">
                  {statusActionAdmin.is_active
                    ? "This admin will lose access to the system."
                    : "This admin will regain access to the system."}
                </p>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-900/30 flex gap-3">
                <button
                  onClick={() => {
                    setShowStatusModal(false);
                    setStatusActionAdmin(null);
                  }}
                  className="flex-1 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmStatusToggle}
                  className={`flex-1 py-2.5 rounded-lg text-white text-sm font-medium transition-colors ${
                    statusActionAdmin.is_active
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-emerald-600 hover:bg-emerald-700"
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setSelectedAdmin(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-black border border-neutral-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
                    {`${selectedAdmin.first_name?.charAt(0) || ''}${selectedAdmin.last_name?.charAt(0) || ''}`.toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {selectedAdmin.first_name} {selectedAdmin.last_name}
                    </h3>
                    <p className="text-xs text-neutral-500">College Administrator</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAdmin(null)}
                  className="p-1.5 rounded-lg hover:bg-neutral-800/50 transition-colors"
                >
                  <X className="w-4 h-4 text-neutral-400 hover:text-white transition-colors" />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-6 space-y-5">
                {/* Email */}
                <div>
                  <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="mt-1.5 flex items-center gap-2.5 p-3 rounded-lg bg-neutral-900/50 border border-neutral-800">
                    <Mail className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                    <span className="text-sm text-neutral-300 font-mono truncate">
                      {selectedAdmin.email}
                    </span>
                  </div>
                </div>

                {/* College */}
                <div>
                  <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    College
                  </label>
                  <div className="mt-1.5 flex items-center gap-2.5 p-3 rounded-lg bg-neutral-900/50 border border-neutral-800">
                    <Building2 className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                    <span className="text-sm text-neutral-300 font-medium">
                      {selectedAdmin.college || "Not Assigned"}
                    </span>
                  </div>
                </div>

                {/* Status & Joined */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Status
                    </label>
                    <div className="mt-1.5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
                        selectedAdmin.is_active
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${selectedAdmin.is_active ? "bg-emerald-400" : "bg-red-400"}`} />
                        {selectedAdmin.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Joined
                    </label>
                    <p className="mt-1.5 text-sm text-neutral-300 font-medium">
                      {selectedAdmin.created_at
                        ? new Date(selectedAdmin.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-900/30">
                <button
                  onClick={() => setSelectedAdmin(null)}
                  className="w-full py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium transition-colors"
                >
                  Close
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