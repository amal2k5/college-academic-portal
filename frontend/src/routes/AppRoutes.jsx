import { Routes, Route }
from "react-router-dom";

import Login
from "../pages/admin/auth/Login";

import AdminRoutes
from "./AdminRoutes";

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/*"
        element={<AdminRoutes />}
      />
    </Routes>
  );
}

export default AppRoutes;