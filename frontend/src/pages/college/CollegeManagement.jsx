import { useEffect, useState } from "react";
import CollegeTable from "../../components/colleges/CollegeTable";
import PageHeader from "../../components/common/PageHeader";
import {
  getColleges,
  deleteCollege,
} from "../../services/collegeService";

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
    <div className="space-y-6">
      <PageHeader title="Colleges" />

<CollegeTable
  colleges={colleges}
  onDelete={(id) => {
    setCollegeToDeactivate(id);
    setShowDeactivateModal(true);
  }}
/>



      {/* Deactivate College Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-orange-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Deactivate College
              </h2>

              <p className="text-gray-500 mb-6">
                Are you sure you want to deactivate this college?
                <br />
                The college can be reactivated later if required.
              </p>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => {
                    setShowDeactivateModal(false);
                    setCollegeToDeactivate(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all font-medium"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDeactivateCollege}
                  className="flex-1 py-2.5 rounded-xl bg-orange-600 text-white hover:bg-orange-700 transition-all font-medium"
                >
                  Deactivate
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