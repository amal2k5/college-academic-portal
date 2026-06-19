import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import AdminLayout        from "../layouts/AdminLayout";
import HODLayout          from "../layouts/HODLayout";
import CollegeAdminLayout from "../layouts/CollegeAdminLayout";

import Dashboard         from "../pages/admin/Dashboard";
import Departments       from "../pages/admin/department/Departments";
import Students          from "../pages/admin/Students";
import CollegeManagement from "../pages/college/CollegeManagement";
import CollegeAdmins     from "../pages/admin/collegeAdmins";
import HODDashboard      from "../pages/hod/HODDashboard";
import CollegeDashboard  from "../pages/CollegeAdmin/Dashboard";
import HODs              from "../pages/CollegeAdmin/HODs";

function AdminRoutes() {
  return (
    <Routes>

      {/* ── PLATFORM_ADMIN ── College CRUD + Department CRUD ──────────────── */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["PLATFORM_ADMIN"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin"                  element={<Dashboard />} />
        <Route path="/admin/colleges"         element={<CollegeManagement />} />
        <Route path="/admin/college-admins"   element={<CollegeAdmins />} />
        <Route path="/admin/hods"             element={<HODs />} />
        <Route path="/admin/students"         element={<Students />} />
      </Route>

      {/* ── COLLEGE_ADMIN ── HOD Management only, NO department routes ─────── */}
<Route
  element={
    <ProtectedRoute
      allowedRoles={[
        "COLLEGE_ADMIN"
      ]}
    >
      <CollegeAdminLayout />
    </ProtectedRoute>
  }
>
  <Route
    path="/college-admin"
    element={<CollegeDashboard />}
  />

  <Route
    path="/college-admin/departments"
    element={<Departments />}
  />

  <Route
    path="/college-admin/hods"
    element={<HODs />}
  />
</Route>

    </Routes>
  );
}

export default AdminRoutes;