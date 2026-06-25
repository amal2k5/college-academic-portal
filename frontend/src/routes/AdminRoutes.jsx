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

import HODDashboard from "../pages/hod/HODDashboard";
import Students from "../pages/hod/Students";
import StudentCreate from "../pages/hod/StudentCreate";
import StudentEdit from "../pages/hod/StudentEdit";
import StudentDashboard from "../pages/student/StudentDashboard";
import StudentProfile from "../pages/student/Profile";
import StudentLayout from "../layouts/StudentLayout"


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
    </Routes>
  );
}

export default AdminRoutes;
