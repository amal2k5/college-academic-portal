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
import StatCard from "../../components/common/StatCard";

// Skeleton shimmer card shown while loading
function SkeletonCard() {
  return (
    <div className="rounded-[20px] bg-[#0F172A] border border-white/[0.08] p-[24px] min-h-[180px] animate-pulse flex flex-col justify-between">
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl bg-slate-800" />
        <div className="w-16 h-6 rounded-full bg-slate-800" />
      </div>
      <div>
        <div className="h-8 w-20 rounded bg-slate-800 mb-2" />
        <div className="h-4 w-28 rounded bg-slate-800" />
      </div>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3, ease: "easeOut" }}
                className="h-full"
              >
                <StatCard title={stat.title} value={stat.value.toLocaleString()} icon={stat.icon} />
              </motion.div>
            ))}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.3 }}
          className="lg:col-span-2 rounded-[20px] bg-[#0F172A] bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/30 p-[24px] border border-white/[0.08] shadow-xl"
        >
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.08]">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">Recent Activity</h2>
            <button className="text-xs font-semibold text-gray-400 hover:text-white transition-colors uppercase tracking-wider">
              View All
            </button>
          </div>

          <div className="space-y-3">
            {recentActivity.map((activity, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="flex items-center gap-4 p-4 bg-slate-900/80 border border-white/[0.06] hover:border-white/15 rounded-xl transition-all group cursor-default"
              >
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center flex-shrink-0 group-hover:border-white/20 transition-colors">
                  <Users className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-semibold tracking-tight truncate">{activity.user}</p>
                  <p className="text-xs text-gray-400 font-medium truncate">{activity.action}</p>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 bg-white/[0.04] border border-white/[0.08] px-2.5 py-1 rounded-lg">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
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
          className="rounded-[20px] bg-[#0F172A] bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/30 p-[24px] border border-white/[0.08] shadow-xl"
        >
          <div className="mb-6 pb-4 border-b border-white/[0.08]">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">College Status</h2>
          </div>
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-slate-900/80 rounded-xl p-4 border border-white/[0.06] animate-pulse"
                >
                  <div className="h-3 w-28 rounded bg-slate-800 mb-3" />
                  <div className="h-7 w-12 rounded bg-slate-800" />
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
                  className="bg-slate-900/80 rounded-xl p-4 border border-white/[0.06] hover:border-white/15 transition-colors"
                >
                  <p className="text-gray-400 text-xs mb-1 font-semibold uppercase tracking-wider">{item.label}</p>
                  <div className="flex items-end justify-between">
                    <p className="text-3xl font-bold text-white tracking-tight leading-none">
                      {item.value.toLocaleString()}
                    </p>
                    <p className={`text-[11px] font-bold tracking-wide ${item.color}`}>{item.sub}</p>
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