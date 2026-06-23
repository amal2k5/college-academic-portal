import { useState } from "react";
import { ArrowLeft } from "lucide-react"; // Optional: standard back navigation icon indicator
import StudentForm from "../../components/students/StudentForm";

function StudentCreate() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    roll_number: "",
    admission_number: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8 antialiased text-gray-900 font-sans">
      
      {/* Upper Navigation Back-link & Header Section */}
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

      {/* Main Interactive Form Component */}
      <div className="bg-white rounded-xl">
        <StudentForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          submitLabel="Create Student"
        />
      </div>

    </div>
  );
}

export default StudentCreate;