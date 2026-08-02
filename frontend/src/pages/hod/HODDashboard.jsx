import React, { useState, useEffect, useContext, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { getHODDashboardStats } from "../../services/hodService";
import {
  Users,
  ClipboardCheck,
  BookOpen,
  CalendarCheck,
  Bell,
  Activity,
  ArrowUpRight,
  Clock,
  Megaphone,
  PlusCircle,
  FileText,
  UserCheck
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import ProfileSummaryCard from "../../components/common/ProfileSummaryCard";
import StatCard from "../../components/common/StatCard";

import subjectService from "../../services/subjectService";
import examService from "../../services/examService";

const ease = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};

const gridStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

function HODDashboard() {
  const [stats, setStats] = useState(null);
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [activities, setActivities] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsData, examsData, subjectsData] = await Promise.all([
          getHODDashboardStats().catch(() => ({})),
          examService.getExams().catch(() => []),
          subjectService.getSubjects().catch(() => [])
        ]);
        setStats(statsData || {});
        setExams(Array.isArray(examsData) ? examsData : []);
        setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Could not load dashboard data. Please refresh.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const { upcomingExams, completedExams } = useMemo(() => {
    const today = new Date();
    today.setHours(0,0,0,0);
    let upcoming = 0;
    let completed = 0;
    
    exams.forEach(e => {
      if(!e.date) { upcoming++; return; }
      const d = new Date(e.date);
      d.setHours(0,0,0,0);
      if (d >= today) upcoming++;
      else completed++;
    });
    return { upcomingExams: upcoming, completedExams: completed };
  }, [exams]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 gap-5">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-6 h-6 rounded-full border-2 border-neutral-800 border-t-indigo-400"
        />
        <p className="text-[10px] text-neutral-500 tracking-[0.25em] uppercase">
          Loading dashboard
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 p-6">
        <div className="w-full max-w-sm p-5 bg-neutral-900 border border-rose-900/40 rounded-2xl flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
          <span className="text-sm text-rose-400 tracking-wide">{error}</span>
          <button onClick={() => window.location.reload()} className="ml-auto text-xs text-rose-300 hover:text-white underline">Retry</button>
        </div>
      </div>
    );
  }

  const statsConfig = [
    {
      title: "Total Subjects",
      value: subjects.length || 0,
      icon: BookOpen,
      iconClass: "text-indigo-400",
      strip: "from-indigo-600 via-indigo-400 to-indigo-600",
    },
    {
      title: "Total Exams",
      value: exams.length || 0,
      icon: ClipboardCheck,
      iconClass: "text-violet-400",
      strip: "from-violet-600 via-violet-400 to-violet-600",
    },
    {
      title: "Upcoming Exams",
      value: upcomingExams,
      icon: CalendarCheck,
      iconClass: "text-amber-400",
      strip: "from-amber-600 via-amber-400 to-amber-600",
    },
    {
      title: "Draft Marks Pending",
      value: stats?.draft_marks_pending ?? 0,
      icon: FileText,
      iconClass: "text-rose-400",
      strip: "from-rose-600 via-rose-400 to-rose-600",
    },
    {
      title: "Today's Attendance",
      value: stats?.todays_attendance ?? "—",
      icon: UserCheck,
      iconClass: "text-emerald-400",
      strip: "from-emerald-600 via-emerald-400 to-emerald-600",
    },
    {
      title: "Total Students",
      value: stats?.total_students ?? "—",
      icon: Users,
      iconClass: "text-cyan-400",
      strip: "from-cyan-600 via-cyan-400 to-cyan-600",
    }
  ];

  const quickActions = [
    { label: "Create Subject", icon: BookOpen, path: "/hod/subjects", color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
    { label: "Create Exam", icon: CalendarCheck, path: "/hod/exams", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    { label: "Manage Marks", icon: FileText, path: "/hod/marks", color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
    { label: "Take Attendance", icon: UserCheck, path: "/hod/attendance", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  ];

  const { user } = useContext(AuthContext) || {};
  const hodEmail = user?.email || "";

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="min-h-screen bg-neutral-950 antialiased font-sans p-4 md:p-6 lg:p-10"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ── PROFILE SUMMARY CARD ── */}
        <ProfileSummaryCard
          role="HOD"
          collegeName={stats?.college_name}
          userName={stats?.hod_name || "Head of Department"}
          userEmail={hodEmail}
          departmentName={stats?.department_name}
        />

        {/* ── HEADER & QUICK ACTIONS ── */}
        <motion.div
          variants={fadeUp}
          className="pb-7 border-b border-neutral-800 flex flex-col lg:flex-row lg:items-end justify-between gap-6"
        >
          <div>
            <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-[0.22em] mb-2">
              HOD Dashboard
            </p>
            <h1 className="text-2xl font-semibold text-white tracking-tight mb-1">
              Welcome back,{" "}
              <span className="text-indigo-400">{stats?.hod_name || "HOD"}</span> 👋
            </h1>
            <p className="text-[11px] text-neutral-400 tracking-wide">
              {stats?.department_name || "Department"}
              {stats?.college_name ? ` · ${stats.college_name}` : ""}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3 shrink-0">
            {quickActions.map(action => (
              <Link 
                key={action.label} 
                to={action.path}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-white/[0.08] hover:border-white/20 hover:bg-slate-800/80 transition-all duration-200 group shadow-sm"
              >
                <action.icon size={15} className={`${action.color} group-hover:scale-110 transition-transform`} />
                <span className="text-xs font-semibold text-gray-200 hidden sm:block whitespace-nowrap">{action.label}</span>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* ── STATS GRID ── */}
        <motion.div
          variants={gridStagger}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
        >
          {statsConfig.map(({ title, value, icon: Icon }) => (
            <motion.div key={title} variants={fadeUp} className="h-full">
              <StatCard title={title} value={value} icon={Icon} />
            </motion.div>
          ))}
        </motion.div>

        {/* ── FEED PANELS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Recent Activity */}
          <motion.div
            variants={fadeUp}
            className="rounded-[20px] bg-[#0F172A] bg-gradient-to-br from-slate-900 via-slate-900 to-violet-950/40 border border-white/[0.08] shadow-xl overflow-hidden flex flex-col min-h-[300px]"
          >
            <div className="h-[2px] w-full bg-gradient-to-r from-violet-500/80 to-indigo-500/80" />
            <div className="p-[24px] flex flex-col flex-1">
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <Activity size={16} className="text-violet-400" />
                  <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                    Recent Department Activity
                  </h2>
                </div>
              </div>

              <div className="space-y-3 flex-1">
                {activities.length > 0 ? (
                  activities.map((act, i) => (
                    <div
                      key={i}
                      className="flex items-start justify-between gap-4 p-4 bg-slate-900/80 border border-white/[0.06] rounded-xl transition-all duration-200 hover:border-white/15"
                    >
                      <div className="min-w-0 space-y-1">
                        <p className="text-sm font-semibold text-white tracking-tight truncate">
                          {act.text}
                        </p>
                        <p className="text-[11px] font-medium text-gray-400 truncate">
                          {act.detail}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-400 whitespace-nowrap shrink-0 bg-white/[0.04] border border-white/[0.08] px-2 py-1 rounded-lg">
                        <Clock size={11} className="text-violet-400" />
                        <span>{act.time}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 h-full border border-dashed border-white/[0.08] rounded-xl">
                    <Activity size={28} className="text-gray-500 mb-3" />
                    <p className="text-sm font-medium text-gray-400">
                      No recent activities found
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Notices */}
          <motion.div
            variants={fadeUp}
            className="rounded-[20px] bg-[#0F172A] bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-white/[0.08] shadow-xl overflow-hidden flex flex-col min-h-[300px]"
          >
            <div className="h-[2px] w-full bg-gradient-to-r from-amber-500/80 to-orange-500/80" />
            <div className="p-[24px] flex flex-col flex-1">
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <Bell size={16} className="text-amber-400" />
                  <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                    Official Board Notices
                  </h2>
                </div>
              </div>

              <div className="space-y-3 flex-1">
                {notices.length > 0 ? (
                  notices.map((notice, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3.5 p-4 bg-slate-900/80 border border-white/[0.06] rounded-xl transition-all duration-200 hover:border-white/15"
                    >
                      <div className="mt-1 shrink-0">
                        {notice.urgent ? (
                          <span className="flex h-2.5 w-2.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
                          </span>
                        ) : (
                          <Megaphone size={15} className="text-amber-400" />
                        )}
                      </div>
                      <div className="space-y-1.5 min-w-0 flex-1">
                        <p className="text-sm font-semibold text-white tracking-tight leading-relaxed">
                          {notice.text}
                        </p>
                        <span className="inline-block text-[10px] font-semibold text-gray-400 bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 rounded">
                          {notice.meta}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 h-full border border-dashed border-white/[0.08] rounded-xl">
                    <Bell size={28} className="text-gray-500 mb-3" />
                    <p className="text-sm font-medium text-gray-400">
                      No notices available
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default HODDashboard;