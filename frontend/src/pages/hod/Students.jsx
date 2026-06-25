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
    <div className="max-w-7xl mx-auto p-4 md:p-8 antialiased text-neutral-400 font-sans min-h-screen relative">
      
      {/* ── HIGH-END SILVER SHINING LIQUID GLOW FIELDS ── */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.04),transparent_35%)] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_75%,rgba(200,200,200,0.03),transparent_40%)] pointer-events-none z-0" />

      <div className="relative z-10 space-y-8">
        
        {/* Header Area */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-800/40 pb-6">
          <div className="space-y-1">
            <h1 className="text-xl md:text-2xl font-medium text-neutral-100 tracking-tight">
              Student Management
            </h1>
            <p className="text-xs text-neutral-500 tracking-wide font-normal">
              Manage student registrations, academic rosters, and profile tracking variables.
            </p>
          </div>

          <Link
            to="/hod/students/create"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-neutral-200 active:bg-neutral-300 text-black text-xs font-medium uppercase tracking-widest px-5 py-3 transition duration-150 cursor-pointer group whitespace-nowrap self-start sm:self-auto shadow-md"
          >
            <Plus size={14} strokeWidth={1.5} className="text-black" />
            <span>Add New Student</span>
          </Link>
        </div>

        {/* Filter and Search Action Ribbon Bar */}
        <div className="bg-neutral-900/30 border border-neutral-800/40 rounded-[32px] p-4 shadow-[0_4px_30px_rgba(0,0,0,0.3)] flex flex-col lg:flex-row lg:items-center justify-between gap-4 backdrop-blur-md">
          <div className="w-full lg:w-auto">
            <StudentSearch
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>
          <div className="w-full lg:w-auto border-t lg:border-t-0 pt-3 lg:pt-0 border-neutral-800/40">
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
          <div className="flex flex-col items-center justify-center py-28 bg-neutral-900/10 border border-neutral-800/40 rounded-3xl relative overflow-hidden backdrop-blur-md">
            <div className="absolute w-64 h-64 bg-white/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="animate-spin rounded-full h-7 w-7 border border-neutral-800 border-b-neutral-400 relative z-10"></div>
            <p className="text-[9px] font-medium text-neutral-500 mt-4 tracking-widest uppercase relative z-10">
              Loading Student Information...
            </p>
          </div>
        )}

        {/* Error Panel Container */}
        {!loading && error && (
          <div className="p-4 bg-rose-950/10 border border-rose-900/30 text-xs font-medium tracking-wide uppercase text-rose-400 rounded-2xl flex items-center gap-3 shadow-sm">
            <div className="h-1 w-1 rounded-full bg-rose-500 animate-pulse shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Main Student Data Table */}
        {!loading && !error && (
          <div className="transition-all duration-300 rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <StudentTable students={filteredStudents} onDelete={handleDelete} />
          </div>
        )}

      </div>
    </div>
  );
}

export default Students;