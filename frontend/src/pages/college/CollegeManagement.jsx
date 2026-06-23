import { useEffect, useState } from "react";
import CollegeTable from "../../components/colleges/CollegeTable";
import PageHeader from "../../components/common/PageHeader";
import {
  getColleges,
  createCollege,
  updateCollege,
  deleteCollege,
} from "../../services/collegeService";
import CollegeAdminForm from "../../components/collegeAdmins/CollegeAdminForm";


function Colleges() {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
const [collegeToDelete, setCollegeToDelete] = useState(null);
  

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      setLoading(true);

      const data = await getColleges();

      setColleges(data);
    } catch (error) {
      console.error(error);
      setError("Failed to load colleges");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCollege = async (formData) => {
    try {
      await createCollege(formData);

      await fetchColleges();

      setSelectedCollege(null);
      setShowForm(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateCollege = async (formData) => {
    try {
      await updateCollege(selectedCollege.id, formData);

      await fetchColleges();

      setSelectedCollege(null);
      setShowForm(false);
    } catch (error) {
      console.error(error);
    }
  };

const handleDeleteCollege = async () => {
  try {
    await deleteCollege(collegeToDelete);

    await fetchColleges();

    setShowDeleteModal(false);
    setCollegeToDelete(null);
  } catch (error) {
    console.error(error);
  }
};

  if (loading) {
    return <div>Loading colleges...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <PageHeader
        title="Colleges"
        buttonText="Add College"
        onButtonClick={() => setShowForm(true)}
      />

      <CollegeTable
        colleges={colleges}
        onEdit={(college) => {
          setSelectedCollege(college);
          setShowForm(true);
        }}
        onDelete={(id) => {
  setCollegeToDelete(id);
  setShowDeleteModal(true);
}}
      />

      {showForm && (
        <CollegeAdminForm
          initialData={selectedCollege}
          onSubmit={selectedCollege ? handleUpdateCollege : handleCreateCollege}
          onClose={() => {
            setShowForm(false);
            setSelectedCollege(null);
          }}
        />
      )}

      {showDeleteModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 animate-in fade-in zoom-in duration-200">
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7L5 7M10 11V17M14 11V17M6 7L7 19C7.1 20 7.9 21 9 21H15C16.1 21 16.9 20 17 19L18 7M9 7V5C9 3.9 9.9 3 11 3H13C14.1 3 15 3.9 15 5V7"
            />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Delete College
        </h2>

        <p className="text-gray-500 mb-6">
          Are you sure you want to delete this college?
          <br />
          This action cannot be undone.
        </p>

        <div className="flex gap-3 w-full">
          <button
            onClick={() => {
              setShowDeleteModal(false);
              setCollegeToDelete(null);
            }}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>

          <button
            onClick={handleDeleteCollege}
            className="flex-1 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all"
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

export default Colleges;
