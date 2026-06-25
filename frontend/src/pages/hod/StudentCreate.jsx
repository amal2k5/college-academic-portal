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
    <div className="max-w-4xl mx-auto p-4 md:p-8 antialiased text-neutral-400 font-sans min-h-screen relative">
      
      {/* ── HIGH-END SILVER SHINING LIQUID GLOW FIELDS ── */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.04),transparent_35%)] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_75%,rgba(200,200,200,0.03),transparent_40%)] pointer-events-none z-0" />

      <div className="relative z-10 space-y-8">
        
        {/* Navigation Breadcrumb & Header Title */}
        <div>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-neutral-500 hover:text-neutral-300 transition-colors duration-150 mb-4 group cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5 transform group-hover:-translate-x-0.5 transition-transform duration-150" />
            <span>Back to Students</span>
          </button>

          <h1 className="text-xl md:text-2xl font-medium text-neutral-100 tracking-tight">
            Create Student Record
          </h1>
          <p className="text-xs text-neutral-500 tracking-wide font-normal mt-1">
            Register a new student profile within the official academic management system.
          </p>
        </div>

        {/* High-Visibility Clean Error Panel */}
        {error && (
          <div className="p-4 bg-rose-950/10 border border-rose-900/30 text-rose-400 rounded-2xl text-xs font-medium tracking-wide uppercase shadow-sm">
            {typeof error === 'object' ? JSON.stringify(error, null, 2) : error}
          </div>
        )}

        {/* Transparent Canvas Mount for Child Form */}
        <div className="bg-transparent rounded-3xl">
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
    </div>
  );
}

export default StudentCreate;