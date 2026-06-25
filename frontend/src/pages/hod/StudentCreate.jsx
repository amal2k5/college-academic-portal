import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import StudentForm from "../../components/students/StudentForm";
import { createStudent } from "../../services/studentService";

function StudentCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  
  const [formData, setFormData] = useState({

    first_name: "",
    last_name: "",
    email: "",
    roll_number: "",
    admission_number: "",
    phone: "",
    date_of_birth: "",
    gender: "",
    parent_name: "",
    parent_phone: "",
    semester: "",
    academic_year: "",
   
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
     
      const payload = {
        ...formData,
        semester: parseInt(formData.semester),

      };
      
      console.log("Sending payload:", payload); 
      
      await createStudent(payload);
      navigate("/hod/students");
    } catch (err) {
      console.error("Error:", err.response?.data || err);
      setError(err.response?.data?.message || "Failed to create student");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8 antialiased text-gray-900 font-sans">
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
          Create Student Record
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Register a new student profile within the academic database ledger system.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm whitespace-pre-line">
          {typeof error === 'object' ? JSON.stringify(error, null, 2) : error}
        </div>
      )}

      <div className="bg-white rounded-xl">
        <StudentForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          submitLabel="Create Student"
          loading={loading}
          isEditMode={false}
        />
      </div>
    </div>
  );
}

export default StudentCreate;