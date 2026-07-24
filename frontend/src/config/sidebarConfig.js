import { 
  LayoutDashboard, 
  Building2, 
  ClipboardList, 
  Users,
  Bell,
  BellRing,
  User,
  GraduationCap,
  BookOpen,
  Calendar,
  ClipboardCheck,
  MessageSquareWarning,
  DollarSign,
  Search
} from "lucide-react";
import { ROUTES } from "../utils/constants";

export const adminNavSections = [
  {
    title: "Administration",
    items: [
      { path: ROUTES.DASHBOARD, label: "Dashboard", icon: LayoutDashboard },
    ]
  },
  {
    title: "Entities",
    items: [
      { path: ROUTES.COLLEGES, label: "Colleges", icon: Building2 },
      { path: ROUTES.COLLEGE_REQUESTS, label: "College Requests", icon: ClipboardList },
      { path: "/admin/college-admins", label: "College Admins", icon: Users },
    ]
  }
];

export const collegeAdminNavSections = [
  {
    title: "Administration",
    items: [
      { path: "/college-admin", label: "Dashboard", icon: LayoutDashboard },
      { path: "/college-admin/departments", label: "Departments", icon: Building2 },
      { path: "/college-admin/hods", label: "HODs", icon: Users },
    ]
  },
  {
    title: "Communication",
    items: [
      { path: "/college-admin/notices", label: "Notice Management", icon: Bell },
      { path: "/college-admin/complaints", label: "Complaint Management", icon: MessageSquareWarning },
    ]
  }
];

export const hodNavSections = [
  {
    title: "Administration",
    items: [
      { path: "/hod", label: "Dashboard", icon: LayoutDashboard },
      { path: "/hod/students", label: "Students", icon: Users },
    ]
  },
  {
    title: "Academic",
    items: [
      { path: "/hod/subjects", label: "Subjects", icon: BookOpen },
      { path: "/hod/notices", label: "Notice Management", icon: Bell },
      { path: "/hod/assignments", label: "Assignment Management", icon: ClipboardList },
      { path: "/hod/exams", label: "Exam Management", icon: Calendar },
      { path: "/hod/marks", label: "Marks Management", icon: GraduationCap },
      { path: "/hod/attendance", label: "Attendance", icon: ClipboardCheck },
      { path: "/hod/fees", label: "Fee Management", icon: DollarSign },
      { path: "/hod/complaints", label: "Complaint Management", icon: MessageSquareWarning },
    ]
  }
];

export const studentNavSections = [
  {
    title: "Academic",
    items: [
      { path: "/student", label: "Dashboard", icon: LayoutDashboard },
      { path: "/student/notices", label: "Notices", icon: Bell },
      { path: "/student/assignments", label: "Assignments", icon: ClipboardList },
      { path: "/student/exams", label: "Examinations", icon: Calendar },
      { path: "/student/marks", label: "My Marks", icon: GraduationCap },
      { path: "/student/attendance", label: "Attendance", icon: ClipboardCheck },
      { path: "/student/fees", label: "Fees", icon: DollarSign },
      { path: "/student/complaints", label: "Complaints", icon: MessageSquareWarning },
      { path: "/student/lost-found", label: "Lost & Found", icon: Search },
    ]
  },
  {
    title: "System",
    items: [
      { path: "/student/notifications", label: "Notifications", icon: BellRing },
      { path: "/student/profile", label: "Profile", icon: User },
    ]
  }
];
