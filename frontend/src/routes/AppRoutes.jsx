import { Routes, Route }
from "react-router-dom";

import Login
from "../pages/admin/auth/Login";



import AdminRoutes
from "./AdminRoutes";
import SetupPassword from "../pages/admin/auth/SetPassword";

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
  path="/setup-password/:token"
  element={<SetupPassword />}
/>

      <Route
        path="/*"
        element={<AdminRoutes />}
      />
    </Routes>
  );
}

export default AppRoutes;