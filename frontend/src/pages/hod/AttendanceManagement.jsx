import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Save, Loader2, AlertCircle, RefreshCw, CheckCircle2 } from "lucide-react";

import attendanceService from "../../services/attendanceService";
import { getStudents } from "../../services/studentService";
import PageHeader from "../../components/common/PageHeader";

import AttendanceForm from "../../components/attendance/AttendanceForm";
import AttendanceTable from "../../components/attendance/AttendanceTable";
import { GraduationCap, BookOpen, Users, Info } from "lucide-react";
import { LoadingTable, LoadingSpinner, LoadingButton } from "../../components/common/loading";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.04 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};


export default function AttendanceManagement() {
  // Data state
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});

  // Filter state
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  // UI state
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Load subjects on mount
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await attendanceService.getSubjects();
        if (!cancelled) setSubjects(data);
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load subjects:", err);
          toast.error("Failed to load subjects.");
        }
      } finally {
        if (!cancelled) setLoadingSubjects(false);
      }
    };
    const timer = setTimeout(() => {
      load();
    }, 0);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  // Load students when semester/subject changes
  useEffect(() => {
    if (!selectedSemester || !selectedSubject) {
      const timer = setTimeout(() => {
        setStudents([]);
      }, 0);
      return () => clearTimeout(timer);
    }
    let cancelled = false;

    const load = async () => {
      try {
        const studentList = await getStudents();
        const list = studentList?.results ?? (Array.isArray(studentList) ? studentList : []);
        
        const classStudents = list.filter((s) => String(s.semester) === String(selectedSemester));
        if (!cancelled) setStudents(classStudents);
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load students:", err);
          setError("Failed to load students. Please try again.");
          toast.error("Failed to load students.");
        }
      } finally {
        if (!cancelled) setLoadingStudents(false);
      }
    };

    const timer = setTimeout(() => {
      setLoadingStudents(true);
      setError("");
      load();
    }, 0);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [selectedSemester, selectedSubject]);

  // Load attendance when subject/date changes
  useEffect(() => {
    if (!selectedSubject || !selectedDate) {
      const timer = setTimeout(() => {
        setAttendanceRecords([]);
      }, 0);
      return () => clearTimeout(timer);
    }
    let cancelled = false;

    const load = async () => {
      try {
        const savedAttendance = await attendanceService.getClassAttendance(Number(selectedSubject), selectedDate);
        if (!cancelled) setAttendanceRecords(savedAttendance);
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load attendance:", err);
          toast.error("Failed to load attendance.");
        }
      } finally {
        if (!cancelled) setLoadingAttendance(false);
      }
    };

    const timer = setTimeout(() => {
      setLoadingAttendance(true);
      load();
    }, 0);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [selectedSubject, selectedDate]);

  // Sync attendance map when students or records change
  useEffect(() => {
    const newMap = {};
    students.forEach((s) => {
      newMap[String(s.id)] = { status: "PRESENT" };
    });
    attendanceRecords.forEach((a) => {
      newMap[String(a.student)] = { status: a.status };
    });
    const timer = setTimeout(() => {
      setAttendanceMap(newMap);
    }, 0);
    return () => clearTimeout(timer);
  }, [students, attendanceRecords]);

  // Counts
  const presentCount = useMemo(
    () => Object.values(attendanceMap).filter((a) => a.status === "PRESENT").length,
    [attendanceMap]
  );
  const absentCount = useMemo(
    () => Object.values(attendanceMap).filter((a) => a.status === "ABSENT").length,
    [attendanceMap]
  );
  const leaveCount = useMemo(
    () => Object.values(attendanceMap).filter((a) => a.status === "LEAVE").length,
    [attendanceMap]
  );

  // Handlers
  const handleAttendanceChange = useCallback((studentId, status) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: { status },
    }));
  }, []);

  const handleMarkAllPresent = () => {
    setAttendanceMap((prev) => {
      const newMap = { ...prev };
      Object.keys(newMap).forEach((key) => {
        newMap[key] = { status: "PRESENT" };
      });
      return newMap;
    });
  };

  const handleSaveAttendance = async () => {
    if (!selectedSubject || !selectedDate || students.length === 0) return;

    const attendanceArray = Object.entries(attendanceMap).map(([studentId, a]) => ({
      student: Number(studentId),
      status: a.status,
    }));

    setSaving(true);
    try {
      await attendanceService.saveBulkAttendance({
        subject: Number(selectedSubject),
        date: selectedDate,
        attendance: attendanceArray,
      });

      toast.success("Attendance saved successfully.");
    } catch (err) {
      console.error("Failed to save attendance:", err);
      toast.error(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Failed to save attendance. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="space-y-8 max-w-7xl mx-auto py-8 px-4 md:px-8"
    >
      <PageHeader
        title="Attendance Management"
        subtitle="Manage and track daily student attendance."
        actions={
          selectedSubject && selectedDate && students.length > 0 ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2">
                {presentCount > 0 && (
                  <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-lg">
                    {presentCount} Present
                  </span>
                )}
                {absentCount > 0 && (
                  <span className="text-[10px] font-semibold text-red-300 bg-red-500/10 border border-red-500/25 px-2.5 py-1 rounded-lg">
                    {absentCount} Absent
                  </span>
                )}
                {leaveCount > 0 && (
                  <span className="text-[10px] font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/25 px-2.5 py-1 rounded-lg">
                    {leaveCount} Leave
                  </span>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleMarkAllPresent}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg transition-colors text-xs font-semibold tracking-wide border border-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <CheckCircle2 size={14} strokeWidth={2} />
                Mark All Present
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleSaveAttendance}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors text-xs font-semibold tracking-wide shadow-[0_4px_12px_rgba(99,102,241,0.25)] hover:shadow-[0_4px_16px_rgba(99,102,241,0.35)] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <LoadingSpinner size={14} color="border-t-white border-white/30" />
                ) : (
                  <Save size={14} strokeWidth={2} />
                )}
                Save Attendance
              </motion.button>
            </div>
          ) : null
        }
      />

      <AttendanceForm
        subjects={subjects}
        selectedSemester={selectedSemester}
        setSelectedSemester={setSelectedSemester}
        selectedSubject={selectedSubject}
        setSelectedSubject={setSelectedSubject}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        loadingSubjects={loadingSubjects}
      />

      {/* Empty States */}
      {!selectedSemester && !loadingStudents && (
        <motion.div variants={fadeUp} className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-5">
            <GraduationCap size={24} className="text-neutral-600" />
          </div>
          <p className="text-sm text-neutral-400">Select a semester to begin.</p>
        </motion.div>
      )}

      {selectedSemester && !selectedSubject && !loadingStudents && (
        <motion.div variants={fadeUp} className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-5">
            <BookOpen size={24} className="text-neutral-600" />
          </div>
          <p className="text-sm text-neutral-400">Select a subject.</p>
        </motion.div>
      )}

      {selectedSemester && selectedSubject && !loadingStudents && !error && students.length === 0 && (
        <motion.div variants={fadeUp} className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-5">
            <Users size={24} className="text-neutral-600" />
          </div>
          <p className="text-sm text-neutral-400">No students are enrolled for this semester.</p>
        </motion.div>
      )}

      {/* Loading Skeleton */}
      {(loadingStudents || loadingAttendance) && <LoadingTable rows={5} columns={4} />}

      {/* Error State */}
      {error && !loadingStudents && (
        <motion.div
          variants={fadeUp}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
            <AlertCircle size={22} className="text-red-400" />
          </div>
          <p className="text-sm text-red-400 mb-4">{error}</p>
          <button
            onClick={() => {
              setError("");
              setSelectedSubject(selectedSubject);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs font-semibold transition-colors border border-neutral-700"
          >
            <RefreshCw size={12} />
            Retry
          </button>
        </motion.div>
      )}

      {/* Data Table */}
      {selectedSemester && selectedSubject && selectedDate && !loadingStudents && !loadingAttendance && !error && students.length > 0 && (
        <>
          {attendanceRecords.length === 0 && (
            <motion.div variants={fadeUp} className="bg-neutral-900/60 border border-neutral-800/60 rounded-xl p-4 flex gap-3 items-center shadow-sm">
              <div className="text-neutral-400">
                <Info size={18} />
              </div>
              <p className="text-sm text-neutral-300">
                No attendance has been marked for this date yet.
              </p>
            </motion.div>
          )}

          <AttendanceTable
            students={students}
            attendanceMap={attendanceMap}
            onAttendanceChange={handleAttendanceChange}
          />

          {/* Mobile Action Buttons */}
          <div className="md:hidden flex gap-3 sticky bottom-4 pt-4">
            <button
              onClick={handleMarkAllPresent}
              disabled={saving}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl transition-colors text-xs font-semibold tracking-wide border border-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
            >
              <CheckCircle2 size={14} />
              All Present
            </button>
            <LoadingButton
              onClick={handleSaveAttendance}
              loading={saving}
              spinnerSize={14}
              icon={<Save size={14} />}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors text-xs font-semibold tracking-wide shadow-[0_4px_12px_rgba(99,102,241,0.25)] hover:shadow-[0_4px_16px_rgba(99,102,241,0.35)] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Save
            </LoadingButton>
          </div>
        </>
      )}
    </motion.div>
  );
}
