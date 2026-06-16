import { Routes, Route } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";

import Dashboard from "../pages/admin/Dashboard";
import Colleges from "../pages/admin/Colleges";
import Departments from "../pages/admin/Departments";
import HODs from "../pages/admin/HODs";
import Students from "../pages/admin/Students";

function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/colleges" element={<Colleges />} />
        <Route path="/admin/departments" element={<Departments />} />
        <Route path="/admin/hods" element={<HODs />} />
        <Route path="/admin/students" element={<Students />} />
      </Route>
    </Routes>
  );
}

export default AdminRoutes;