import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react";

import StudentForm from "../../components/students/StudentForm";
import { getStudentById } from "../../services/studentService";

function StudentEdit() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    roll_number: "",
    admission_number: "",
  });

  useEffect(() => {
    loadStudent();
  }, [id]); 

  const loadStudent = async () => {
    try {
      setLoading(true);
      setError("");
      const student = await getStudentById(id);

      if (student) {
        setFormData(student);
      } else {
        setError("The requested student record could not be found.");
      }
    } catch (err) {
      console.error("Failed to load student data:", err);
      setError("An error occurred while fetching the profile record.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Student", formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8 antialiased text-gray-900 font-sans">
      
      {/* Structural Navigation & Contextual Section Heading */}
      <div className="mb-8">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors duration-150 mb-3 group cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Students</span>
        </button>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
          Modify Student Profile
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Update the institutional registration indexes and metadata for Record ID: <span className="font-mono bg-gray-100 px-1 py-0.5 rounded text-xs text-gray-700">{id}</span>
        </p>
      </div>

      {/* Async Loading Interface */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm">
          <RefreshCw className="animate-spin h-6 w-6 text-indigo-600" />
          <p className="text-xs font-semibold text-slate-400 mt-3 tracking-wider uppercase">Retrieving file data...</p>
        </div>
      )}

      {/* Async Error Alert Block */}
      {!loading && error && (
        <div className="p-4 bg-red-50 border border-red-200 text-sm text-red-700 font-medium rounded-xl shadow-sm flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form Render Canvas */}
      {!loading && !error && (
        <div className="transition-opacity duration-200">
          <StudentForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            submitLabel="Update Student"
          />
        </div>
      )}

    </div>
  );
}

export default StudentEdit;