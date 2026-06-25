import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import StudentForm from "../../components/students/StudentForm";
import { getStudentById, updateStudent } from "../../services/studentService";

function StudentEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    roll_number: "",
    admission_number: "",
    date_of_birth: "",
    gender: "",
    parent_name: "",
    parent_phone: "",
    semester: "",
    academic_year: "",
  });

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const data = await getStudentById(id);
        setFormData({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          phone: data.phone || "",
          roll_number: data.roll_number || "",
          admission_number: data.admission_number || "",
          date_of_birth: data.date_of_birth || "",
          gender: data.gender || "",
          parent_name: data.parent_name || "",
          parent_phone: data.parent_phone || "",
          semester: data.semester || "",
          academic_year: data.academic_year || "",
        });
        setError(null);
      } catch (err) {
        setError("Failed to load student data");
      } finally {
        setFetchLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

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
      
      await updateStudent(id, payload);
      navigate("/hod/students");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update student");
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 bg-neutral-950 rounded-3xl border border-neutral-900 max-w-4xl mx-auto relative overflow-hidden">
        {/* Smooth silver loader shimmer backdrop */}
        <div className="absolute w-80 h-80 bg-white/5 rounded-full blur-[130px] pointer-events-none" />
        <div className="h-6 w-6 animate-spin rounded-full border border-neutral-900 border-b-neutral-400 relative z-10" />
        <p className="text-[10px] font-medium text-neutral-500 mt-4 tracking-widest uppercase relative z-10">
          Loading Student Records...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 antialiased text-neutral-400 font-sans min-h-screen relative">
      
      {/* ── HIGH-END SILVER SHINING LIQUID GLOW FIELDS ── */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.04),transparent_35%)] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_75%,rgba(200,200,200,0.03),transparent_40%)] pointer-events-none z-0" />

      <div className="relative z-10 space-y-8">
        
        {/* Navigation Breadcrumbs & Dynamic Header Info */}
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
            Edit Student Record
          </h1>
          <p className="text-xs text-neutral-500 tracking-wide font-normal mt-1 flex flex-wrap items-center gap-2">

          </p>
        </div>

        {/* High-Visibility Clean Error Panel container */}
        {error && (
          <div className="p-4 bg-rose-950/10 border border-rose-900/30 text-rose-400 rounded-2xl text-xs font-medium tracking-wide uppercase shadow-sm">
            {typeof error === 'object' ? JSON.stringify(error, null, 2) : error}
          </div>
        )}

        {/* Transparent Mount for Premium StudentForm */}
        <div className="bg-transparent rounded-3xl">
          <StudentForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            submitLabel="Update Student"
            loading={loading}
            isEditMode={true}
          />
        </div>

      </div>
    </div>
  );
}

export default StudentEdit;