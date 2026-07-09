// ProfileSummaryCard.jsx
// Reusable compact identity card for dashboard headers.
// Shows contextual information: college, user name, email/roll, department, role badge.
// No glassmorphism. No glow. Enterprise SaaS design.
import { motion } from "framer-motion";
import { Building2, GraduationCap, BookOpen } from "lucide-react";

const ROLE_BADGE = {
  COLLEGE_ADMIN: { label: "College Admin", className: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  HOD:           { label: "HOD",           className: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
  STUDENT:       { label: "Student",       className: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
};

/**
 * ProfileSummaryCard
 *
 * Props:
 *  - role            : "COLLEGE_ADMIN" | "HOD" | "STUDENT"
 *  - collegeName     : string | undefined
 *  - userName        : string
 *  - userEmail       : string | undefined
 *  - departmentName  : string | undefined
 *  - rollNumber      : string | undefined   (Student only)
 *  - semester        : number | string | undefined (Student only)
 */
export default function ProfileSummaryCard({
  role,
  collegeName,
  userName,
  userEmail,
  departmentName,
  rollNumber,
  semester,
}) {
  const badge = ROLE_BADGE[role];

  const initials = userName
    ? userName.trim().split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-neutral-900 border border-neutral-800 rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4"
    >
      {/* Avatar */}
      <div className="shrink-0 w-10 h-10 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-sm font-semibold text-neutral-200 select-none">
        {initials}
      </div>

      {/* Identity info */}
      <div className="flex-1 min-w-0">
        {/* College name — most prominent */}
        {collegeName && (
          <div className="flex items-center gap-1.5 mb-1">
            <Building2 className="h-3 w-3 text-neutral-500 shrink-0" />
            <p className="text-xs font-semibold text-neutral-300 tracking-wide truncate">
              {collegeName}
            </p>
          </div>
        )}

        {/* User name */}
        <p className="text-sm font-semibold text-white tracking-tight leading-snug truncate">
          {userName}
        </p>

        {/* Email or roll number */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
          {userEmail && (
            <p className="text-[12px] text-neutral-500 truncate">{userEmail}</p>
          )}
          {rollNumber && (
            <p className="text-[12px] text-neutral-500 font-mono">#{rollNumber}</p>
          )}
          {departmentName && (
            <span className="inline-flex items-center gap-1 text-[11px] text-neutral-500">
              <GraduationCap className="h-3 w-3 shrink-0" />
              {departmentName}
            </span>
          )}
          {semester && (
            <span className="inline-flex items-center gap-1 text-[11px] text-neutral-500">
              <BookOpen className="h-3 w-3 shrink-0" />
              Semester {semester}
            </span>
          )}
        </div>
      </div>

      {/* Role badge — right-aligned */}
      {badge && (
        <div className="shrink-0">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-[11px] font-semibold tracking-wide ${badge.className}`}
          >
            {badge.label}
          </span>
        </div>
      )}
    </motion.div>
  );
}
