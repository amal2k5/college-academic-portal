import { motion } from "framer-motion";
import { Building2, Users, GraduationCap, UserCog } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getColleges } from "../../services/collegeService";
import { getCollegeAdminDashboardStats } from "../../services/collegeAdminService";
import ProfileSummaryCard from "../../components/common/ProfileSummaryCard";
import StatCard from "../../components/common/StatCard";
import { toast } from "react-toastify";

// Skeleton shimmer card shown while loading
function SkeletonCard() {
  return (
    <div className="bg-neutral-900 rounded-xl p-5 border border-neutral-800 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="w-20 h-3 rounded bg-neutral-800" />
        <div className="w-10 h-10 rounded-xl bg-neutral-800" />
      </div>
      <div className="h-8 w-16 rounded bg-neutral-800" />
    </div>
  );
}

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
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchStats = async () => {
      try {
        const data = await getCollegeAdminDashboardStats();
        if (!cancelled) setStatsData(data);
      } catch (err) {
        if (!cancelled) {
          toast.error("Failed to load dashboard statistics.");
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
      value: statsData?.departments ?? 0,
      icon: Building2,
      iconClass: "text-blue-400",
      strip: "from-blue-600 via-blue-400 to-blue-600",
    },
    {
      title: "HODs",
      value: statsData?.hods ?? 0,
      icon: UserCog,
      iconClass: "text-violet-400",
      strip: "from-violet-600 via-violet-400 to-violet-600",
    },
    {
      title: "Students",
      value: statsData?.students ?? 0,
      icon: GraduationCap,
      iconClass: "text-emerald-400",
      strip: "from-emerald-600 via-emerald-400 to-emerald-600",
    },
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
        {loading
          ? Array.from({ length: 3 }).map((_, idx) => <SkeletonCard key={idx} />)
          : stats.map(({ title, value, icon: Icon }) => (
              <motion.div key={title} variants={fadeUp} className="h-full">
                <StatCard title={title} value={value} icon={Icon} />
              </motion.div>
            ))}
      </motion.div>

    </motion.div>
  );
}

export default CollegeDashboard;