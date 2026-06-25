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
        // ✅ Only editable fields are sent
        // ❌ first_name, last_name, roll_number, admission_number are NOT sent
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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

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
          Edit Student Record
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Update student profile information in the academic database.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {typeof error === 'object' ? JSON.stringify(error, null, 2) : error}
        </div>
      )}

      <div className="bg-white rounded-xl">
        <StudentForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          submitLabel="Update Student"
          loading={loading}
          isEditMode={true}  // ✅ Pass isEditMode prop
        />
      </div>
    </div>
  );
}

export default StudentEdit;