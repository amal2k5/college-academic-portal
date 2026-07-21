import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import AssignmentList from "../../components/assignments/AssignmentList";
import AssignmentDetailModal from "../../components/assignments/AssignmentDetailModal";
import assignmentService from "../../services/assignmentService";
import PageHeader from "../../components/common/PageHeader";

const pageVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function AssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const loadAssignments = async () => {
    setLoading(true);
    try {
      const data = await assignmentService.getAssignments();
      setAssignments(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load assignments. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const handleView = (assignment) => {
    setSelectedAssignment(assignment);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedAssignment(null);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="max-w-7xl mx-auto py-8 px-4 md:px-8 min-h-screen text-neutral-400 space-y-8"
    >
      <PageHeader
        title="Assignments"
        subtitle="Track deadlines and download assignment files."
      />

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-neutral-800 border-t-neutral-400"></div>
        </div>
      ) : (
        <>
          <AssignmentList
            assignments={assignments}
            onView={handleView}
          />
          <AssignmentDetailModal
            assignment={selectedAssignment}
            isOpen={showDetailModal}
            onClose={handleCloseModal}
          />
        </>
      )}
    </motion.div>
  );
}

export default AssignmentsPage;