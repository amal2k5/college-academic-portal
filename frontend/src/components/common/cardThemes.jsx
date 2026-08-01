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
} from "lucide-react";

export const cardThemes = {
  students: {
    gradient: "from-indigo-700 via-blue-700 to-cyan-600",
    shadowColor: "shadow-blue-900/20 hover:shadow-blue-700/40",
    defaultIcon: GraduationCap,
    illustration: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        role="presentation"
        className="w-full h-full max-w-[130px] max-h-[130px] text-white pointer-events-none"
      >
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
  },
  departments: {
    gradient: "from-emerald-700 via-teal-700 to-cyan-600",
    shadowColor: "shadow-teal-900/20 hover:shadow-teal-700/40",
    defaultIcon: Building2,
    illustration: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        role="presentation"
        className="w-full h-full max-w-[130px] max-h-[130px] text-white pointer-events-none"
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
    gradient: "from-violet-700 via-purple-700 to-fuchsia-600",
    shadowColor: "shadow-purple-900/20 hover:shadow-purple-700/40",
    defaultIcon: UserCog,
    illustration: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        role="presentation"
        className="w-full h-full max-w-[130px] max-h-[130px] text-white pointer-events-none"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
        <path d="M19 8l2 2 4-4" />
      </svg>
    ),
  },
  attendance: {
    gradient: "from-green-700 via-emerald-700 to-teal-600",
    shadowColor: "shadow-emerald-900/20 hover:shadow-emerald-700/40",
    defaultIcon: CalendarCheck,
    illustration: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        role="presentation"
        className="w-full h-full max-w-[130px] max-h-[130px] text-white pointer-events-none"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <path d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4" />
      </svg>
    ),
  },
  assignments: {
    gradient: "from-pink-700 via-rose-600 to-red-500",
    shadowColor: "shadow-rose-900/20 hover:shadow-rose-700/40",
    defaultIcon: Clipboard,
    illustration: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        role="presentation"
        className="w-full h-full max-w-[130px] max-h-[130px] text-white pointer-events-none"
      >
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        <path d="M9 12h6M9 16h6" />
      </svg>
    ),
  },
  notices: {
    gradient: "from-orange-600 via-amber-500 to-yellow-500",
    shadowColor: "shadow-amber-900/20 hover:shadow-amber-700/40",
    defaultIcon: Megaphone,
    illustration: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        role="presentation"
        className="w-full h-full max-w-[130px] max-h-[130px] text-white pointer-events-none"
      >
        <path d="M3 11l18-5v12L3 14v-3z" />
        <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
      </svg>
    ),
  },
  fees: {
    gradient: "from-cyan-700 via-sky-700 to-blue-600",
    shadowColor: "shadow-sky-900/20 hover:shadow-sky-700/40",
    defaultIcon: Receipt,
    illustration: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        role="presentation"
        className="w-full h-full max-w-[130px] max-h-[130px] text-white pointer-events-none"
      >
        <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </svg>
    ),
  },
  exams: {
    gradient: "from-red-700 via-orange-600 to-amber-500",
    shadowColor: "shadow-orange-900/20 hover:shadow-orange-700/40",
    defaultIcon: Award,
    illustration: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        role="presentation"
        className="w-full h-full max-w-[130px] max-h-[130px] text-white pointer-events-none"
      >
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
      </svg>
    ),
  },
  default: {
    gradient: "from-neutral-800 via-zinc-800 to-neutral-900",
    shadowColor: "shadow-neutral-900/30 hover:shadow-neutral-800/50",
    defaultIcon: Layers,
    illustration: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        role="presentation"
        className="w-full h-full max-w-[130px] max-h-[130px] text-white pointer-events-none"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
};

export function getCardTheme(titleOrLabel = "") {
  const key = (titleOrLabel || "").toString().toLowerCase().trim();
  if (key.includes("student")) return cardThemes.students;
  if (key.includes("depart") || key.includes("college") || key.includes("institution")) return cardThemes.departments;
  if (key.includes("hod")) return cardThemes.hods;
  if (key.includes("attend")) return cardThemes.attendance;
  if (key.includes("assign")) return cardThemes.assignments;
  if (key.includes("notice") || key.includes("alert") || key.includes("request")) return cardThemes.notices;
  if (key.includes("fee") || key.includes("payment")) return cardThemes.fees;
  if (key.includes("exam") || key.includes("mark") || key.includes("result") || key.includes("score") || key.includes("test")) return cardThemes.exams;
  return cardThemes.default;
}
