import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserPlus,
  Mail,
  Building2,
  Eye,
  Power,
  X,
  Search,
  Phone,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import HODForm from "../../components/hods/HODForm";
import {
  createHOD,
  getHODs,
  updateHODStatus,
  getHODDetails,
} from "../../services/hodService";

function HODs() {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hods, setHods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Modal States
  const [selectedHOD, setSelectedHOD] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [hodToToggle, setHodToToggle] = useState(null);

  useEffect(() => {
    fetchHODs();
  }, []);

  const fetchHODs = async () => {
    try {
      setLoading(true);
      const data = await getHODs();
      setHods(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load HODs");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (formData) => {
    setIsSubmitting(true);
    try {
      const response = await createHOD(formData);
      await fetchHODs();
      toast.success(response.message || "HOD created successfully!");
      setShowForm(false);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to create HOD");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      const response = await updateHODStatus(id, !currentStatus);
      toast.success(response.message);
      await fetchHODs();
      
      // Update selected HOD in view modal if open
      if (selectedHOD && selectedHOD.id === id) {
        setSelectedHOD((prev) => ({
          ...prev,
          is_active: !currentStatus,
        }));
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update HOD status.");
    }
  };

  const handleViewDetails = async (id) => {
    setSelectedHOD({}); // Clear previous data to show loader
    setViewLoading(true);
    try {
      const data = await getHODDetails(id);
      setSelectedHOD(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load HOD details");
      setSelectedHOD(null);
    } finally {
      setViewLoading(false);
    }
  };

  const filteredHODs = hods.filter((hod) => {
    const keyword = search.toLowerCase();
    return (
      `${hod.first_name} ${hod.last_name}`.toLowerCase().includes(keyword) ||
      hod.email.toLowerCase().includes(keyword) ||
      (hod.department || "").toLowerCase().includes(keyword)
    );
  });

  // Dynamic Stats
  const activeCount = hods.filter((h) => h.is_active).length;
  const inactiveCount = hods.filter((h) => !h.is_active).length;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-6 h-6 rounded-full border-2 border-neutral-800 border-t-indigo-400"
        />
        <p className="text-[10px] text-neutral-500 tracking-[0.25em] uppercase">
          Loading HODs
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-[0.22em] mb-1.5">
            Management
          </p>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            HOD Management
          </h1>
          <p className="text-[12px] text-neutral-500 mt-1 tracking-wide">
            Manage and assign department heads.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all duration-200 text-[11px] font-semibold uppercase tracking-wider cursor-pointer self-start sm:self-auto whitespace-nowrap"
        >
          <UserPlus size={14} strokeWidth={2} />
          Add HOD
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total HODs", value: hods.length, color: "text-white" },
          { label: "Active HODs", value: activeCount, color: "text-emerald-400" },
          { label: "Inactive HODs", value: inactiveCount, color: "text-red-400" },
        ].map((stat, idx) => (
          <div key={idx} className="bg-zinc-900 border border-white/10 rounded-xl p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
            <div className="p-2 bg-white/5 rounded-lg">
              <Users className="w-5 h-5 text-neutral-400" />
            </div>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name, email or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-zinc-900 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-indigo-500/50 focus:bg-black focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Table Container */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="border border-white/10 rounded-2xl bg-zinc-900 overflow-hidden shadow-xl"
      >
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm min-w-[800px]">
            <thead className="bg-black/40 text-gray-500 font-medium border-b border-white/5 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-6 py-4">HOD Profile</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredHODs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-600">
                      <Users className="w-8 h-8 mb-3 opacity-50" />
                      <p className="text-sm font-medium">No HODs found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredHODs.map((hod, index) => (
                  <motion.tr
                    key={hod.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.03)" }}
                    className="group transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center text-xs font-semibold text-gray-300">
                          {hod.first_name?.[0]}{hod.last_name?.[0]}
                        </div>
                        <span className="font-medium text-white tracking-tight">
                          {hod.first_name} {hod.last_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-gray-400 bg-black/30 px-2 py-1 rounded border border-white/5">
                        {hod.email}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300 font-medium">
                      {hod.department || <span className="text-gray-600 italic">Unassigned</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium border ${
                          hod.is_active
                            ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/10"
                            : "bg-red-500/5 text-red-400 border-red-500/10"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${hod.is_active ? 'bg-emerald-400' : 'bg-red-400'}`} />
                        {hod.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleViewDetails(hod.id)}
                          className="p-2 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setHodToToggle(hod);
                            setShowStatusModal(true);
                          }}
                          className={`p-2 rounded-lg transition-all ${
                            hod.is_active
                              ? "text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                              : "text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10"
                          }`}
                          title={hod.is_active ? "Deactivate" : "Activate"}
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

      {/* View Details Modal */}
      <AnimatePresence>
        {selectedHOD && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={() => setSelectedHOD(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">HOD Details</h3>
                <button onClick={() => setSelectedHOD(null)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {viewLoading ? (
                  <div className="py-12 flex justify-center">
                    <div className="w-6 h-6 rounded-full border-2 border-neutral-800 border-t-indigo-400 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-white/10 flex items-center justify-center text-lg font-bold text-white">
                        {selectedHOD.first_name?.[0]}{selectedHOD.last_name?.[0]}
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-white">{selectedHOD.first_name} {selectedHOD.last_name}</h4>
                        <p className="text-sm text-gray-400">Head of Department</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="p-3 rounded-lg bg-black/40 border border-white/5 flex items-center gap-3">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-white font-mono">{selectedHOD.email}</span>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-black/40 border border-white/5 flex items-center gap-3">
                        <Building2 className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-white">{selectedHOD.department || "Unassigned"}</span>
                      </div>

                      {selectedHOD.phone && (
                        <div className="p-3 rounded-lg bg-black/40 border border-white/5 flex items-center gap-3">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-white">{selectedHOD.phone}</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                      <div>
                        <p className="text-xs text-gray-500 uppercase mb-1">Status</p>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${
                          selectedHOD.is_active
                            ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/10"
                            : "bg-red-500/5 text-red-400 border-red-500/10"
                        }`}>
                          {selectedHOD.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase mb-1">Joined</p>
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          {selectedHOD.joined_at
                            ? new Date(selectedHOD.joined_at).toLocaleDateString()
                            : "-"}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {!viewLoading && (
                <div className="p-4 border-t border-white/5 bg-white/5">
                  <button
                    onClick={() => setSelectedHOD(null)}
                    className="w-full py-2.5 rounded-lg bg-white text-black font-semibold text-sm hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Toggle Confirmation Modal */}
      <AnimatePresence>
        {showStatusModal && hodToToggle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setShowStatusModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-sm p-6 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-full ${hodToToggle.is_active ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                  <AlertCircle className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  {hodToToggle.is_active ? "Deactivate HOD?" : "Activate HOD?"}
                </h3>
              </div>
              
              <p className="text-sm text-gray-400 mb-6">
                Are you sure you want to {hodToToggle.is_active ? "deactivate" : "activate"} <span className="text-white font-medium">{hodToToggle.first_name}</span>?
                {hodToToggle.is_active && " They will lose access immediately."}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="flex-1 py-2.5 rounded-lg border border-white/10 text-gray-300 hover:bg-white/5 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    await handleStatusToggle(hodToToggle.id, hodToToggle.is_active);
                    setShowStatusModal(false);
                    setHodToToggle(null);
                  }}
                  className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
                    hodToToggle.is_active
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white"
                  }`}
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showForm && (
        <HODForm
          onSubmit={handleCreate}
          onClose={() => setShowForm(false)}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}

export default HODs;