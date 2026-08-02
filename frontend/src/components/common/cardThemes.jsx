import React from "react";
import {
  GraduationCap,
  Building2,
  UserCog,
  CalendarCheck,
  Clipboard,
  Megaphone,
  Receipt,
  Award,
  Layers,
  Bell,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Users,
} from "lucide-react";

export const cardThemes = {
  students: {
    gradient: "from-slate-900 via-slate-900 to-indigo-950/80",
    shadowColor: "shadow-xl hover:shadow-indigo-950/50 hover:border-indigo-500/20",
    iconContainer: "bg-indigo-500/15 text-indigo-400 border border-indigo-500/20",
    badgeClass: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
    defaultIcon: GraduationCap,
    illustration: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        role="presentation"
        className="w-full h-full text-indigo-300/80 pointer-events-none"
      >
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
  },
  departments: {
    gradient: "from-slate-900 via-slate-900 to-emerald-950/80",
    shadowColor: "shadow-xl hover:shadow-emerald-950/50 hover:border-emerald-500/20",
    iconContainer: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
    badgeClass: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    defaultIcon: Building2,
    illustration: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        role="presentation"
        className="w-full h-full text-emerald-300/80 pointer-events-none"
      >
        <path d="M3 21h18" />
        <path d="M3 10h18" />
        <path d="M5 6l7-3 7 3" />
        <path d="M4 10v11" />
        <path d="M20 10v11" />
        <path d="M8 10v11" />
        <path d="M12 10v11" />
        <path d="M16 10v11" />
      </svg>
    ),
  },
  hods: {
    gradient: "from-slate-900 via-slate-900 to-violet-950/80",
    shadowColor: "shadow-xl hover:shadow-violet-950/50 hover:border-violet-500/20",
    iconContainer: "bg-violet-500/15 text-violet-400 border border-violet-500/20",
    badgeClass: "bg-violet-500/10 text-violet-300 border-violet-500/20",
    defaultIcon: UserCog,
    illustration: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        role="presentation"
        className="w-full h-full text-violet-300/80 pointer-events-none"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
        <path d="M19 8l2 2 4-4" />
      </svg>
    ),
  },
  attendance: {
    gradient: "from-slate-900 via-slate-900 to-emerald-950/80",
    shadowColor: "shadow-xl hover:shadow-emerald-950/50 hover:border-emerald-500/20",
    iconContainer: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
    badgeClass: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    defaultIcon: CalendarCheck,
    illustration: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        role="presentation"
        className="w-full h-full text-emerald-300/80 pointer-events-none"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <path d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4" />
      </svg>
    ),
  },
  assignments: {
    gradient: "from-slate-900 via-slate-900 to-violet-950/80",
    shadowColor: "shadow-xl hover:shadow-violet-950/50 hover:border-violet-500/20",
    iconContainer: "bg-violet-500/15 text-violet-400 border border-violet-500/20",
    badgeClass: "bg-violet-500/10 text-violet-300 border-violet-500/20",
    defaultIcon: Clipboard,
    illustration: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        role="presentation"
        className="w-full h-full text-violet-300/80 pointer-events-none"
      >
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        <path d="M9 12h6M9 16h6" />
      </svg>
    ),
  },
  notices: {
    gradient: "from-slate-900 via-slate-900 to-amber-950/80",
    shadowColor: "shadow-xl hover:shadow-amber-950/50 hover:border-amber-500/20",
    iconContainer: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
    badgeClass: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    defaultIcon: Megaphone,
    illustration: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        role="presentation"
        className="w-full h-full text-amber-300/80 pointer-events-none"
      >
        <path d="M3 11l18-5v12L3 14v-3z" />
        <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
      </svg>
    ),
  },
  fees: {
    gradient: "from-slate-900 via-slate-900 to-cyan-950/80",
    shadowColor: "shadow-xl hover:shadow-cyan-950/50 hover:border-cyan-500/20",
    iconContainer: "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20",
    badgeClass: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
    defaultIcon: Receipt,
    illustration: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        role="presentation"
        className="w-full h-full text-cyan-300/80 pointer-events-none"
      >
        <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </svg>
    ),
  },
  exams: {
    gradient: "from-slate-900 via-slate-900 to-sky-950/80",
    shadowColor: "shadow-xl hover:shadow-sky-950/50 hover:border-sky-500/20",
    iconContainer: "bg-sky-500/15 text-sky-400 border border-sky-500/20",
    badgeClass: "bg-sky-500/10 text-sky-300 border-sky-500/20",
    defaultIcon: Award,
    illustration: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        role="presentation"
        className="w-full h-full text-sky-300/80 pointer-events-none"
      >
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
      </svg>
    ),
  },
  alerts: {
    gradient: "from-slate-900 via-slate-900 to-red-950/80",
    shadowColor: "shadow-xl hover:shadow-red-950/50 hover:border-red-500/20",
    iconContainer: "bg-red-500/15 text-red-400 border border-red-500/20",
    badgeClass: "bg-red-500/10 text-red-300 border-red-500/20",
    defaultIcon: AlertTriangle,
    illustration: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        role="presentation"
        className="w-full h-full text-red-300/80 pointer-events-none"
      >
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  default: {
    gradient: "from-slate-900 via-slate-900 to-slate-800/80",
    shadowColor: "shadow-xl hover:shadow-slate-800/50 hover:border-slate-500/20",
    iconContainer: "bg-slate-500/15 text-slate-300 border border-slate-500/20",
    badgeClass: "bg-slate-500/10 text-slate-300 border-slate-500/20",
    defaultIcon: Layers,
    illustration: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        role="presentation"
        className="w-full h-full text-slate-400/80 pointer-events-none"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
};

export function getCardTheme(titleOrLabel = "") {
  const key = (titleOrLabel || "").toString().toLowerCase().trim();
  if (key.includes("student")) return cardThemes.students;
  if (key.includes("hod")) return cardThemes.hods;
  if (key.includes("attend")) return cardThemes.attendance;
  if (key.includes("assign")) return cardThemes.assignments;
  if (key.includes("alert") || key.includes("warn") || key.includes("reject") || key.includes("inactive")) return cardThemes.alerts;
  if (key.includes("notice") || key.includes("request") || key.includes("pending")) return cardThemes.notices;
  if (key.includes("fee") || key.includes("payment")) return cardThemes.fees;
  if (key.includes("exam") || key.includes("mark") || key.includes("result") || key.includes("score") || key.includes("test") || key.includes("subject") || key.includes("total college")) return cardThemes.exams;
  if (key.includes("depart") || key.includes("college") || key.includes("institution") || key.includes("active") || key.includes("resolved")) return cardThemes.departments;
  return cardThemes.default;
}
