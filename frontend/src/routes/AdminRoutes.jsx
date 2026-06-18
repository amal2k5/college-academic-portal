import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import AdminLayout from "../layouts/AdminLayout";
import HODLayout from "../layouts/HODLayout";

import Dashboard from "../pages/admin/Dashboard";
import Colleges from "../pages/admin/Colleges";
import Departments from "../pages/admin/Departments";
import HODs from "../pages/admin/HODs";
import Students from "../pages/admin/Students";

import HODDashboard from "../pages/hod/HODDashboard";
import CollegeAdminLayout from "../layouts/CollegeAdminLayout";
import CollegeDashboard from "../pages/CollegeAdmin/Dashboard";

function AdminRoutes() {
  return (
    <Routes>

      {/* PLATFORM ADMIN */}

      <Route
        element={
          <ProtectedRoute
            allowedRoles={[
              "PLATFORM_ADMIN",
            ]}
          >
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/admin"
          element={<Dashboard />}
        />

        <Route
          path="/admin/colleges"
          element={<Colleges />}
        />

        <Route
          path="/admin/departments"
          element={<Departments />}
        />

        <Route
          path="/admin/hods"
          element={<HODs />}
        />

        <Route
          path="/admin/students"
          element={<Students />}
        />
      </Route>

      {/* HOD */}

      <Route
        element={
          <ProtectedRoute
            allowedRoles={["HOD"]}
          >
            <HODLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/hod"
          element={<HODDashboard />}
        />
      </Route>

      <Route
  element={
    <ProtectedRoute
      allowedRoles={["COLLEGE_ADMIN"]}
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