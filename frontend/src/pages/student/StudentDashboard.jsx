import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Calendar, Clock, MapPin, Activity, ChevronRight, UserCheck, 
  AlertTriangle, FileText, Bell, Inbox, Award, Hourglass, RefreshCw
} from "lucide-react";

import { getStudentProfile } from "../../services/studentService";
import examService from "../../services/examService";
import attendanceService from "../../services/attendanceService";
import marksService from "../../services/marksService";
import assignmentService from "../../services/assignmentService";
import noticeService from "../../services/noticeService";
import notificationService from "../../services/notificationService";

import ProfileSummaryCard from "../../components/common/ProfileSummaryCard";

// ── Animation variants ──────────────────────────────────────────────────────────
const ease = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};

// ── Helpers ──────────────────────────────────────────────────────────────────────
const getCountdown = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return null;
  const dateTimeStr = `${dateStr}T${timeStr.length === 5 ? timeStr + ':00' : timeStr}`;
  const examDateTime = new Date(dateTimeStr);
  if (isNaN(examDateTime.getTime())) return null;

  const diff = examDateTime - new Date();
  if (diff < 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  
  if (days > 0) return `in ${days}d ${hours}h`;
  if (hours > 0) return `in ${hours}h ${minutes}m`;
  return `in ${minutes}m`;
};

const getSubjectName = (item) => {
  if(!item) return "Unknown Subject";
  return item.subject_name || item.subject?.name || item.subject || "Unknown Subject";
};

function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [exams, setExams] = useState([]);
  const [attendance, setAttendance] = useState([]);
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
      
      const [
        profileData,
        examsData,
        attendanceData,
        marksData,
        assignmentsData,
        noticesData,
        unreadNotifications
      ] = await Promise.all([
        getStudentProfile().catch(() => null),
        examService.getExams().catch(() => []),
        attendanceService.getStudentAttendance().catch(() => []),
        marksService.getStudentMarks().catch(() => []),
        assignmentService.getAssignments().catch(() => ({ results: [] })),
        noticeService.getNotices().catch(() => ({ results: [] })),
        notificationService.getUnreadCount().catch(() => 0),
      ]);

      if (profileData && Object.keys(profileData).length > 0) {
        setStudent(profileData);
      } else {
        setError("No profile data found.");
      }
      
      setExams(Array.isArray(examsData) ? examsData : []);
      setAttendance(Array.isArray(attendanceData) ? attendanceData : []);
      setMarks(Array.isArray(marksData) ? marksData : []);
      
      const asgmts = Array.isArray(assignmentsData) ? assignmentsData : (assignmentsData?.results || []);
      setAssignments(asgmts);
      
      const nts = Array.isArray(noticesData) ? noticesData : (noticesData?.results || []);
      setNotices(nts);
      
      setUnreadCount(unreadNotifications || 0);

    } catch (err) {
      setError(err.message || "Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ── Derived State ────────────────────────────────────────────────────────────
  const attendancePercentage = useMemo(() => {
    if (!attendance || attendance.length === 0) return null;
    let present = 0;
    let total = 0;
    
    attendance.forEach(record => {
      if (typeof record.present_classes === 'number' && typeof record.total_classes === 'number') {
        present += record.present_classes;
        total += record.total_classes;
      } else if (record.status) {
        if (record.status.toLowerCase() === 'present' || record.status.toLowerCase() === 'p') present++;
        total++;
      }
    });
    
    if (total === 0) return 0;
    return Math.round((present / total) * 100);
  }, [attendance]);

  const activeAssignments = useMemo(() => {
    const today = new Date();
    today.setHours(0,0,0,0);
    return assignments.filter(a => {
      if(!a.deadline) return true;
      return new Date(a.deadline) >= today;
    });
  }, [assignments]);

  const nextExam = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcoming = exams.filter(e => {
      if(!e.date) return true;
      const d = new Date(e.date);
      d.setHours(0,0,0,0);
      return d >= today;
    });
    upcoming.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
    return upcoming.length > 0 ? upcoming[0] : null;
  }, [exams]);

  const latestMark = useMemo(() => {
    if (!marks || marks.length === 0) return null;
    return marks[0];
  }, [marks]);

  // ── Render Helpers ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 gap-5">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-6 h-6 rounded-full border-2 border-neutral-800 border-t-indigo-400"
        />
        <p className="text-[11px] text-neutral-500 tracking-[0.2em] uppercase">
          Loading dashboard
        </p>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 p-6">
        <div className="w-full max-w-sm p-6 bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-col items-center text-center gap-4">
          <p className="text-sm text-rose-400 tracking-wide">
            {error || "No dashboard data available."}
          </p>
          <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-semibold transition-colors">
            <RefreshCw size={14} /> Try Again
          </button>
        </div>
      </div>
    );
  }

  const s = student;
  const fullName = `${s.first_name || ""} ${s.last_name || ""}`.trim() || "Student";
  const countdown = nextExam ? getCountdown(nextExam.date, nextExam.time) : null;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="min-h-screen bg-neutral-950 antialiased p-4 md:p-6 lg:p-10 max-w-[1400px] mx-auto space-y-8"
    >
      <ProfileSummaryCard
        role="STUDENT"
        collegeName={s.college_name}
        userName={fullName}
        rollNumber={s.roll_number}
        departmentName={s.department_name}
        semester={s.semester}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ── LEFT COLUMN ── */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Welcome Banner */}
          <motion.div variants={fadeUp} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 overflow-hidden relative shadow-lg shadow-black/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">
              Welcome back, <span className="text-indigo-400">{s.first_name || "Student"}</span>!
            </h1>
            <p className="text-sm text-neutral-400 mt-2">
              Here's your academic overview for today.
            </p>
          </motion.div>

          {/* Mini Stats Grid */}
          <motion.div variants={stagger} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <motion.div variants={fadeUp} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
              <div className="p-2.5 bg-blue-500/10 rounded-xl mb-3">
                <FileText size={18} className="text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-neutral-100">{activeAssignments.length}</p>
              <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest mt-1">Active Assignments</p>
            </motion.div>
            <motion.div variants={fadeUp} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
              <div className="p-2.5 bg-amber-500/10 rounded-xl mb-3">
                <Bell size={18} className="text-amber-400" />
              </div>
              <p className="text-2xl font-bold text-neutral-100">{notices.length}</p>
              <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest mt-1">Total Notices</p>
            </motion.div>
            <motion.div variants={fadeUp} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
              <div className="p-2.5 bg-purple-500/10 rounded-xl mb-3">
                <Inbox size={18} className="text-purple-400" />
              </div>
              <p className="text-2xl font-bold text-neutral-100">{unreadCount}</p>
              <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest mt-1">Unread Alerts</p>
            </motion.div>
            <motion.div variants={fadeUp} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
              <div className="p-2.5 bg-indigo-500/10 rounded-xl mb-3">
                <Calendar size={18} className="text-indigo-400" />
              </div>
              <p className="text-2xl font-bold text-neutral-100">{exams.length}</p>
              <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest mt-1">Total Exams</p>
            </motion.div>
          </motion.div>

          {/* Latest Published Marks */}
          <motion.div variants={fadeUp} className="bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-col overflow-hidden">
            <div className="h-[3px] w-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600" />
            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <Award size={18} className="text-emerald-400" />
                  <h2 className="text-xs font-bold text-neutral-200 uppercase tracking-widest">Latest Published Marks</h2>
                </div>
                <Link to="/student/marks" className="text-[10px] font-semibold uppercase text-neutral-500 hover:text-emerald-400 transition-colors flex items-center gap-1">
                  View All <ChevronRight size={12} />
                </Link>
              </div>
              
              {latestMark ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 bg-neutral-800/30 rounded-xl border border-neutral-800/50 gap-4">
                  <div>
                    <p className="text-base font-semibold text-neutral-100">{getSubjectName(latestMark)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {latestMark.exam_type?.replace(/([A-Z])/g, " $1").trim() || "Exam"}
                      </span>
                      {latestMark.semester && (
                        <span className="text-[10px] font-semibold text-neutral-400 bg-neutral-800 border border-neutral-700 px-2 py-0.5 rounded">
                          Sem {latestMark.semester}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center sm:text-right gap-6 sm:gap-4">
                    <div>
                      <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest mb-0.5">Score</p>
                      <p className="text-2xl font-bold text-emerald-400">
                        {latestMark.obtained_marks ?? latestMark.marks ?? "—"}
                        <span className="text-sm text-neutral-500 font-medium"> / {latestMark.maximum_marks || 100}</span>
                      </p>
                    </div>
                    {latestMark.grade && (
                      <div className="pl-6 border-l border-neutral-700">
                        <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest mb-0.5">Grade</p>
                        <p className="text-2xl font-bold text-white">{latestMark.grade}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-8 flex flex-col items-center justify-center text-center border border-dashed border-neutral-800 rounded-xl bg-neutral-900/30">
                  <Award size={24} className="text-neutral-700 mb-3" />
                  <p className="text-sm font-medium text-neutral-400">No marks published yet</p>
                </div>
              )}
            </div>
          </motion.div>

        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Attendance Widget */}
          <motion.div variants={fadeUp} className="bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-col overflow-hidden relative shadow-lg shadow-black/20">
            <div className="h-[3px] w-full bg-gradient-to-r from-cyan-600 via-cyan-400 to-cyan-600 relative z-10" />
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <div className="p-6 flex flex-col items-center justify-center relative z-10">
              <div className="w-full flex items-center justify-between mb-6 pb-4 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <UserCheck size={16} className="text-cyan-400" />
                  <h2 className="text-xs font-bold text-neutral-200 uppercase tracking-widest">Attendance</h2>
                </div>
                <Link to="/student/attendance" className="text-[10px] text-neutral-500 hover:text-cyan-400 uppercase font-semibold tracking-widest transition-colors">Details</Link>
              </div>

              {attendancePercentage !== null ? (
                <>
                  <div className="relative w-36 h-36 flex items-center justify-center mb-6">
                    <svg className="w-full h-full transform -rotate-90 filter drop-shadow-lg">
                      <circle cx="72" cy="72" r="62" className="text-neutral-800 stroke-current" strokeWidth="12" fill="transparent" />
                      <circle 
                        cx="72" cy="72" r="62" 
                        className={`${attendancePercentage >= 75 ? 'text-cyan-400' : 'text-rose-500'} stroke-current transition-all duration-1000 ease-out`} 
                        strokeWidth="12" fill="transparent" 
                        strokeDasharray={389.5} 
                        strokeDashoffset={389.5 - (389.5 * attendancePercentage) / 100} 
                        strokeLinecap="round" 
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-white">{attendancePercentage}%</span>
                      <span className="text-[9px] font-semibold text-neutral-500 uppercase tracking-widest mt-1">Overall</span>
                    </div>
                  </div>
                  
                  {attendancePercentage < 75 && (
                    <div className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                      <AlertTriangle size={14} className="text-rose-400" />
                      <span className="text-xs font-semibold text-rose-300">Below 75% Requirement</span>
                    </div>
                  )}
                  {attendancePercentage >= 75 && (
                    <div className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-cyan-500/5 border border-cyan-500/10 rounded-xl">
                      <span className="text-xs font-semibold text-cyan-400/80">On track with requirements</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-center w-full">
                  <UserCheck size={32} className="text-neutral-700 mb-3" />
                  <p className="text-sm font-medium text-neutral-400">No attendance data</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Upcoming Exam Widget */}
          <motion.div variants={fadeUp} className="bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-col overflow-hidden shadow-lg shadow-black/20">
            <div className="h-[3px] w-full bg-gradient-to-r from-indigo-600 via-violet-500 to-indigo-600" />
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <Activity size={16} className="text-indigo-400" />
                  <h2 className="text-xs font-bold text-neutral-200 uppercase tracking-widest">Next Examination</h2>
                </div>
              </div>
              
              <div className="flex-1">
                {nextExam ? (
                  <div className="space-y-5">
                    <div>
                      <p className="text-base font-semibold text-white leading-snug mb-2">
                        {nextExam.subject_name || "Unknown Subject"}
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        {nextExam.subject_code && (
                          <span className="text-[10px] font-mono font-medium text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                            {nextExam.subject_code}
                          </span>
                        )}
                        <span className="text-[10px] font-semibold text-neutral-300 bg-neutral-800 border border-neutral-700 px-2 py-0.5 rounded">
                          {nextExam.exam_type?.replace(/([A-Z])/g, " $1").trim() || "Exam"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 bg-neutral-800/40 rounded-xl p-4 border border-neutral-800/60">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[13px] text-neutral-300">
                          <Calendar size={14} className="text-neutral-500" />
                          <span className="font-medium">
                            {new Date(nextExam.date).toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        {countdown && (
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/20">
                            <Hourglass size={10} />
                            {countdown}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-[13px] text-neutral-300">
                        <Clock size={14} className="text-neutral-500" />
                        <span>{nextExam.time?.substring(0, 5)} <span className="text-neutral-500 px-1">•</span> {nextExam.duration}m</span>
                      </div>
                      <div className="flex items-start gap-2 text-[13px] text-neutral-300">
                        <MapPin size={14} className="text-neutral-500 mt-0.5 shrink-0" />
                        <span className="truncate">{nextExam.venue || "TBA"}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center space-y-3 border border-dashed border-neutral-800 rounded-xl bg-neutral-900/30">
                    <Calendar size={24} className="text-neutral-700" />
                    <p className="text-sm font-medium text-neutral-400">No upcoming exams</p>
                    <p className="text-[10px] text-neutral-600 px-6">Enjoy your break! We'll notify you when new exams are scheduled.</p>
                  </div>
                )}
              </div>

              <Link to="/student/exams" className="mt-5 pt-4 border-t border-neutral-800 flex items-center justify-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors group">
                View all exams
                <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}

export default StudentDashboard;