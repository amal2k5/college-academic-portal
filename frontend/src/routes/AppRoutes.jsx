import { Routes, Route, Navigate } from "react-router-dom";
import AdminRoutes from "./AdminRoutes";
import Login from "../pages/admin/auth/Login";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={<AdminRoutes />} />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default AppRoutes;