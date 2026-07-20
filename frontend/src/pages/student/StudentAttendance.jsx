import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  Calendar,
  AlertTriangle,
  RefreshCw,
  AlertCircle,
  Activity,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock
} from "lucide-react";

import attendanceService from "../../services/attendanceService";
import PageHeader from "../../components/common/PageHeader";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

function AttendanceSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse bg-neutral-900/50 rounded-2xl p-6 border border-neutral-800/50 h-32" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="animate-pulse bg-neutral-900/50 rounded-2xl p-6 border border-neutral-800/50 h-64" />
        ))}
      </div>
    </div>
  );
}

export default function StudentAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAttendance = async () => {
    try {
      const data = await attendanceService.getStudentAttendance();
      setAttendance(data);
      setError("");
    } catch (err) {
      console.error("Failed to load attendance:", err);
      setError("Failed to load your attendance. Please try again later.");
      toast.error("Failed to load attendance.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadAttendance();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Compute statistics with null-safe logic
  const stats = useMemo(() => {
    if (!attendance.length) return { overall: null, totalSubjects: 0, totalPresent: 0, totalClasses: 0, warnings: 0 };

    let totalPresent = 0;
    let totalClasses = 0;
    let warningCount = 0;

    attendance.forEach((item) => {
      const present = item.present_days || 0;
      const total = item.total_days || 0;

      totalPresent += present;
      totalClasses += total;

      // Only count as warning if classes have actually started
      if (total > 0) {
        const percentage = (present / total) * 100;
        if (percentage < 75) warningCount++;
      }
    });

    const overall = totalClasses > 0 ? ((totalPresent / totalClasses) * 100).toFixed(1) : null;

    return {
      overall,
      totalSubjects: attendance.length,
      totalPresent,
      totalClasses,
      warnings: warningCount,
    };
  }, [attendance]);

  const hasLowAttendance = stats.warnings > 0;

  const getAttendanceColorInfo = (percentage) => {
    if (percentage === null) {
      return {
        color: "text-neutral-300",
        bg: "bg-neutral-800/40",
        border: "border-neutral-700/40",
        bar: "bg-neutral-700",
        status: "No Data",
        icon: Calendar
      };
    }
    if (percentage > 85) return {
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      bar: "bg-emerald-500",
      status: "Excellent",
      icon: CheckCircle2
    };
    if (percentage >= 75) return {
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      bar: "bg-amber-500",
      status: "Good",
      icon: Clock
    };
    return {
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      bar: "bg-red-500",
      status: "Critical",
      icon: AlertTriangle
    };
  };

  const lowAttendanceSubjects = useMemo(() => {
    return attendance
      .filter((item) => {
        const total = item.total_days || 0;
        if (total === 0) return false;
        const percentage = ((item.present_days || 0) / total) * 100;
        return percentage < 75;
      })
      .map(item => item.subject?.name || item.subject_name || item.name || "Unknown Subject");
  }, [attendance]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="space-y-8 max-w-7xl mx-auto py-8 px-4 md:px-8"
    >
      <PageHeader
        title="My Attendance"
        subtitle="Track your subject-wise attendance and overall academic progress."
      />

      {loading && <AttendanceSkeleton />}

      {error && !loading && (
        <motion.div variants={fadeUp} className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
            <AlertCircle size={22} className="text-red-400" />
          </div>
          <p className="text-sm text-red-400 mb-4">{error}</p>
          <button onClick={() => { setLoading(true); setError(""); loadAttendance(); }} className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-semibold transition-colors border border-neutral-700">
            <RefreshCw size={12} /> Retry
          </button>
        </motion.div>
      )}

      {!loading && !error && attendance.length === 0 && (
        <motion.div variants={fadeUp} className="flex flex-col items-center justify-center py-20 bg-neutral-900/40 rounded-3xl border border-neutral-800/40 text-center">
          <div className="w-16 h-16 rounded-full bg-neutral-800/50 flex items-center justify-center mb-4">
            <Calendar size={24} className="text-neutral-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No Attendance Data</h3>
          <p className="text-sm text-neutral-400 max-w-sm">Your attendance has not been updated yet.</p>
        </motion.div>
      )}

      {!loading && !error && attendance.length > 0 && (
        <>
          {/* Summary Cards */}
          <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-neutral-900/60 border border-neutral-800/60 rounded-2xl p-5 flex items-center gap-4 shadow-lg">
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Activity size={20} />
              </div>
              <div>
                <p className="text-xs text-neutral-400 font-medium uppercase tracking-wide">Overall Attendance</p>
                <p className="text-2xl font-bold text-white">{stats.overall ?? "--"}{stats.overall && "%"}</p>
              </div>
            </div>

            <div className="bg-neutral-900/60 border border-neutral-800/60 rounded-2xl p-5 flex items-center gap-4 shadow-lg">
              <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
                <BookOpen size={20} />
              </div>
              <div>
                <p className="text-xs text-neutral-400 font-medium uppercase tracking-wide">Total Subjects</p>
                <p className="text-2xl font-bold text-white">{stats.totalSubjects}</p>
              </div>
            </div>

            <div className="bg-neutral-900/60 border border-neutral-800/60 rounded-2xl p-5 flex items-center gap-4 shadow-lg">
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <CalendarDays size={20} />
              </div>
              <div>
                <p className="text-xs text-neutral-400 font-medium uppercase tracking-wide">Classes Attended</p>
                <p className="text-2xl font-bold text-white">{stats.totalPresent} <span className="text-sm text-neutral-500 font-normal">/ {stats.totalClasses}</span></p>
              </div>
            </div>

            <div className={`bg-neutral-900/60 border rounded-2xl p-5 flex items-center gap-4 shadow-lg ${stats.warnings > 0 ? 'border-red-500/20' : 'border-neutral-800/60'}`}>
              <div className={`p-3 rounded-xl border ${stats.warnings > 0 ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-neutral-800/50 border-neutral-700/30 text-neutral-400'}`}>
                <AlertTriangle size={20} />
              </div>
              <div>
                <p className="text-xs text-neutral-400 font-medium uppercase tracking-wide">Warnings</p>
                <p className={`text-2xl font-bold ${stats.warnings > 0 ? 'text-red-400' : 'text-white'}`}>{stats.warnings}</p>
              </div>
            </div>
          </motion.div>

          {/* Warning Banner */}
          {hasLowAttendance && (
            <motion.div variants={fadeUp} className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 flex gap-4 items-start shadow-lg">
              <div className="mt-0.5 text-red-400 shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-red-400 mb-1">Low Attendance Warning</h4>
                <p className="text-xs text-red-400/80 mb-2">
                  You have {stats.warnings} subject(s) below 75%. Maintaining required attendance is crucial for exam eligibility.
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {lowAttendanceSubjects.map((subject, idx) => (
                    <span key={idx} className="px-2 py-1 rounded-md bg-red-500/20 text-red-300 text-[10px] font-medium border border-red-500/20">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Subject Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attendance.map((item) => {
              if (!item) return null;

              const total = item.total_days || 0;
              const present = item.present_days || 0;
              const percentage = total > 0 ? (present / total) * 100 : null;

              const { color, bg, border, bar, status, icon: StatusIcon } = getAttendanceColorInfo(percentage);

              const subjectCode = item.subject?.subject_code || item.subject_code || "N/A";
              const subjectName = item.subject?.name || item.subject_name || item.name || "Unknown";
              const semester = item.subject?.semester ?? item.semester ?? "-";
              const subjectId = item.subject?.id || item.subject_id || item.id;

              return (
                <motion.div
                  key={subjectId}
                  variants={fadeUp}
                  className="bg-neutral-900/60 rounded-2xl p-6 border border-neutral-800/60 hover:bg-neutral-900/80 transition-all duration-300 shadow-lg group"
                >
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase text-neutral-400 bg-neutral-800/50 border border-neutral-700/30">
                            {subjectCode}
                          </span>
                          <span className="px-2 py-1 rounded-md text-[10px] font-medium text-neutral-400 bg-neutral-800/30 border border-neutral-800/50">
                            Sem {semester}
                          </span>
                        </div>
                        <h3 className="text-base font-semibold text-white leading-snug">
                          {subjectName}
                        </h3>
                      </div>
                      <div className={`p-2 rounded-xl ${bg} ${border}`}>
                        <StatusIcon size={18} className={color} />
                      </div>
                    </div>

                    {/* Progress Section */}
                    <div className="mb-6">
                      <div className="flex justify-between items-end mb-2">
                        <span className={`text-3xl font-bold tracking-tight ${color}`}>
                          {percentage === null ? "--" : `${percentage.toFixed(1)}%`}
                        </span>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${bg} ${color} border ${border}`}>
                          {status}
                        </span>
                      </div>

                      {total === 0 ? (
                        <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                          <div className="h-full w-0 bg-neutral-700" />
                        </div>
                      ) : (
                        <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(percentage, 100)}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full rounded-full ${bar}`}
                          />
                        </div>
                      )}
                    </div>

                    {/* Statistics or No Data Message */}
                    {total === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center py-4 border-t border-neutral-800/50">
                        <Calendar className="text-neutral-600 mb-2" size={20} />
                        <p className="text-sm text-neutral-400 font-medium">No attendance recorded</p>
                        <p className="text-xs text-neutral-600 mt-1">Classes haven't started yet</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-neutral-800/50">
                        <div className="text-center">
                          <p className="text-lg font-semibold text-white">{present}</p>
                          <p className="text-[10px] uppercase tracking-wide text-neutral-500">Present</p>
                        </div>
                        <div className="text-center border-l border-neutral-800/50">
                          <p className="text-lg font-semibold text-neutral-300">{total - present}</p>
                          <p className="text-[10px] uppercase tracking-wide text-neutral-500">Absent</p>
                        </div>
                        <div className="text-center border-l border-neutral-800/50">
                          <p className="text-lg font-semibold text-neutral-300">{total}</p>
                          <p className="text-[10px] uppercase tracking-wide text-neutral-500">Total</p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </motion.div>
  );
}