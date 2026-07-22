import { Routes, Route } from "react-router-dom";
import Login from "../pages/admin/auth/Login";
import SetupPassword from "../pages/admin/auth/SetPassword";
import ForgotPassword from "../pages/admin/auth/ForgotPassword";
import VerifyOTP from "../pages/admin/auth/VerifyOTP";
import ResetPassword from "../pages/admin/auth/ResetPassword";
import PublicLayout from "../layouts/PublicLayout";
import LandingPage from "../pages/LandingPage";
import CollegeRegistrationPage from "../pages/CollegeRegistrationPage";
import AdminRoutes from "./AdminRoutes";
import RazorpayTestPage from "../pages/testing/RazorpayTestPage";




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
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Testing Route */}
      <Route path="/testing/razorpay" element={<RazorpayTestPage />} />

      {/* Protected Routes */}
      <Route path="/*" element={<AdminRoutes />} />

    </Routes>
  );
}

export default AppRoutes;