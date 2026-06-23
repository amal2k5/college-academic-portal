import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StudentTable from "../../components/students/StudentTable";
import StudentSearch from "../../components/students/StudentSearch";
import StudentFilters from "../../components/students/StudentFilters";
import { getStudents, deleteStudent } from "../../services/studentService";
import { Plus } from "lucide-react";

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await getStudents();
      setStudents(data || []);
      setError("");
    } catch (err) {
      console.error("Failed to fetch students:", err);
      setError("Could not load student data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  const filteredStudents = students.filter((student) => {
    const matchesSearch = `
    ${student.first_name}
    ${student.last_name}
    ${student.email}
    ${student.roll_number}
    ${student.admission_number}
  `
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesSemester =
      !semesterFilter || String(student.semester) === semesterFilter;

    const matchesGender = !genderFilter || student.gender === genderFilter;

    return matchesSearch && matchesSemester && matchesGender;
  });

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?",
    );

    if (!confirmed) return;

    await deleteStudent(id);

    setStudents(students.filter((student) => student.id !== id));
  };
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 antialiased text-gray-900 font-sans">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            Student Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage student registrations, academic rosters, and profile
            tracking.
          </p>
        </div>

        <Link
          to="/hod/students/create"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          Add Student
        </Link>
      </div>

      {/* Filter and Search Action Ribbon Bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="w-full lg:w-auto">
          <StudentSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>
        <div className="w-full lg:w-auto border-t lg:border-t-0 pt-3 lg:pt-0 border-gray-100">
          <StudentFilters
            semesterFilter={semesterFilter}
            setSemesterFilter={setSemesterFilter}
            genderFilter={genderFilter}
            setGenderFilter={setGenderFilter}
          />
        </div>
      </div>

      {/* Loading Canvas */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 bg-white border border-gray-100 rounded-xl shadow-sm">
          <div className="animate-spin rounded-full h-9 w-9 border-2 border-gray-200 border-b-indigo-600"></div>
          <p className="text-xs font-medium text-gray-400 mt-3 tracking-wider uppercase">
            Loading rosters...
          </p>
        </div>
      )}

      {/* Error Panel Container */}
      {!loading && error && (
        <div className="p-4 bg-red-50 border border-red-200 text-sm text-red-700 font-medium rounded-xl shadow-sm flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Student Data Table */}
      {!loading && !error && (
        <div className="transition-opacity duration-200">
          <StudentTable students={filteredStudents} onDelete={handleDelete} />
        </div>
      )}
    </div>
  );
}

export default Students;
