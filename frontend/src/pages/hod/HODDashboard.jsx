import React, { useState, useEffect } from "react";
import {
  Users,
  ClipboardCheck,
  BookOpen,
  CalendarCheck,
  Bell,
  Activity,
  ArrowUpRight,
  Clock,
  Megaphone
} from "lucide-react";

function HODDashboard() {
  // State for real data
  const [stats, setStats] = useState({
    studentsEnrolled: 0,
    avgAttendance: "0%",
    activeAssignments: 0,
    pendingLeaves: 0
  });
  const [activities, setActivities] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Replace these with your actual API calls
      // const statsData = await getDashboardStats();
      // const activitiesData = await getRecentActivities();
      // const noticesData = await getDepartmentNotices();
      
      // Example structure - replace with real API data
      // setStats({
      //   studentsEnrolled: statsData.totalStudents,
      //   avgAttendance: statsData.averageAttendance,
      //   activeAssignments: statsData.activeAssignments,
      //   pendingLeaves: statsData.pendingLeaves
      // });
      // setActivities(activitiesData);
      // setNotices(noticesData);
      
      setError("");
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError("Could not load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Stats configuration with real data
  const statsConfig = [
    {
      title: "Students Enrolled",
      value: stats.studentsEnrolled,
      icon: Users,
      bgColor: "text-blue-400 bg-blue-950/10 border-blue-900/30",
    },
    {
      title: "Avg. Attendance",
      value: stats.avgAttendance,
      icon: ClipboardCheck,
      bgColor: "text-emerald-400 bg-emerald-950/10 border-emerald-900/30",
    },
    {
      title: "Active Assignments",
      value: stats.activeAssignments,
      icon: BookOpen,
      bgColor: "text-indigo-400 bg-indigo-950/10 border-indigo-900/30",
    },
    {
      title: "Pending Leaves",
      value: stats.pendingLeaves,
      icon: CalendarCheck,
      bgColor: "text-amber-400 bg-amber-950/10 border-amber-900/30",
    },
  ];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.04),transparent_35%)] bg-[radial-gradient(circle_at_85%_75%,rgba(220,220,200,0.03),transparent_40%)] p-4 md:p-8 antialiased font-sans">
        <div className="max-w-7xl mx-auto bg-neutral-900/30 backdrop-blur-xl border border-neutral-800/40 rounded-[32px] p-6 md:p-8 shadow-2xl">
          <div className="flex flex-col items-center justify-center py-24">
            <div className="animate-spin rounded-full h-9 w-9 border-2 border-neutral-700/50 border-b-neutral-200/30"></div>
            <p className="text-[9px] font-medium text-neutral-500 mt-4 uppercase tracking-widest">
              Loading dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-neutral-950 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.04),transparent_35%)] bg-[radial-gradient(circle_at_85%_75%,rgba(220,220,200,0.03),transparent_40%)] p-4 md:p-8 antialiased font-sans">
        <div className="max-w-7xl mx-auto bg-neutral-900/30 backdrop-blur-xl border border-neutral-800/40 rounded-[32px] p-6 md:p-8 shadow-2xl">
          <div className="relative p-4 bg-neutral-900/30 backdrop-blur-sm border border-neutral-800/50 rounded-3xl shadow-lg flex items-center gap-3">
            <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-red-400/30 to-transparent rounded-l-3xl"></div>
            <div className="h-2 w-2 rounded-full bg-red-400/50 animate-pulse shrink-0" />
            <span className="text-sm font-medium text-neutral-300 tracking-wide">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.04),transparent_35%)] bg-[radial-gradient(circle_at_85%_75%,rgba(220,220,200,0.03),transparent_40%)] p-4 md:p-8 antialiased font-sans">
      <div className="max-w-7xl mx-auto bg-neutral-900/30 backdrop-blur-xl border border-neutral-800/40 rounded-[32px] p-6 md:p-8 shadow-2xl">
        
        {/* Welcome Banner Header */}
        <div className="border-b border-neutral-800/50 pb-6 mb-8">
          <h1 className="text-xl md:text-2xl font-medium text-neutral-100 tracking-tight flex items-center gap-2">
            Welcome Back, Director <span className="animate-wave origin-[70%_70%]">👋</span>
          </h1>
          <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest mt-1">
            Computer Science & Engineering Department
          </p>
        </div>

        {/* Analytics Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          {statsConfig.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-neutral-900/30 border border-neutral-800/40 hover:border-neutral-700/60 rounded-3xl p-6 transition-all duration-300 group relative overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.3)] backdrop-blur-md"
              >
                {/* Structural Left-Side Micro Indicator Rail */}
                <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-white/10 to-transparent rounded-l-3xl" />
                
                <div className="flex justify-between items-start relative z-10">
                  <div className="space-y-2">
                    <p className="text-[9px] font-medium text-neutral-500 uppercase tracking-widest">
                      {item.title}
                    </p>
                    <h2 className="text-2xl font-medium text-neutral-100 tracking-tight leading-none">
                      {item.value}
                    </h2>
                  </div>

                  <div className={`p-2.5 rounded-2xl border border-neutral-800 bg-neutral-950 ${item.bgColor} transition-all duration-300 group-hover:scale-105`}>
                    <Icon className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                </div>
                
                {/* Subtle design micro-action anchor */}
                <div className="mt-5 pt-3 border-t border-neutral-800/40 flex items-center justify-between text-[9px] font-medium uppercase tracking-widest text-neutral-500 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <span>View deep analytics</span>
                  <ArrowUpRight className="h-3 w-3 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Operational Split Feed panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Recent Activities Feed Component */}
          <div className="bg-neutral-900/20 border border-neutral-800/40 rounded-[32px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl flex flex-col">
            <div>
              <div className="flex items-center gap-3 mb-6 px-1 border-b border-neutral-800/40 pb-3">
                <div className="p-1.5 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-400">
                  <Activity className="w-3.5 h-3.5" strokeWidth={1.5} />
                </div>
                <h2 className="text-[10px] font-medium uppercase tracking-widest text-neutral-300">
                  Recent Department Activity
                </h2>
              </div>

              <div className="space-y-4 px-1">
                {activities.length > 0 ? (
                  activities.map((act, i) => (
                    <div key={i} className="flex items-start justify-between gap-4 text-xs group pb-3 border-b border-neutral-900/40 last:border-0 last:pb-0">
                      <div className="space-y-1 min-w-0">
                        <p className="font-normal text-neutral-200 group-hover:text-white transition-colors duration-200 tracking-wide truncate">
                          {act.text}
                        </p>
                        <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-wider truncate">
                          {act.detail}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-widest text-neutral-500 whitespace-nowrap shrink-0 mt-0.5 bg-neutral-950 border border-neutral-800 px-2 py-0.5 rounded-md">
                        <Clock className="h-3 w-3 text-neutral-500" strokeWidth={1.5} />
                        <span>{act.time}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest">
                      No recent activities
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <button 
              type="button" 
              className="w-full text-center text-[10px] font-medium uppercase tracking-widest text-neutral-400 hover:text-white transition duration-200 mt-6 pt-4 border-t border-neutral-800/40 cursor-pointer"
              onClick={() => {/* Navigate to activity log */}}
            >
              Audit Activity Log
            </button>
          </div>

          {/* Department Notices Component */}
          <div className="bg-neutral-900/20 border border-neutral-800/40 rounded-[32px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl flex flex-col">
            <div>
              <div className="flex items-center gap-3 mb-6 px-1 border-b border-neutral-800/40 pb-3">
                <div className="p-1.5 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-400">
                  <Bell className="w-3.5 h-3.5" strokeWidth={1.5} />
                </div>
                <h2 className="text-[10px] font-medium uppercase tracking-widest text-neutral-300">
                  Official Board Notices
                </h2>
              </div>

              <div className="space-y-3 px-1">
                {notices.length > 0 ? (
                  notices.map((notice, i) => (
                    <div key={i} className="p-4 bg-neutral-950/60 border border-neutral-900/60 rounded-2xl flex items-start gap-3.5 text-xs transition duration-200 hover:border-neutral-800">
                      <div className="mt-0.5 shrink-0">
                        {notice.urgent ? (
                          <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                          </span>
                        ) : (
                          <Megaphone className="h-3.5 w-3.5 text-neutral-500" strokeWidth={1.5} />
                        )}
                      </div>
                      <div className="space-y-1.5 min-w-0">
                        <p className="font-normal text-neutral-200 leading-relaxed tracking-wide">
                          {notice.text}
                        </p>
                        <span className="inline-block text-[9px] font-medium text-neutral-500 uppercase tracking-widest bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded-md">
                          {notice.meta}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest">
                      No notices available
                    </p>
                  </div>
                )}
              </div>
            </div>

            <button 
              type="button" 
              className="w-full text-center text-[10px] font-medium uppercase tracking-widest text-neutral-400 hover:text-white transition duration-200 mt-6 pt-4 border-t border-neutral-800/40 cursor-pointer"
              onClick={() => {/* Navigate to notice creation */}}
            >
              Broadcast New Notice
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default HODDashboard;