// StudentCreate.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, AlertCircle, User, Mail, Phone, Calendar, Hash, BookOpen, Users, Shield } from "lucide-react";
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        semester: formData.semester ? parseInt(formData.semester) : "",
      };
      await createStudent(payload);
      navigate("/hod/students");
    } catch (err) {
      console.error("Error:", err.response?.data || err);
      setError(err.response?.data?.message || "Failed to create student");
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="min-h-screen bg-neutral-950 px-4 py-10 md:px-8 md:py-12"
    >
      <div className="max-w-7xl mx-auto">

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="mb-10"
        >
          <motion.button
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-300 transition-colors duration-150 mb-6 group"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Students</span>
          </motion.button>

          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
              Create Student Record
            </h1>
            <p className="text-sm text-neutral-500 mt-1.5">
              Register a new student profile within the academic management system
            </p>
          </div>
        </motion.div>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="mb-6 overflow-hidden"
            >
              <div className="p-4 bg-red-500/8 border border-red-500/20 rounded-xl flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-red-400 uppercase tracking-wider">Error</p>
                  <p className="text-sm text-red-300/80 mt-0.5">
                    {typeof error === 'object' ? error.message || JSON.stringify(error) : error}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }}
        >
          <StudentForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            submitLabel="Create Student"
            loading={loading}
            isEditMode={false}
          />
        </motion.div>

      </div>
    </motion.div>
  );
}

export default StudentCreate;
