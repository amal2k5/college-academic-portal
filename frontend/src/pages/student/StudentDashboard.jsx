import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Calendar, Clock, MapPin, Activity, ChevronRight, UserCheck,
  AlertTriangle, FileText, Bell, Inbox, Award, Hourglass, RefreshCw,
  TrendingUp, BookOpen
} from "lucide-react";
import { getStudentProfile } from "../../services/studentService";
import examService from "../../services/examService";
import attendanceService from "../../services/attendanceService";
import marksService from "../../services/marksService";
import assignmentService from "../../services/assignmentService";
import noticeService from "../../services/noticeService";
import notificationService from "../../services/notificationService";
import { getExamTypeLabel } from "../../constants/examConstants";
import ProfileSummaryCard from "../../components/common/ProfileSummaryCard";
import StatCard from "../../components/common/StatCard";
import { LoadingPage } from "../../components/common/loading";

const ease = [0.22, 1, 0.36, 1];
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
};
const stagger = {
  visible: { transition: { staggerChildren: 0.05 } },
};

const formatTime = (time) => {
  if (!time) return "N/A";
  const [hours, minutes] = time.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
};

const getCountdown = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return null;
  const dateTimeStr = `${dateStr}T${timeStr.length === 5 ? timeStr + ':00' : timeStr}`;
  const examDateTime = new Date(dateTimeStr);
  if (isNaN(examDateTime.getTime())) return null;
  const diff = examDateTime - new Date();
  if (diff < 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h`;
  return "Soon";
};

const getSubjectName = (item) => {
  if (!item) return "Unknown Subject";
  return item.subject_name || item.subject?.name || item.subject || "Unknown Subject";
};

function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [exams, setExams] = useState([]);
  const [marks, setMarks] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [notices, setNotices] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const [profileData, examsData, marksData, assignmentsData, noticesData, unreadNotifications] = await Promise.all([
        getStudentProfile().catch(() => null),
        examService.getExams().catch(() => []),
        marksService.getStudentMarks().catch(() => []),
        assignmentService.getAssignments().catch(() => ({ results: [] })),
        noticeService.getNotices().catch(() => ({ results: [] })),
        notificationService.getUnreadCount().catch(() => 0),
      ]);

      if (profileData && Object.keys(profileData).length > 0) setStudent(profileData);
      else setError("No profile data found.");
      setExams(Array.isArray(examsData) ? examsData : []);
      setMarks(Array.isArray(marksData) ? marksData : []);
      setAssignments(Array.isArray(assignmentsData) ? assignmentsData : (assignmentsData?.results || []));
      setNotices(Array.isArray(noticesData) ? noticesData : (noticesData?.results || []));
      setUnreadCount(unreadNotifications || 0);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const activeAssignments = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return assignments.filter(a => !a.deadline || new Date(a.deadline) >= today);
  }, [assignments]);

  const nextExam = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const upcoming = exams.filter(e => {
      if (!e.exam_date) return true;
      const d = new Date(e.exam_date); d.setHours(0, 0, 0, 0);
      return d >= today;
    }).sort((a, b) => new Date(a.exam_date || 0) - new Date(b.exam_date || 0));
    return upcoming[0] || null;
  }, [exams]);

  const latestMark = useMemo(() => marks?.[0] || null, [marks]);
  if (loading) return <LoadingPage text="Loading Student Dashboard..." fullScreen={true} />;

  if (error || !student) return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 p-6">
      <div className="w-full max-w-sm p-8 bg-neutral-900 border border-neutral-800 flex flex-col items-center text-center gap-4">
        <AlertTriangle className="text-rose-500 w-10 h-10 mb-2" />
        <p className="text-sm text-neutral-300">{error || "No data available."}</p>
        <button onClick={fetchData} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider transition-colors">
          Retry
        </button>
      </div>
    </div>
  );

  const s = student;
  const fullName = `${s.first_name || ""} ${s.last_name || ""}`.trim() || "Student";
  const countdown = nextExam ? getCountdown(nextExam.exam_date, nextExam.start_time) : null;

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="min-h-screen bg-neutral-950 text-neutral-200 p-4 md:p-8 max-w-7xl mx-auto space-y-6">

      <ProfileSummaryCard
        role="STUDENT"
        collegeName={s.college_name}
        userName={fullName}
        rollNumber={s.roll_number}
        departmentName={s.department_name}
        semester={s.semester}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-6">

          <motion.div variants={fadeUp} className="relative overflow-hidden rounded-[20px] bg-[#0F172A] bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/80 border border-white/[0.08] p-[24px] shadow-xl">
            {/* Subtle mesh background */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
            {/* Low opacity illustration */}
            <div className="absolute top-0 right-0 bottom-0 w-[45%] flex items-center justify-end pr-4 opacity-[0.08] pointer-events-none overflow-hidden">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-44 h-44 text-indigo-200 -mr-6 -mb-4">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <div className="relative z-10">
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                Welcome back, <span className="text-indigo-400 font-extrabold">{s.first_name}</span>
              </h1>
              <p className="text-gray-400 mt-2 text-sm font-medium flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                {activeAssignments.length} pending · {exams.length} exams scheduled
              </p>
            </div>
          </motion.div>

          <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              { label: "Assignments", value: activeAssignments.length, icon: FileText, color: "blue" },
              { label: "Notices", value: notices.length, icon: Bell, color: "amber" },
              { label: "Alerts", value: unreadCount, icon: Inbox, color: "purple" },
              { label: "Exams", value: exams.length, icon: Calendar, color: "indigo" },
            ].map((stat, idx) => (
              <motion.div key={idx} variants={fadeUp} className="h-full">
                <StatCard label={stat.label} value={stat.value} icon={stat.icon} />
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="rounded-[20px] bg-[#0F172A] bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-white/[0.08] shadow-xl overflow-hidden">
            <div className="h-0.5 w-full bg-gradient-to-r from-emerald-500/80 to-teal-500/80" />
            <div className="p-[24px]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Award size={16} className="text-emerald-400" />
                  <h2 className="text-xs font-bold text-white uppercase tracking-wider">Latest Result</h2>
                </div>
                <Link to="/student/marks" className="text-xs font-semibold text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-1">
                  View All <ChevronRight size={14} />
                </Link>
              </div>

              {latestMark ? (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-900/80 border border-white/[0.06] rounded-xl">
                  <div>
                    <p className="text-base font-semibold text-white tracking-tight">{getSubjectName(latestMark)}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] font-mono font-semibold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                        {latestMark.subject_code || "N/A"}
                      </span>
                      <span className="text-[10px] font-medium text-gray-400 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.08]">
                        {getExamTypeLabel(latestMark.exam_type)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">Score</p>
                      <p className="text-2xl font-bold text-emerald-400 tracking-tight mt-0.5">
                        {latestMark.obtained_marks ?? latestMark.marks ?? "--"}
                        <span className="text-xs text-gray-500 font-medium ml-1">/ {latestMark.maximum_marks || 100}</span>
                      </p>
                    </div>
                    {latestMark.grade && (
                      <div className="pl-4 border-l border-white/[0.08]">
                        <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">Grade</p>
                        <p className="text-2xl font-bold text-white tracking-tight mt-0.5">{latestMark.grade}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center border border-dashed border-white/[0.08] rounded-xl">
                  <BookOpen size={24} className="text-gray-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-400 font-medium">No results published</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-6">

          <motion.div variants={fadeUp} className="rounded-[20px] bg-[#0F172A] bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-white/[0.08] shadow-xl overflow-hidden">
            <div className="h-0.5 w-full bg-gradient-to-r from-indigo-500/80 to-violet-500/80" />
            <div className="p-[24px]">
              <div className="flex items-center gap-2 mb-4">
                <Activity size={16} className="text-indigo-400" />
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">Next Exam</h2>
              </div>

              {nextExam ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-base font-semibold text-white tracking-tight">{nextExam.subject_name || "Unknown"}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      {nextExam.subject_code && (
                        <span className="text-[10px] font-mono font-semibold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                          {nextExam.subject_code}
                        </span>
                      )}
                      <span className="text-[10px] font-medium text-gray-300 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.08]">
                        {getExamTypeLabel(nextExam.exam_type)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2.5 bg-slate-900/80 p-4 border border-white/[0.06] rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-medium text-gray-300">
                        <Calendar size={14} className="text-indigo-400" />
                        <span>{new Date(nextExam.exam_date).toLocaleDateString("en-US", { month: 'short', day: 'numeric', weekday: 'short' })}</span>
                      </div>
                      {countdown && (
                        <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/15 px-2.5 py-0.5 rounded-full border border-indigo-500/20 shadow-sm">
                          {countdown}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs font-medium text-gray-300">
                      <Clock size={14} className="text-indigo-400" />
                      <span>{formatTime(nextExam.start_time)} – {formatTime(nextExam.end_time)}</span>
                    </div>

                    <div className="flex items-start gap-2 text-xs font-medium text-gray-300">
                      <MapPin size={14} className="text-indigo-400 mt-0.5 shrink-0" />
                      <span className="truncate">{nextExam.venue || "TBA"}</span>
                    </div>
                  </div>

                  <Link to="/student/exams" className="block text-center text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors pt-3 border-t border-white/[0.08]">
                    View Schedule
                  </Link>
                </div>
              ) : (
                <div className="py-8 text-center border border-dashed border-white/[0.08] rounded-xl">
                  <Calendar size={24} className="text-gray-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-400 font-medium">No upcoming exams</p>
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}

export default StudentDashboard;