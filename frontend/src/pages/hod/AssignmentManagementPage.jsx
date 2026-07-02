import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import AssignmentList from "../../components/assignments/AssignmentList";
import AssignmentForm from "../../components/assignments/AssignmentForm";
import { mockAssignments } from "../../mocks/assignments";



const pageVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

function AssignmentManagementPage() {
  const [assignments, setAssignments] = useState(mockAssignments);
  const [showForm, setShowForm] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const handleOpenForm = (assignment = null) => {
    setSelectedAssignment(assignment);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setSelectedAssignment(null);
    setShowForm(false);
  };

  const handleSubmit = (data) => {
    if (selectedAssignment) {
      // EDIT
      setAssignments((prev) =>
        prev.map((a) =>
          a.id === selectedAssignment.id ? { ...a, ...data } : a
        )
      );
    } else {
      // CREATE
      const newAssignment = {
        id: Date.now(),
        ...data,
        created_by: "Dr. Rajesh Kumar (HOD)",
        created_at: new Date().toISOString(),
      };
      setAssignments((prev) => [newAssignment, ...prev]);
    }
    handleCloseForm();
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="max-w-7xl mx-auto p-4 md:p-8 min-h-screen relative text-neutral-400"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.04),transparent_35%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_75%,rgba(200,200,200,0.03),transparent_40%)] pointer-events-none" />

      <div className="relative z-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-800/40 pb-6">
          <div>
            <h1 className="text-2xl font-semibold text-white">
              Assignment Management
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Create, manage and distribute assignments for students.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleOpenForm()}
            className="inline-flex items-center gap-2 bg-white text-black px-5 py-3 rounded-xl text-sm font-medium hover:bg-neutral-200 transition shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]"
          >
            <Plus size={16} />
            Create Assignment
          </button>
        </div>

        <AssignmentList
          assignments={assignments}
          onEdit={handleOpenForm}
          onDelete={(id) =>
            setAssignments((prev) => prev.filter((a) => a.id !== id))
          }
        />
      </div>

      {/* Modal with Fixed Scrollable Body */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={(e) => e.target === e.currentTarget && handleCloseForm()}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-3xl max-h-[85vh] flex flex-col rounded-3xl border border-neutral-800 bg-neutral-950 shadow-2xl overflow-hidden"
            >
              {/* Sticky Header */}
              <div className="shrink-0 px-8 pt-8 pb-6 border-b border-neutral-800/50">
                <h2 className="text-xl font-semibold text-white">
                  {selectedAssignment ? "Edit Assignment" : "Create Assignment"}
                </h2>
                <p className="text-sm text-neutral-500 mt-1">
                  Fill in the assignment details below.
                </p>
              </div>

              {/* SCROLLABLE BODY - This is where the fix lives */}
              <div className="flex-1 overflow-y-auto custom-scrollbar px-8 py-6">
                <AssignmentForm
                  initialData={selectedAssignment}
                  onCancel={handleCloseForm}
                  onSubmit={handleSubmit}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default AssignmentManagementPage;