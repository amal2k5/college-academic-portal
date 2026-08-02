import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import AssignmentList from "../../components/assignments/AssignmentList";
import AssignmentForm from "../../components/assignments/AssignmentForm";
import ConfirmModal from "../../components/common/ConfirmModal";
import AssignmentDetailModal from "../../components/assignments/AssignmentDetailModal";
import assignmentService from "../../services/assignmentService";
import PageHeader from "../../components/common/PageHeader";
import { LoadingSkeleton } from "../../components/common/loading";

const pageVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function AssignmentManagementPage() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  // Detail Modal State
  const [selectedViewAssignment, setSelectedViewAssignment] = useState(null);

  // Normalize API response to match frontend expectations
  const normalizeAssignment = (a) => ({
    ...a,
    created_by:
      typeof a.created_by === "object"
        ? a.created_by.name ||
          a.created_by.username ||
          `${a.created_by.first_name || ""} ${a.created_by.last_name || ""}`.trim()
        : a.created_by,
    attachment_url: a.attachment_url || a.attachment || null,
    subject:
      typeof a.subject === "object"
        ? a.subject.name || a.subject.title
        : a.subject || "Unknown Subject",
    title: a.title || "Untitled Assignment",
  });

  const loadAssignments = async () => {
    setLoading(true);
    try {
      const data = await assignmentService.getAssignments();
      const normalizedData = Array.isArray(data)
        ? data.map(normalizeAssignment)
        : [];
      setAssignments(normalizedData);
    } catch (error) {
      console.error("Failed to load assignments:", error);
      toast.error("Failed to load assignments. Please refresh the page.");
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  // Form Handlers
  const handleOpenForm = (assignment = null) => {
    setSelectedAssignment(assignment);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setSelectedAssignment(null);
    setShowForm(false);
  };

  const handleSubmit = async (data) => {
    setSubmitting(true);

    try {
      if (selectedAssignment) {
        await assignmentService.updateAssignment(selectedAssignment.id, data);
        toast.success("Assignment updated successfully.");
      } else {
        await assignmentService.createAssignment(data);
        toast.success("Assignment created successfully.");
      }

      await loadAssignments();
      handleCloseForm();
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          "Failed to save assignment. Please check the form and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Handler with confirmation
const handleDelete = (assignment) => {
  setDeleteTarget(assignment);
};
  // View Handler
  const handleViewAssignment = (assignment) => {
    setSelectedViewAssignment(assignment);
  };


  const confirmDelete = async () => {
  if (!deleteTarget) return;

  setIsDeleting(true);

  try {
    await assignmentService.deleteAssignment(deleteTarget.id);

    toast.success("Assignment deleted successfully.");

    await loadAssignments();

    setDeleteTarget(null);
  } catch (error) {
    toast.error(
      error.response?.data?.detail ||
      error.response?.data?.message ||
      "Failed to delete assignment."
    );
  } finally {
    setIsDeleting(false);
  }
};

  if (loading) {
    return (
      <div className="space-y-6 text-neutral-400">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <h1 className="text-2xl font-semibold text-white">
              Assignment Management
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Create, manage and distribute assignments for students.
            </p>
          </div>
          <LoadingSkeleton width="w-40" height="h-10" rounded="rounded-xl" />
        </div>

        {/* Loading Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-[#0F172A] rounded-xl border border-white/[0.08] p-6 shadow-xl"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <LoadingSkeleton width="w-1/3" height="h-5" rounded="rounded-lg" />
                  <LoadingSkeleton width="w-2/3" height="h-4" rounded="rounded-lg" />
                  <div className="flex gap-4 mt-2">
                    <LoadingSkeleton width="w-20" height="h-3" rounded="rounded-lg" />
                    <LoadingSkeleton width="w-24" height="h-3" rounded="rounded-lg" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <LoadingSkeleton width="w-8" height="h-8" rounded="rounded-lg" />
                  <LoadingSkeleton width="w-8" height="h-8" rounded="rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-8 px-4 md:px-8">
      <PageHeader
        title="Assignment Management"
        subtitle="Create, manage and distribute assignments for students."
        buttonText="Create Assignment"
        onButtonClick={() => handleOpenForm()}
      />

      {/* Assignment List with handlers */}
      <AssignmentList
        assignments={assignments}
        onEdit={handleOpenForm}
        onDelete={handleDelete}
        onView={handleViewAssignment}
      />

      {/* Create/Edit Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={(e) => {
              if (submitting) return;

              if (e.target === e.currentTarget) {
                handleCloseForm();
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-3xl max-h-[85vh] flex flex-col rounded-3xl border border-neutral-800 bg-neutral-950 shadow-2xl overflow-hidden"
            >
              <div className="shrink-0 px-8 pt-8 pb-6 border-b border-neutral-800/50">
                <h2 className="text-xl font-semibold text-white">
                  {selectedAssignment ? "Edit Assignment" : "Create Assignment"}
                </h2>
                <p className="text-sm text-neutral-500 mt-1">
                  Fill in the assignment details below.
                </p>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar px-8 py-6">
                <AssignmentForm
                  initialData={selectedAssignment}
                  onCancel={handleCloseForm}
                  onSubmit={handleSubmit}
                  submitting={submitting}
                  loading={submitting}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Read-Only Detail Modal */}
      <AssignmentDetailModal
        assignment={selectedViewAssignment}
        onClose={() => setSelectedViewAssignment(null)}
      />

      <ConfirmModal
  open={!!deleteTarget}
  title="Delete Assignment"
  message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
  confirmText="Delete"
  cancelText="Cancel"
  loading={isDeleting}
  onConfirm={confirmDelete}
  onCancel={() => setDeleteTarget(null)}
/>
    </div>
  );
}

export default AssignmentManagementPage;
