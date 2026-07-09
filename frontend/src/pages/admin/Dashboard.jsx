import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  CheckCheck,
  Ban,
  Users,
} from "lucide-react";
import { toast } from "react-toastify";
import { getPlatformDashboardStats } from "../../services/platformService";
import PageHeader from "../../components/common/PageHeader";

// Skeleton shimmer card shown while loading
function SkeletonCard() {
  return (
    <div className="bg-neutral-900 rounded-xl p-5 border border-neutral-800 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-lg bg-neutral-800" />
        <div className="w-14 h-6 rounded-full bg-neutral-800" />
      </div>
      <div className="h-4 w-24 rounded bg-neutral-800 mb-2" />
      <div className="h-8 w-16 rounded bg-neutral-800" />
    </div>
  );
}

function Dashboard() {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchStats = async () => {
      try {
        const data = await getPlatformDashboardStats();
        if (!cancelled) setStatsData(data);
      } catch (err) {
        if (!cancelled) {
          const message =
            err.response?.data?.detail ||
            err.response?.data?.message ||
            "Failed to load dashboard statistics.";
          toast.error(message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchStats();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = statsData
    ? [
        {
          title: "Total Colleges",
          value: statsData.total_colleges,
          icon: Building2,
          color: "blue",
        },
        {
          title: "Active Colleges",
          value: statsData.active_colleges,
          icon: CheckCircle2,
          color: "emerald",
        },
        {
          title: "Inactive Colleges",
          value: statsData.inactive_colleges,
          icon: XCircle,
          color: "red",
        },
        {
          title: "Pending Requests",
          value: statsData.pending_requests,
          icon: Clock,
          color: "amber",
        },
        {
          title: "Approved Requests",
          value: statsData.approved_requests,
          icon: CheckCheck,
          color: "emerald",
        },
        {
          title: "Rejected Requests",
          value: statsData.rejected_requests,
          icon: Ban,
          color: "red",
        },
      ]
    : [];

  const colorMap = {
    blue: {
      bg: "bg-blue-500/10",
      icon: "text-blue-400",
    },
    emerald: {
      bg: "bg-emerald-500/10",
      icon: "text-emerald-400",
    },
    red: {
      bg: "bg-red-500/10",
      icon: "text-red-400",
    },
    amber: {
      bg: "bg-amber-500/10",
      icon: "text-amber-400",
    },
  };

  const recentActivity = [
    { user: "Dr. Sarah Johnson", action: "Added new student", time: "2 min ago" },
    { user: "Prof. Michael Chen", action: "Updated department", time: "15 min ago" },
    { user: "Dr. Emily Davis", action: "Submitted report", time: "1 hour ago" },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white py-8 px-4 md:px-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <PageHeader 
        title="Dashboard" 
        subtitle="Welcome back! Here's your platform overview." 
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : stats.map((stat, index) => {
              const colors = colorMap[stat.color];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3, ease: "easeOut" }}
                  className="bg-neutral-900 rounded-xl p-5 border border-neutral-800 hover:border-neutral-700 transition-colors group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`p-2.5 rounded-lg transition-colors ${colors.bg}`}
                    >
                      <stat.icon className={`w-5 h-5 ${colors.icon}`} />
                    </div>
                  </div>

                  <div>
                    <p className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">{stat.title}</p>
                    <p className="text-2xl font-bold text-white mt-1.5 tracking-tight">
                      {stat.value.toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              );
            })}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.3 }}
          className="lg:col-span-2 bg-neutral-900 rounded-xl p-6 border border-neutral-800"
        >
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-800">
            <h2 className="text-sm font-semibold text-neutral-200 uppercase tracking-wider">Recent Activity</h2>
            <button className="text-xs font-semibold text-neutral-400 hover:text-white transition-colors uppercase tracking-wider">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="flex items-center gap-4 p-3 bg-neutral-950 border border-neutral-800 hover:border-neutral-700/80 rounded-lg transition-all group cursor-default"
              >
                <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-850 flex items-center justify-center flex-shrink-0 group-hover:border-neutral-700 transition-colors">
                  <Users className="w-4 h-4 text-neutral-400 group-hover:text-neutral-200" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-neutral-200 font-medium truncate">{activity.user}</p>
                  <p className="text-xs text-neutral-500 truncate">{activity.action}</p>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-neutral-500 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded">
                  <Clock className="w-3 h-3 text-neutral-500" />
                  {activity.time}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="bg-neutral-900 rounded-xl p-6 border border-neutral-800"
        >
          <div className="mb-6 pb-4 border-b border-neutral-800">
            <h2 className="text-sm font-semibold text-neutral-200 uppercase tracking-wider">College Status</h2>
          </div>
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-neutral-950 rounded-lg p-4 border border-neutral-800 animate-pulse"
                >
                  <div className="h-3 w-28 rounded bg-neutral-800 mb-3" />
                  <div className="h-7 w-12 rounded bg-neutral-800" />
                </div>
              ))
            ) : statsData ? (
              [
                {
                  label: "Active Colleges",
                  value: statsData.active_colleges,
                  sub: `of ${statsData.total_colleges} total`,
                  color: "text-emerald-400",
                },
                {
                  label: "Pending Requests",
                  value: statsData.pending_requests,
                  sub: "Requires attention",
                  color: "text-amber-400",
                },
                {
                  label: "Approved Requests",
                  value: statsData.approved_requests,
                  sub: `${statsData.rejected_requests} rejected`,
                  color: "text-blue-400",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-neutral-950 rounded-lg p-4 border border-neutral-800 hover:border-neutral-700/80 transition-colors"
                >
                  <p className="text-neutral-400 text-xs mb-1 font-semibold uppercase tracking-wider">{item.label}</p>
                  <div className="flex items-end justify-between">
                    <p className="text-2xl font-bold text-white tracking-tight">
                      {item.value.toLocaleString()}
                    </p>
                    <p className={`text-[10px] font-semibold uppercase tracking-wider ${item.color}`}>{item.sub}</p>
                  </div>
                </div>
              ))
            ) : null}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;