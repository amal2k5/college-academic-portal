import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import AdminLayout from "../layouts/AdminLayout";
import CollegeAdminLayout from "../layouts/CollegeAdminLayout";
import HODLayout from "../layouts/HODLayout";

import Dashboard from "../pages/admin/Dashboard";
import Departments from "../pages/admin/department/Departments";

import CollegeManagement from "../pages/college/CollegeManagement";
import CollegeAdmins from "../pages/admin/collegeAdmins";

import CollegeDashboard from "../pages/CollegeAdmin/Dashboard";
import HODs from "../pages/CollegeAdmin/HODs";
import NoticeManagementPage from "../pages/CollegeAdmin/NoticeManagementPage";

import HODDashboard from "../pages/hod/HODDashboard";
import Students from "../pages/hod/Students";
import StudentCreate from "../pages/hod/StudentCreate";
import StudentEdit from "../pages/hod/StudentEdit";
import HODNoticeManagementPage from "../pages/hod/NoticeManagementPage";
import AssignmentManagementPage from "../pages/hod/AssignmentManagementPage";
import MarksManagement from "../pages/hod/MarksManagement";
import SubjectManagement from "../pages/hod/SubjectManagement";
import ExamManagement from "../pages/hod/ExamManagement";
import AttendanceManagement from "../pages/hod/AttendanceManagement";

import StudentDashboard from "../pages/student/StudentDashboard";
import StudentProfile from "../pages/student/Profile";
import StudentLayout from "../layouts/StudentLayout";
import CollegeRequestsPage from "../pages/admin/CollegeRequestsPage";
import NoticeManagement from "../pages/collegeAdmin/NoticeManagementPage";
import NoticesPage from "../pages/student/NoticesPage";
import AssignmentsPage from "../pages/student/AssignmentsPage";
import NotificationsPage from "../pages/student/NotificationsPage";
import MarksPage from "../pages/student/MarksPage";
import StudentExams from "../pages/student/Exams";
import StudentAttendance from "../pages/student/StudentAttendance";

import StudentComplaintSubmission from "../pages/student/ComplaintSubmissionPage";
import StudentComplaintTracking from "../pages/student/ComplaintTrackingPage";
import HODComplaintManagement from "../pages/hod/ComplaintManagementPage";
import CollegeAdminComplaintManagement from "../pages/CollegeAdmin/ComplaintManagementPage";

function AdminRoutes() {
  return (
    <Routes>
      {/* PLATFORM ADMIN */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["PLATFORM_ADMIN"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/colleges" element={<CollegeManagement />} />
        <Route path="/admin/college-admins" element={<CollegeAdmins />} />
        <Route path="/admin/hods" element={<HODs />} />
        <Route
          path="/admin/college-requests"
          element={<CollegeRequestsPage />}
        />
      </Route>

      {/* COLLEGE ADMIN */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["COLLEGE_ADMIN"]}>
            <CollegeAdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/college-admin" element={<CollegeDashboard />} />
        <Route path="/college-admin/departments" element={<Departments />} />
        <Route path="/college-admin/hods" element={<HODs />} />
        <Route path="/college-admin/notices" element={<NoticeManagementPage />} />

        <Route
  path="/college-admin/notices"
  element={<NoticeManagement />}
/>

        <Route path="/college-admin/complaints" element={<CollegeAdminComplaintManagement />} />

      </Route>

      {/* HOD */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["HOD"]}>
            <HODLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/hod" element={<HODDashboard />} />
        <Route path="/hod/students" element={<Students />} />
        <Route path="/hod/students/create" element={<StudentCreate />} />
        <Route path="/hod/students/:id/edit" element={<StudentEdit />} />
        <Route path="/hod/notices" element={<HODNoticeManagementPage />} />
        <Route path="/hod/assignments" element={<AssignmentManagementPage />} />
        <Route path="/hod/marks" element={<MarksManagement />} />
        <Route path="/hod/subjects" element={<SubjectManagement />} />
        <Route path="/hod/exams" element={<ExamManagement />} />
        <Route path="/hod/attendance" element={<AttendanceManagement />} />
        <Route path="/hod/complaints" element={<HODComplaintManagement />} />
      </Route>

      {/* STUDENT */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/profile" element={<StudentProfile />} />
      </Route>

      <Route
  element={
    <ProtectedRoute allowedRoles={["STUDENT"]}>
      <StudentLayout />
    </ProtectedRoute>
  }
>

  <Route path="/student/notices" element={<NoticesPage />} />
  <Route path="/student/assignments" element={<AssignmentsPage />} />
  <Route path="/student/marks" element={<MarksPage />} />
  <Route path="/student/exams" element={<StudentExams />} />
  <Route path="/student/attendance" element={<StudentAttendance />} />
  <Route path="/student/notifications" element={<NotificationsPage />} />
  <Route path="/student/complaints/submit" element={<StudentComplaintSubmission />} />
  <Route path="/student/complaints/track" element={<StudentComplaintTracking />} />
</Route>
    </Routes>
  );
}

export default AdminRoutes;