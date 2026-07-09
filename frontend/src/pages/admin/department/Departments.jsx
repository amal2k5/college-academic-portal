import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";
import { toast } from "react-toastify";
import DepartmentTable from "../../../components/departments/DepartmentTable";
import DepartmentForm from "../../../components/departments/DepartmentForm";
import PageHeader from "../../../components/common/PageHeader";
import {
  getMyDepartments,
  createDepartment,
  updateDepartment,
  updateDepartmentStatus,
  getDepartmentDetails,
} from "../../../services/departmentService";

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

 
  const [showForm, setShowForm] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [departmentToToggle, setDepartmentToToggle] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const data = await getMyDepartments();
      setDepartments(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDepartment = async (formData) => {
    try {
      await createDepartment(formData);
      await fetchDepartments();
      toast.success("Department created successfully");
      setShowForm(false);
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to create department",
      );
    }
  };

  const handleUpdateDepartment = async (formData) => {
    try {
      await updateDepartment(selectedDepartment.id, formData);
      await fetchDepartments();
      toast.success("Department updated successfully");
      setSelectedDepartment(null);
      setShowForm(false);
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to update department",
      );
    }
  };

  const handleToggleStatus = async () => {
    if (!departmentToToggle) return;

    try {
      const response = await updateDepartmentStatus(
        departmentToToggle.id,
        !departmentToToggle.is_active,
      );

      toast.success(response.message);
      await fetchDepartments();

      // Update view modal if open
      if (showViewModal && selectedDepartment?.id === departmentToToggle.id) {
        setSelectedDepartment((prev) => ({
          ...prev,
          is_active: !departmentToToggle.is_active,
        }));
      }

      setShowStatusModal(false);
      setDepartmentToToggle(null);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to update department status",
      );
    }
  };

  const handleViewDepartment = async (department) => {
    setSelectedDepartment({}); // Clear previous to show loader
    setViewLoading(true);
    setShowViewModal(true);

    try {
      const data = await getDepartmentDetails(department.id);
      setSelectedDepartment(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load department details");
      setShowViewModal(false);
    } finally {
      setViewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 rounded-full border-2 border-neutral-800 border-t-indigo-500"
        />
        <p className="text-xs text-neutral-500 uppercase tracking-widest">
          Loading Departments
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white py-8 px-4 md:px-8 space-y-8 max-w-7xl mx-auto">
      <PageHeader
        title="Departments"
        subtitle="Manage academic departments, courses, and configurations for your institution."
        buttonText="Add Department"
        onButtonClick={() => {
          setSelectedDepartment(null);
          setShowForm(true);
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <DepartmentTable
          departments={departments}
          onEdit={(department) => {
            setSelectedDepartment(department);
            setShowForm(true);
          }}
          onView={handleViewDepartment}
          onToggleStatus={(id, isActive) => {
            setDepartmentToToggle({ id, is_active: isActive });
            setShowStatusModal(true);
          }}
        />
      </motion.div>

      {/* Add/Edit Form Modal (Using Separate Component) */}
      <AnimatePresence>
        {showForm && (
          <DepartmentForm
            initialData={selectedDepartment}
            onSubmit={
              selectedDepartment
                ? handleUpdateDepartment
                : handleCreateDepartment
            }
            onClose={() => {
              setShowForm(false);
              setSelectedDepartment(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* View Details Modal */}
      <AnimatePresence>
        {showViewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={() => setShowViewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">
                  Department Details
                </h3>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-white"
                >
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
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-white/10 flex items-center justify-center text-lg font-bold text-white">
                        {selectedDepartment.name?.[0]}
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-white">
                          {selectedDepartment.name}
                        </h4>

                        <p className="text-sm text-gray-400">
                          {selectedDepartment.college_name}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-5 space-y-5">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="text-xs uppercase text-gray-500 mb-1">
                            Status
                          </p>

                          <span
                            className={`inline-flex rounded-md px-3 py-1 text-xs font-medium ${
                              selectedDepartment.is_active
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-red-500/10 text-red-400"
                            }`}
                          >
                            {selectedDepartment.is_active
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </div>

                        <div>
                          <p className="text-xs uppercase text-gray-500 mb-1">
                            Total Students
                          </p>

                          <p className="text-white font-medium">
                            {selectedDepartment.student_count}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="text-xs uppercase text-gray-500 mb-1">
                            Department HOD
                          </p>

                          <p className="text-white">
                            {selectedDepartment.hod_name || "Not Assigned"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs uppercase text-gray-500 mb-1">
                            HOD Email
                          </p>

                          <p className="text-gray-300 break-all">
                            {selectedDepartment.hod_email || "-"}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="text-xs uppercase text-gray-500 mb-1">
                            Created On
                          </p>

                          <p className="text-gray-300">
                            {new Date(
                              selectedDepartment.created_at,
                            ).toLocaleDateString()}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs uppercase text-gray-500 mb-1">
                            Last Updated
                          </p>

                          <p className="text-gray-300">
                            {new Date(
                              selectedDepartment.updated_at,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {!viewLoading && (
                <div className="p-4 border-t border-white/5 bg-white/5">
                  <button
                    onClick={() => setShowViewModal(false)}
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
        {showStatusModal && departmentToToggle && (
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
                <div
                  className={`p-2 rounded-full ${departmentToToggle.is_active ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-400"}`}
                >
                  <AlertCircle className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  {departmentToToggle.is_active
                    ? "Deactivate Department?"
                    : "Activate Department?"}
                </h3>
              </div>

              <p className="text-sm text-gray-400 mb-6">
                {departmentToToggle.is_active
                  ? "This department will become inactive and unavailable for future operations."
                  : "This department will become active and available again."}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="flex-1 py-2.5 rounded-lg border border-white/10 text-gray-300 hover:bg-white/5 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleToggleStatus}
                  className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
                    departmentToToggle.is_active
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white"
                  }`}
                >
                  {departmentToToggle.is_active ? "Deactivate" : "Activate"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Departments;