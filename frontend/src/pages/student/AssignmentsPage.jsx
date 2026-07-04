import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AssignmentList from "../../components/assignments/AssignmentList";
import assignmentService from "../../services/assignmentService";

const pageVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function AssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAssignments = async () => {
    setLoading(true);

    try {
      const data = await assignmentService.getAssignments();
      setAssignments(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="max-w-7xl mx-auto p-4 md:p-8 min-h-screen relative text-neutral-400"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.04),transparent_35%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_75%,rgba(200,200,200,0.03),transparent_40%)] pointer-events-none" />

      <div className="relative z-10 space-y-8">
        <div className="border-b border-neutral-800/40 pb-6">
          <h1 className="text-2xl font-semibold text-white">
            Assignments
          </h1>

          <p className="text-sm text-neutral-500 mt-1">
            Track deadlines and download assignment files.
          </p>
        </div>

        {loading ? (
          <p className="text-neutral-500">Loading assignments...</p>
        ) : (
          <AssignmentList assignments={assignments} />
        )}
      </div>
    </motion.div>
  );
}

export default AssignmentsPage;