import { motion } from "framer-motion";
import { Building2, Users, GraduationCap, UserCog } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getColleges } from "../../services/collegeService";
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

function CollegeDashboard() {
  const { user } = useContext(AuthContext);
  const [collegeName, setCollegeName] = useState("");

  // Resolve college name once from user.college (ID) — reuses existing service
  useEffect(() => {
    if (!user?.college) return;
    getColleges()
      .then((colleges) => {
        const found = Array.isArray(colleges)
          ? colleges.find((c) => c.id === user.college)
          : null;
        if (found) setCollegeName(found.name || "");
      })
      .catch(() => { /* silently ignore — college name is optional context */ });
  }, [user?.college]);

  const adminName = `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || "College Admin";
  const adminEmail = user?.email || "";

  const stats = [
    {
      title: "Departments",
      value: "8",
      icon: Building2,
      iconClass: "text-blue-400",
      strip: "from-blue-600 via-blue-400 to-blue-600",
    },
    {
      title: "HODs",
      value: "12",
      icon: UserCog,
      iconClass: "text-violet-400",
      strip: "from-violet-600 via-violet-400 to-violet-600",
    },
    {
      title: "Students",
      value: "1,250",
      icon: GraduationCap,
      iconClass: "text-emerald-400",
      strip: "from-emerald-600 via-emerald-400 to-emerald-600",
    },
    {
      title: "Faculty",
      value: "85",
      icon: Users,
      iconClass: "text-amber-400",
      strip: "from-amber-600 via-amber-400 to-amber-600",
    },
  ];

  const recentActivity = [
    { text: "New HOD assigned to Computer Science", time: "2h ago", dot: "bg-indigo-500" },
    { text: "Department of AI created", time: "5h ago", dot: "bg-emerald-500" },
    { text: "120 students enrolled this week", time: "1d ago", dot: "bg-blue-500" },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="max-w-7xl mx-auto space-y-6"
    >
      {/* Profile Summary */}
      <ProfileSummaryCard
        role="COLLEGE_ADMIN"
        collegeName={collegeName}
        userName={adminName}
        userEmail={adminEmail}
      />

      {/* Header */}
      <motion.div
        variants={fadeUp}
        className="pb-6 border-b border-neutral-800"
      >
        <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-[0.22em] mb-1.5">
          Overview
        </p>
        <h1 className="text-2xl font-semibold text-white tracking-tight">
          College Dashboard
        </h1>
        <p className="text-[12px] text-neutral-500 mt-1 tracking-wide">
          Institutional overview and key metrics.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={gridStagger}
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
      >
        {stats.map(({ title, value, icon: Icon, iconClass, strip }) => (
          <motion.div
            key={title}
            variants={fadeUp}
            className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-2xl overflow-hidden transition-all duration-200"
          >
            <div className={`h-[3px] w-full bg-gradient-to-r ${strip}`} />
            <div className="p-5 flex items-start justify-between gap-3">
              <div className="space-y-1.5">
                <p className="text-[9px] font-semibold text-neutral-500 uppercase tracking-[0.2em]">
                  {title}
                </p>
                <p className="text-2xl font-semibold text-neutral-100 tracking-tight leading-none">
                  {value}
                </p>
              </div>
              <div className={`p-2.5 bg-neutral-800 border border-neutral-700 rounded-xl ${iconClass} shrink-0`}>
                <Icon size={15} strokeWidth={1.6} />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        variants={fadeUp}
        className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden"
      >
        <div className="h-[3px] w-full bg-gradient-to-r from-indigo-600 via-violet-500 to-indigo-600" />
        <div className="p-6">
          <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-neutral-800">
            <div className="text-indigo-400">
              <GraduationCap size={14} strokeWidth={1.6} />
            </div>
            <h2 className="text-[10px] font-bold text-neutral-300 uppercase tracking-[0.22em]">
              Recent Activity
            </h2>
          </div>
          <motion.div variants={gridStagger} className="space-y-2">
            {recentActivity.map(({ text, time, dot }) => (
              <motion.div
                key={text}
                variants={fadeUp}
                className="flex items-center justify-between gap-4 p-4 bg-neutral-800/50 border border-neutral-700/60 hover:border-neutral-600 hover:bg-neutral-800 rounded-xl transition-all duration-200"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
                  <p className="text-[13px] font-medium text-neutral-200 tracking-wide truncate">
                    {text}
                  </p>
                </div>
                <span className="text-[10px] font-semibold text-neutral-500 bg-neutral-900 border border-neutral-700 px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0">
                  {time}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default CollegeDashboard;