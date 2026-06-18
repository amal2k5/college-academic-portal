import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/admin/auth/Login";
import SetupPassword from "../pages/admin/auth/SetPassword";
import AdminRoutes from "./AdminRoutes";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/setup-password/:token"
        element={<SetupPassword />}
      />

      <Route path="/*" element={<AdminRoutes />} />

      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default AppRoutes;