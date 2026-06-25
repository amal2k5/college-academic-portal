import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  GraduationCap,
  Users,
  Mail,
  Phone,
  Calendar,
  Building2,
  Hash,
  Bookmark,
  School,
  BriefcaseBusiness,
} from "lucide-react";

import { getStudentProfile } from "../../services/studentService";

const ease = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};

const gridStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

function Profile() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getStudentProfile();
        if (data && typeof data === "object" && Object.keys(data).length > 0) {
          setStudent(data);
        } else {
          setError("No profile data found.");
        }
      } catch (err) {
        setError(err.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 gap-5">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-6 h-6 rounded-full border-2 border-neutral-800 border-t-indigo-400"
        />
        <p className="text-[11px] text-neutral-500 tracking-[0.2em] uppercase">
          Loading profile
        </p>
      </div>
    );
  }

  if (error || !student) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-neutral-950 p-6"
      >
        <div className="w-full max-w-sm p-6 bg-neutral-900 border border-neutral-800 rounded-2xl text-center">
          <p className="text-sm text-rose-400 tracking-wide">
            {error || "No profile data available."}
          </p>
        </div>
      </motion.div>
    );
  }

  const s = {
    first_name: student.first_name || "",
    last_name: student.last_name || "",
    email: student.email || "",
    phone: student.phone || "",
    gender: student.gender || "",
    date_of_birth: student.date_of_birth || "",
    department_name: student.department_name || "",
    college_name: student.college_name || "",
    hod_name: student.hod_name || "",
    roll_number: student.roll_number || "",
    admission_number: student.admission_number || "",
    academic_year: student.academic_year || "",
    semester: student.semester || "",
    parent_name: student.parent_name || "",
    parent_phone: student.parent_phone || "",
  };

  const fullName = `${s.first_name} ${s.last_name}`.trim() || "Student";
  const initials = `${s.first_name[0] || ""}${s.last_name[0] || ""}` || "S";

  // Info card used in the right grid sections
  const InfoCard = ({ icon: Icon, label, value, iconClass }) => (
    <motion.div
      variants={fadeUp}
      className="bg-neutral-800/50 border border-neutral-700/60 hover:border-neutral-600 hover:bg-neutral-800 rounded-xl p-4 flex items-start gap-3 transition-all duration-200"
    >
      <div className={`mt-0.5 shrink-0 ${iconClass}`}>
        <Icon size={15} strokeWidth={1.6} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-semibold text-neutral-500 uppercase tracking-[0.2em] mb-1.5">
          {label}
        </p>
        <p className="text-[13px] font-medium text-neutral-100 tracking-wide truncate leading-snug">
          {value || "—"}
        </p>
      </div>
    </motion.div>
  );

  // Divider row used in the left panel
  const MetaRow = ({ label, value, mono = false }) => (
    <motion.div
      variants={fadeUp}
      className="flex items-center justify-between py-3 border-b border-neutral-800 last:border-0"
    >
      <span className="text-[9px] font-semibold text-neutral-500 uppercase tracking-[0.18em]">
        {label}
      </span>
      <span
        className={`text-[12px] font-medium text-neutral-200 max-w-[180px] truncate ${
          mono ? "font-mono text-[11px] text-neutral-400" : ""
        }`}
      >
        {value || "—"}
      </span>
    </motion.div>
  );

  // Section header with horizontal rule
  const SectionHeader = ({ icon: Icon, label, iconClass }) => (
    <motion.div
      variants={fadeUp}
      className="flex items-center gap-2.5 mb-5"
    >
      <div className={iconClass}>
        <Icon size={14} strokeWidth={1.6} />
      </div>
      <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-[0.22em]">
        {label}
      </span>
      <div className="flex-1 h-px bg-neutral-700/60" />
    </motion.div>
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="min-h-screen bg-neutral-950 text-neutral-400 antialiased p-4 md:p-6 lg:p-10 max-w-[1300px] mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        {/* ── LEFT PANEL ── */}
        <motion.div
          variants={fadeIn}
          className="lg:col-span-4 lg:sticky lg:top-8 space-y-4"
        >

          {/* Identity card */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">

            {/* Colored top strip */}
            <div className="h-[3px] w-full bg-gradient-to-r from-indigo-600 via-violet-500 to-indigo-600" />

            <div className="p-6">

              {/* Avatar + name */}
              <motion.div
                variants={fadeUp}
                className="flex flex-col items-center text-center mb-6 pb-6 border-b border-neutral-800"
              >
                <motion.div
                  initial={{ scale: 0.75, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.45, ease, delay: 0.08 }}
                  className="relative mb-4"
                >
                  <div className="w-[72px] h-[72px] rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-[22px] font-semibold text-white select-none">
                    {initials}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-neutral-900" />
                </motion.div>

                <h1 className="text-[16px] font-semibold text-white tracking-wide mb-1">
                  {fullName}
                </h1>
                <p className="text-[10px] font-medium text-neutral-500 tracking-[0.18em] uppercase truncate max-w-[200px]">
                  {s.department_name || "Student"}
                </p>
              </motion.div>

              {/* Meta rows */}
              <motion.div variants={gridStagger}>
                <MetaRow label="Admission No" value={s.admission_number} mono />
                <MetaRow label="College" value={s.college_name} />
                <MetaRow label="HOD" value={s.hod_name} />
                <MetaRow label="Academic Year" value={s.academic_year} />

                {/* Status badge row */}
                <motion.div
                  variants={fadeUp}
                  className="flex items-center justify-between pt-3"
                >
                  <span className="text-[9px] font-semibold text-neutral-500 uppercase tracking-[0.18em]">
                    Status
                  </span>
                  <span className="text-[11px] font-semibold text-cyan-300 bg-cyan-500/10 border border-cyan-500/25 px-3 py-1 rounded-lg tracking-wide">
                    Semester {s.semester}
                  </span>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Parent card */}
          <motion.div
            variants={fadeUp}
            className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden"
          >
            <div className="h-[3px] w-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />
            <div className="p-5">
              <SectionHeader
                icon={Users}
                label="Parent & Guardian"
                iconClass="text-amber-400"
              />
              <motion.div variants={gridStagger}>
                <MetaRow label="Guardian Name" value={s.parent_name} />
                <MetaRow label="Guardian Contact" value={s.parent_phone} />
              </motion.div>
            </div>
          </motion.div>

        </motion.div>

        {/* ── RIGHT PANEL ── */}
        <motion.div
          variants={stagger}
          className="lg:col-span-8 space-y-5"
        >

          {/* Personal section */}
          <motion.div
            variants={fadeUp}
            className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden"
          >
            <div className="h-[3px] w-full bg-gradient-to-r from-violet-600 via-violet-400 to-violet-600" />
            <div className="p-5">
              <SectionHeader
                icon={User}
                label="Personal Record"
                iconClass="text-violet-400"
              />
              <motion.div
                variants={gridStagger}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                <InfoCard icon={User} label="Full Name" value={fullName} iconClass="text-violet-400" />
                <InfoCard icon={Calendar} label="Date of Birth" value={s.date_of_birth} iconClass="text-violet-400" />
                <InfoCard icon={User} label="Gender" value={s.gender} iconClass="text-violet-400" />
                <InfoCard icon={Mail} label="Email Address" value={s.email} iconClass="text-violet-400" />
                <InfoCard icon={Phone} label="Phone Number" value={s.phone} iconClass="text-violet-400" />
              </motion.div>
            </div>
          </motion.div>

          {/* Academic section */}
          <motion.div
            variants={fadeUp}
            className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden"
          >
            <div className="h-[3px] w-full bg-gradient-to-r from-cyan-600 via-cyan-400 to-cyan-600" />
            <div className="p-5">
              <SectionHeader
                icon={GraduationCap}
                label="Academic Record"
                iconClass="text-cyan-400"
              />
              <motion.div
                variants={gridStagger}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                <InfoCard icon={Building2} label="Department" value={s.department_name} iconClass="text-cyan-400" />
                <InfoCard icon={School} label="College" value={s.college_name} iconClass="text-cyan-400" />
                <InfoCard icon={BriefcaseBusiness} label="Head of Department" value={s.hod_name} iconClass="text-cyan-400" />
                <InfoCard icon={Hash} label="Roll Number" value={s.roll_number} iconClass="text-cyan-400" />
                <InfoCard icon={Hash} label="Admission Number" value={s.admission_number} iconClass="text-cyan-400" />
                <InfoCard icon={Calendar} label="Academic Year" value={s.academic_year} iconClass="text-cyan-400" />
                <InfoCard icon={Bookmark} label="Semester" value={`Semester ${s.semester}`} iconClass="text-cyan-400" />
              </motion.div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </motion.div>
  );
}

export default Profile;