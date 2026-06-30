import { motion } from "framer-motion";
import { 
  Building2, 
  GraduationCap, 
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Clock
} from "lucide-react";
import { dashboardStats } from "../../data/dashboardData";

function Dashboard() {
  const stats = [
    { 
      title: "Colleges", 
      value: dashboardStats.totalColleges, 
      trend: 12.5, 
      icon: Building2,
    },
    { 
      title: "Departments", 
      value: dashboardStats.totalDepartments, 
      trend: 8.3, 
      icon: Activity,
    },
    { 
      title: "HODs", 
      value: dashboardStats.totalHODs, 
      trend: -2.4, 
      icon: Users,
    },
    { 
      title: "Students", 
      value: dashboardStats.totalStudents, 
      trend: 18.7, 
      icon: GraduationCap,
    },
  ];

  const recentActivity = [
    { user: "Dr. Sarah Johnson", action: "Added new student", time: "2 min ago" },
    { user: "Prof. Michael Chen", action: "Updated department", time: "15 min ago" },
    { user: "Dr. Emily Davis", action: "Submitted report", time: "1 hour ago" },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-400 mt-1">Welcome back! Here's your platform overview.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -2 }}
            className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                <stat.icon className="w-5 h-5 text-blue-400" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border ${
                stat.trend >= 0 
                  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                  : 'text-red-400 bg-red-500/10 border-red-500/20'
              }`}>
                {stat.trend >= 0 ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {Math.abs(stat.trend)}%
              </div>
            </div>
            
            <div>
              <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
              <p className="text-2xl font-bold text-white mt-1 tracking-tight">
                {stat.value.toLocaleString()}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Activity */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
            <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">View All</button>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + (i * 0.1) }}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-default"
              >
                <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-blue-500/30 transition-colors">
                  <Users className="w-4 h-4 text-gray-400 group-hover:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">{activity.user}</p>
                  <p className="text-sm text-gray-400 truncate">{activity.action}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  {activity.time}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
        >
          <h2 className="text-lg font-semibold text-white mb-6">Quick Stats</h2>
          <div className="space-y-4">
            {[
              { label: "Active Students", value: "1,284", trend: "↑ 12%", color: "text-emerald-400" },
              { label: "Pending Approvals", value: "23", trend: "Requires attention", color: "text-amber-400" },
              { label: "Completion Rate", value: "94%", trend: "↑ 5%", color: "text-emerald-400" },
            ].map((item, i) => (
              <div key={i} className="bg-black/40 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors">
                <p className="text-gray-400 text-sm mb-1">{item.label}</p>
                <div className="flex items-end justify-between">
                  <p className="text-2xl font-bold text-white tracking-tight">{item.value}</p>
                  <p className={`text-xs font-medium ${item.color}`}>{item.trend}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;