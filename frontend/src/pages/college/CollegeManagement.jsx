import { useEffect, useState } from "react";
import CollegeTable from "../../components/colleges/CollegeTable";
import PageHeader from "../../components/common/PageHeader";
import {
  getColleges,
  deleteCollege,
} from "../../services/collegeService";
import { AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Colleges() {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [collegeToDeactivate, setCollegeToDeactivate] = useState(null);

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      setLoading(true);
      const data = await getColleges();
      
    
      const collegeList = data.results ? data.results : data;
      
      setColleges(collegeList);
    } catch (error) {
      console.error(error);
      setError("Failed to load colleges");
    } finally {
      setLoading(false);
    }
  };



  const handleDeactivateCollege = async () => {
    try {
      if (!collegeToDeactivate) return;
      
      await deleteCollege(collegeToDeactivate);
      await fetchColleges();
      
      setShowDeactivateModal(false);
      setCollegeToDeactivate(null);
    } catch (error) {
      console.error(error);

    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 p-4 bg-red-50 rounded-lg">{error}</div>;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-8 px-4 md:px-8">
      <PageHeader 
        title="Colleges" 
        subtitle="Manage registered colleges, access credentials, and institutional domains across the portal."
      />

<CollegeTable
  colleges={colleges}
  onDelete={(id) => {
    setCollegeToDeactivate(id);
    setShowDeactivateModal(true);
  }}
/>



      {/* Deactivate College Modal */}
{showDeactivateModal && (
  <AnimatePresence>
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={() => {
        setShowDeactivateModal(false);
        setCollegeToDeactivate(null);
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Top strip */}
        <div className="h-[3px] w-full bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600" />

        <div className="p-6">

          {/* Icon */}
          <div className="flex items-center justify-center mb-5">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <AlertTriangle size={20} strokeWidth={1.6} className="text-orange-400" />
            </div>
          </div>

          {/* Text */}
          <div className="text-center mb-6">
            <h2 className="text-[16px] font-semibold text-neutral-100 tracking-tight mb-2">
              Deactivate College
            </h2>
            <p className="text-[13px] text-neutral-500 leading-relaxed tracking-wide">
              Are you sure you want to deactivate this college?
              The college can be reactivated later if required.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setShowDeactivateModal(false);
                setCollegeToDeactivate(null);
              }}
              className="flex-1 py-2.5 rounded-xl border border-neutral-700 hover:border-neutral-600 text-neutral-400 hover:text-neutral-200 transition-all duration-200 text-[11px] font-semibold uppercase tracking-widest cursor-pointer"
            >
              Cancel
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDeactivateCollege}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 hover:text-orange-300 border border-orange-500/20 hover:border-orange-500/40 transition-all duration-200 text-[11px] font-semibold uppercase tracking-widest cursor-pointer"
            >
              <AlertTriangle size={13} strokeWidth={2} />
              Deactivate
            </motion.button>
          </div>

        </div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
)}
    </div>
  );
}

export default Colleges;