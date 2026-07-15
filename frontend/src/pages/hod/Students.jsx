import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import StudentTable from "../../components/students/StudentTable";
import StudentSearch from "../../components/students/StudentSearch";
import StudentFilters from "../../components/students/StudentFilters";
import { getStudents, deleteStudent } from "../../services/studentService";
import PageHeader from "../../components/common/PageHeader";
import ConfirmModal from "../../components/common/ConfirmModal";

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const navigate = useNavigate();

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
      toast.error("Failed to load students.");
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

  // Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      await deleteStudent(deleteTarget);
      setStudents(students.filter((student) => student.id !== deleteTarget));
      toast.success("Student deleted successfully.");
    } catch (error) {
      console.error("Failed to delete student:", error);
      toast.error("Failed to delete student. Please try again.");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleDelete = async (id) => {
    setDeleteTarget(id);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 antialiased text-neutral-400 font-sans min-h-screen space-y-8">
      {/* Header Area */}
      <PageHeader
        title="Student Management"
        subtitle="Manage student registrations, academic rosters, and profile tracking variables."
        buttonText="Add Student"
        onButtonClick={() => navigate("/hod/students/create")}
      />

      {/* Filter and Search Action Ribbon Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <StudentSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <StudentFilters
          semesterFilter={semesterFilter}
          setSemesterFilter={setSemesterFilter}
          genderFilter={genderFilter}
          setGenderFilter={setGenderFilter}
        />
      </div>

      {/* Loading Canvas */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 bg-neutral-900 border border-neutral-800 rounded-xl">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-neutral-850 border-t-neutral-400"></div>
          <p className="text-[10px] font-semibold text-neutral-500 mt-4 tracking-widest uppercase">
            Loading Student Information...
          </p>
        </div>
      )}

      {/* Error Panel Container */}
      {!loading && error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-xs font-semibold uppercase tracking-wider text-red-400 rounded-xl flex items-center gap-3">
          <div className="h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Student Data Table */}
      {!loading && !error && (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden">
          <StudentTable students={filteredStudents} onDelete={handleDelete} />
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Student"
        message="Are you sure you want to delete this student? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        loading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default Students;

