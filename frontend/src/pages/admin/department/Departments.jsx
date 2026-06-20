import { useEffect, useState } from "react";
import DepartmentTable from "../../../components/departments/DepartmentTable";
import DepartmentForm from "../../../components/departments/DepartmentForm";
import PageHeader from "../../../components/common/PageHeader";

import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../../services/departmentService";

function Departments() {
  const [departments, setDepartments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);

      const data = await getDepartments();

      setDepartments(data);
    } catch (error) {
      console.error(error);
      setError("Failed to load departments");
    } finally {
      setLoading(false);
    }
  };



  const handleCreateDepartment = async (formData) => {
    try {
      await createDepartment(formData);

      await fetchDepartments();

      setShowForm(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateDepartment = async (formData) => {
    try {
      await updateDepartment(
        selectedDepartment.id,
        formData
      );

      await fetchDepartments();

      setSelectedDepartment(null);
      setShowForm(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteDepartment = async () => {
    try {
      await deleteDepartment(departmentToDelete);

      await fetchDepartments();

      setDepartmentToDelete(null);
      setShowDeleteModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        Loading departments...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 py-10">
        {error}
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Departments"
        buttonText="Add Department"
        onButtonClick={() => {
          setSelectedDepartment(null);
          setShowForm(true);
        }}
      />

      <DepartmentTable
        departments={departments}
        onEdit={(department) => {
          setSelectedDepartment(department);
          setShowForm(true);
        }}
        onDelete={(id) => {
          setDepartmentToDelete(id);
          setShowDeleteModal(true);
        }}
      />

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

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <span className="text-3xl">🗑️</span>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Delete Department
              </h2>

              <p className="text-gray-500 mb-6">
                Are you sure you want to delete this
                department?
                <br />
                This action cannot be undone.
              </p>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDepartmentToDelete(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDeleteDepartment}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Departments;