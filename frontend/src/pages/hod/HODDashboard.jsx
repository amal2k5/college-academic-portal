import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import ProfileSummaryCard from "../../components/common/ProfileSummaryCard";

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
  const [activities, setActivities] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await getHODDashboardStats();
        setStats(data);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Could not load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

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
        </div>
      </div>
    );
  }

  if (!stats) return null;

  // Defined here — safely after all null checks
  const statsConfig = [
    {
      title: "Students Enrolled",
      value: stats.total_students ?? "—",
      icon: Users,
      iconClass: "text-blue-400",
      strip: "from-blue-600 via-blue-400 to-blue-600",
    },
    {
      title: "Avg. Attendance",
      value: "—",
      icon: ClipboardCheck,
      iconClass: "text-emerald-400",
      strip: "from-emerald-600 via-emerald-400 to-emerald-600",
    },
    {
      title: "Active Assignments",
      value: "—",
      icon: BookOpen,
      iconClass: "text-indigo-400",
      strip: "from-indigo-600 via-indigo-400 to-indigo-600",
    },
    {
      title: "Pending Leaves",
      value: "—",
      icon: CalendarCheck,
      iconClass: "text-amber-400",
      strip: "from-amber-600 via-amber-400 to-amber-600",
    },
  ];

  const { user } = useContext(AuthContext);
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
          collegeName={stats.college_name}
          userName={stats.hod_name}
          userEmail={hodEmail}
          departmentName={stats.department_name}
        />

        {/* ── HEADER ── */}
        <motion.div
          variants={fadeUp}
          className="pb-7 border-b border-neutral-800"
        >
          <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-[0.22em] mb-2">
            HOD Dashboard
          </p>
          <h1 className="text-2xl font-semibold text-white tracking-tight mb-1">
            Welcome back,{" "}
            <span className="text-indigo-400">{stats.hod_name}</span> 👋
          </h1>
          <p className="text-[11px] text-neutral-500 tracking-wide">
            {stats.department_name}
            {stats.college_name ? ` · ${stats.college_name}` : ""}
          </p>
        </motion.div>

        {/* ── STATS GRID ── */}
        <motion.div
          variants={gridStagger}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
        >
          {statsConfig.map(({ title, value, icon: Icon, iconClass, strip }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-2xl overflow-hidden transition-all duration-200 group"
            >
              <div className={`h-[3px] w-full bg-gradient-to-r ${strip}`} />
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <p className="text-[9px] font-semibold text-neutral-500 uppercase tracking-[0.2em]">
                    {title}
                  </p>
                  <div className={`p-2 bg-neutral-800 border border-neutral-700 rounded-xl ${iconClass} shrink-0`}>
                    <Icon size={14} strokeWidth={1.6} />
                  </div>
                </div>
                <p className="text-2xl font-semibold text-neutral-100 tracking-tight leading-none">
                  {value}
                </p>
                <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="text-[9px] font-semibold text-neutral-500 uppercase tracking-widest">
                    View analytics
                  </span>
                  <ArrowUpRight size={12} strokeWidth={2} className="text-neutral-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── FEED PANELS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Recent Activity */}
          <motion.div
            variants={fadeUp}
            className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col"
          >
            <div className="h-[3px] w-full bg-gradient-to-r from-violet-600 via-violet-400 to-violet-600" />
            <div className="p-5 flex flex-col flex-1">

              {/* Panel header */}
              <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-neutral-800">
                <div className="text-violet-400">
                  <Activity size={14} strokeWidth={1.6} />
                </div>
                <h2 className="text-[10px] font-bold text-neutral-300 uppercase tracking-[0.22em]">
                  Recent Department Activity
                </h2>
              </div>

              {/* Activity list */}
              <div className="space-y-1 flex-1">
                {activities.length > 0 ? (
                  activities.map((act, i) => (
                    <div
                      key={i}
                      className="flex items-start justify-between gap-4 p-3 bg-neutral-800/50 border border-neutral-700/60 hover:border-neutral-600 hover:bg-neutral-800 rounded-xl transition-all duration-200"
                    >
                      <div className="min-w-0 space-y-1">
                        <p className="text-[13px] font-medium text-neutral-100 tracking-wide truncate">
                          {act.text}
                        </p>
                        <p className="text-[10px] text-neutral-500 uppercase tracking-wider truncate">
                          {act.detail}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-widest text-neutral-500 whitespace-nowrap shrink-0 bg-neutral-900 border border-neutral-700 px-2 py-1 rounded-lg">
                        <Clock size={10} strokeWidth={1.6} />
                        <span>{act.time}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center py-10">
                    <p className="text-[10px] font-semibold text-neutral-600 uppercase tracking-[0.2em]">
                      No recent activities
                    </p>
                  </div>
                )}
              </div>

              <button
                type="button"
                className="w-full text-center text-[10px] font-semibold uppercase tracking-widest text-neutral-500 hover:text-neutral-200 transition-colors duration-200 mt-5 pt-4 border-t border-neutral-800 cursor-pointer"
              >
                Audit Activity Log
              </button>
            </div>
          </motion.div>

          {/* Notices */}
          <motion.div
            variants={fadeUp}
            className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col"
          >
            <div className="h-[3px] w-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />
            <div className="p-5 flex flex-col flex-1">

              {/* Panel header */}
              <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-neutral-800">
                <div className="text-amber-400">
                  <Bell size={14} strokeWidth={1.6} />
                </div>
                <h2 className="text-[10px] font-bold text-neutral-300 uppercase tracking-[0.22em]">
                  Official Board Notices
                </h2>
              </div>

              {/* Notices list */}
              <div className="space-y-2 flex-1">
                {notices.length > 0 ? (
                  notices.map((notice, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3.5 p-4 bg-neutral-800/50 border border-neutral-700/60 hover:border-neutral-600 hover:bg-neutral-800 rounded-xl transition-all duration-200"
                    >
                      <div className="mt-0.5 shrink-0">
                        {notice.urgent ? (
                          <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                          </span>
                        ) : (
                          <Megaphone size={14} strokeWidth={1.6} className="text-neutral-500" />
                        )}
                      </div>
                      <div className="space-y-1.5 min-w-0">
                        <p className="text-[13px] font-medium text-neutral-100 tracking-wide leading-relaxed">
                          {notice.text}
                        </p>
                        <span className="inline-block text-[9px] font-semibold text-neutral-500 uppercase tracking-widest bg-neutral-900 border border-neutral-700 px-2 py-0.5 rounded-lg">
                          {notice.meta}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center py-10">
                    <p className="text-[10px] font-semibold text-neutral-600 uppercase tracking-[0.2em]">
                      No notices available
                    </p>
                  </div>
                )}
              </div>

              <button
                type="button"
                className="w-full text-center text-[10px] font-semibold uppercase tracking-widest text-neutral-500 hover:text-neutral-200 transition-colors duration-200 mt-5 pt-4 border-t border-neutral-800 cursor-pointer"
              >
                Broadcast New Notice
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}

export default HODDashboard;