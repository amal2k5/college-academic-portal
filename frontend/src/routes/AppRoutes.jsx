import { Routes, Route } from "react-router-dom";
import Login from "../pages/admin/auth/Login";
import SetupPassword from "../pages/admin/auth/SetPassword";
import PublicLayout from "../layouts/PublicLayout";
import LandingPage from "../pages/LandingPage";
import CollegeRegistrationPage from "../pages/CollegeRegistrationPage";
import AdminRoutes from "./AdminRoutes";




function AppRoutes() {
  return (
    <Routes>

      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<CollegeRegistrationPage />} />
      </Route>

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/setup-password/:token" element={<SetupPassword />} />

      {/* Protected Routes */}
      <Route path="/*" element={<AdminRoutes />} />

    </Routes>
  );
}

export default AppRoutes;