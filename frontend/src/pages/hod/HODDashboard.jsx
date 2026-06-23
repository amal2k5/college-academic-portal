import React from "react";
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
  const stats = [
    {
      title: "Students Enrolled",
      value: "120",
      icon: Users,
      bgColor: "bg-blue-50/70 text-blue-700 border-blue-100",
      accent: "blue"
    },
    {
      title: "Avg. Attendance",
      value: "92%",
      icon: ClipboardCheck,
      bgColor: "bg-emerald-50/70 text-emerald-700 border-emerald-100",
      accent: "emerald"
    },
    {
      title: "Active Assignments",
      value: "18",
      icon: BookOpen,
      bgColor: "bg-indigo-50/70 text-indigo-700 border-indigo-100",
      accent: "indigo"
    },
    {
      title: "Pending Leaves",
      value: "5",
      icon: CalendarCheck,
      bgColor: "bg-amber-50/70 text-amber-700 border-amber-100",
      accent: "amber"
    },
  ];

  const activities = [
    { text: "John Doe submitted Assignment 3", detail: "Data Structures & Algorithms", time: "10m ago" },
    { text: "Anna Smith requested medical leave", detail: "Semester 4 • 3 Days", time: "1h ago" },
    { text: "Attendance metrics updated for S6 CS", detail: "Batch A • Afternoon Session", time: "3h ago" },
    { text: "Internal assessment marks uploaded", detail: "Database Management Systems", time: "Yesterday" },
  ];

  const notices = [
    { text: "Semester End Examinations start next week.", meta: "Academic Calendar", urgent: true },
    { text: "Final year project submission deadline extended.", meta: "Projects Committee", urgent: false },
    { text: "Mandatory general department meeting on Friday.", meta: "HOD Office", urgent: false },
  ];

  return (
    <div className="space-y-8 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto font-sans text-gray-900 antialiased">
      
      {/* Welcome Banner Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          Welcome Back, Director <span className="animate-wave origin-[70%_70%]">👋</span>
        </h1>
        <p className="text-sm font-medium text-gray-400 mt-1 uppercase tracking-wider">
          Computer Science & Engineering Department
        </p>
      </div>

      {/* Analytics Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200/60 hover:shadow-md transition-all duration-200 group relative overflow-hidden"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {item.title}
                  </p>
                  <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                    {item.value}
                  </h2>
                </div>

                <div className={`p-3 rounded-xl border ${item.bgColor} transition-transform group-hover:scale-105 duration-150`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              
              {/* Subtle design micro-action anchor */}
              <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-[11px] font-medium text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <span>View deep analytics</span>
                <ArrowUpRight className="h-3 w-3" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Operational Split Feed panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Activities Feed Component */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-6 pb-2 border-b border-gray-50">
              <div className="p-1.5 bg-gray-50 rounded-lg text-gray-500">
                <Activity className="w-4 h-4" />
              </div>
              <h2 className="font-bold text-base text-gray-900 tracking-tight">
                Recent Department Activity
              </h2>
            </div>

            <div className="space-y-4">
              {activities.map((act, i) => (
                <div key={i} className="flex items-start justify-between gap-4 text-sm group">
                  <div className="space-y-0.5">
                    <p className="font-medium text-gray-800 group-hover:text-indigo-600 transition-colors">
                      {act.text}
                    </p>
                    <p className="text-xs text-gray-400 font-medium">
                      {act.detail}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-medium text-gray-400 whitespace-nowrap shrink-0 mt-0.5">
                    <Clock className="h-3 w-3" />
                    <span>{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button type="button" className="w-full text-center text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition mt-6 pt-4 border-t border-gray-50 cursor-pointer">
            Audit Activity Log
          </button>
        </div>

        {/* Department Notices Component */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-6 pb-2 border-b border-gray-50">
              <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
                <Bell className="w-4 h-4" />
              </div>
              <h2 className="font-bold text-base text-gray-900 tracking-tight">
                Official Board Notices
              </h2>
            </div>

            <div className="space-y-4">
              {notices.map((notice, i) => (
                <div key={i} className="p-3.5 bg-gray-50/60 border border-gray-100 rounded-xl flex items-start gap-3 text-sm transition hover:bg-gray-50">
                  <div className="mt-1 shrink-0">
                    {notice.urgent ? (
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                    ) : (
                      <Megaphone className="h-3.5 w-3.5 text-gray-400" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-gray-800 leading-snug">
                      {notice.text}
                    </p>
                    <span className="inline-block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      {notice.meta}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button type="button" className="w-full text-center text-xs font-semibold text-gray-500 hover:text-gray-800 transition mt-6 pt-4 border-t border-gray-50 cursor-pointer">
            Broadcast New Notice
          </button>
        </div>

      </div>
    </div>
  );
}

export default HODDashboard;