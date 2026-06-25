import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Users, UserPlus, Mail, Building2, UserCog } from "lucide-react";
import HODForm from "../../components/hods/HODForm";
import { createHOD, getHODs } from "../../services/hodService";

const ease = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};

const gridStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

function HODs() {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hods, setHods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHODs();
  }, []);

  const fetchHODs = async () => {
    try {
      const data = await getHODs();
      setHods(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (formData) => {
    setIsSubmitting(true);
    try {
      const response = await createHOD(formData);
      await fetchHODs();
      alert(response.message || "HOD created successfully!");
      setShowForm(false);
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Failed to create HOD");
    } finally {
      setIsSubmitting(false);
    }
  };

  const statCards = [
    { label: "Total HODs", value: hods.length, iconClass: "text-violet-400", strip: "from-violet-600 via-violet-400 to-violet-600", icon: UserCog },
    { label: "Active Departments", value: hods.length, iconClass: "text-blue-400", strip: "from-blue-600 via-blue-400 to-blue-600", icon: Building2 },
    { label: "Pending Actions", value: 0, iconClass: "text-amber-400", strip: "from-amber-600 via-amber-400 to-amber-600", icon: Users },
  ];

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
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="max-w-7xl mx-auto space-y-6"
    >
      {/* Header */}
      <motion.div
        variants={fadeUp}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-6 border-b border-neutral-800"
      >
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
      </motion.div>

      {/* Stat Cards */}
      <motion.div
        variants={gridStagger}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {statCards.map(({ label, value, icon: Icon, iconClass, strip }) => (
          <motion.div
            key={label}
            variants={fadeUp}
            className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-2xl overflow-hidden transition-all duration-200"
          >
            <div className={`h-[3px] w-full bg-gradient-to-r ${strip}`} />
            <div className="p-5 flex items-start justify-between gap-3">
              <div className="space-y-1.5">
                <p className="text-[9px] font-semibold text-neutral-500 uppercase tracking-[0.2em]">
                  {label}
                </p>
                <p className="text-2xl font-semibold text-neutral-100 tracking-tight leading-none">
                  {value}
                </p>
              </div>
              <div className={`p-2.5 bg-neutral-800 border border-neutral-700 rounded-xl ${iconClass} shrink-0`}>
                <Icon size={15} strokeWidth={1.6} />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* HOD Table / Empty State */}
      <motion.div
        variants={fadeUp}
        className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden"
      >
        <div className="h-[3px] w-full bg-gradient-to-r from-violet-600 via-violet-400 to-violet-600" />

        {/* Table header */}
        <div className="px-6 py-5 border-b border-neutral-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="text-violet-400">
              <Users size={14} strokeWidth={1.6} />
            </div>
            <h2 className="text-[10px] font-bold text-neutral-300 uppercase tracking-[0.22em]">
              Registered HODs
            </h2>
          </div>
          <span className="text-[10px] font-semibold text-neutral-500 bg-neutral-800 border border-neutral-700 px-2.5 py-1 rounded-lg">
            {hods.length} total
          </span>
        </div>

        {hods.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-14 h-14 bg-neutral-800 border border-neutral-700 rounded-2xl flex items-center justify-center mb-4">
              <Users size={22} strokeWidth={1.4} className="text-neutral-500" />
            </div>
            <h3 className="text-[14px] font-semibold text-neutral-300 mb-1.5">
              No HODs Added Yet
            </h3>
            <p className="text-[12px] text-neutral-600 mb-6 tracking-wide">
              Start by adding your first head of department.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 hover:border-neutral-600 text-neutral-200 rounded-xl transition-all duration-200 text-[11px] font-semibold uppercase tracking-wider cursor-pointer"
            >
              <Plus size={13} strokeWidth={2} />
              Add First HOD
            </button>
          </div>
        ) : (
          <div className="p-4 space-y-2">
            <motion.div variants={gridStagger}>
              {/* Column labels */}
              <div className="grid grid-cols-3 px-4 pb-2 mb-1">
                {["Name", "Email", "Department"].map((col) => (
                  <span key={col} className="text-[9px] font-semibold text-neutral-600 uppercase tracking-[0.18em]">
                    {col}
                  </span>
                ))}
              </div>

              {/* Rows */}
              {hods.map((hod) => (
                <motion.div
                  key={hod.id}
                  variants={fadeUp}
                  className="grid grid-cols-3 items-center p-4 bg-neutral-800/50 border border-neutral-700/60 hover:border-neutral-600 hover:bg-neutral-800 rounded-xl transition-all duration-200 gap-4"
                >
                  {/* Name */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-neutral-700 border border-neutral-600 flex items-center justify-center text-[11px] font-semibold text-neutral-300 shrink-0 select-none">
                      {hod.first_name?.[0] || ""}{hod.last_name?.[0] || ""}
                    </div>
                    <span className="text-[13px] font-medium text-neutral-100 truncate">
                      {hod.first_name} {hod.last_name}
                    </span>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-2 min-w-0">
                    <Mail size={12} strokeWidth={1.6} className="text-neutral-600 shrink-0" />
                    <span className="text-[12px] text-neutral-400 truncate tracking-wide">
                      {hod.email}
                    </span>
                  </div>

                  {/* Department */}
                  <div className="flex items-center gap-2 min-w-0">
                    <Building2 size={12} strokeWidth={1.6} className="text-neutral-600 shrink-0" />
                    <span className="text-[12px] text-neutral-400 truncate tracking-wide">
                      {hod.department || "—"}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </motion.div>

      {showForm && (
        <HODForm
          onSubmit={handleCreate}
          onClose={() => setShowForm(false)}
          isSubmitting={isSubmitting}
        />
      )}
    </motion.div>
  );
}

export default HODs;