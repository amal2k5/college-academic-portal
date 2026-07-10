import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { GraduationCap, Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react";
import { resetPassword } from "../../../services/authService";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: i * 0.07 },
  }),
};

function ResetPassword() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({ password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = { password: "", confirmPassword: "" };

    if (!form.password) {
      e.password = "Password is required";
    } else if (form.password.length < 8) {
      e.password = "Password must be at least 8 characters";
    }

    if (!form.confirmPassword) {
      e.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      e.confirmPassword = "Passwords do not match";
    }

    setErrors(e);
    return !e.password && !e.confirmPassword;
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const resetToken = sessionStorage.getItem("reset_token");
    if (!resetToken) {
      toast.error("Reset session expired. Please request a new OTP.");
      navigate("/forgot-password");
      return;
    }

    setLoading(true);
    try {
      const data = await resetPassword(resetToken, form.password, form.confirmPassword);
      toast.success(data.message || "Password reset successfully!");
      sessionStorage.removeItem("reset_token");
      navigate("/login");
    } catch (err) {
      const res = err.response?.data;
      const message =
        res?.message ||
        res?.detail ||
        "Failed to reset password. Please try again.";

      // Map backend field errors
      setErrors({
        password: res?.password
          ? Array.isArray(res.password) ? res.password[0] : res.password
          : "",
        confirmPassword: res?.confirm_password
          ? Array.isArray(res.confirm_password) ? res.confirm_password[0] : res.confirm_password
          : "",
      });

      if (!res?.password && !res?.confirm_password) {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch =
    form.password && form.confirmPassword && form.password === form.confirmPassword;

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-indigo-600/8 rounded-full blur-[100px] pointer-events-none" />

      {/* Back to login */}
      <motion.div
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="absolute top-6 left-6"
      >
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-[11px] font-semibold text-neutral-500 hover:text-neutral-200 uppercase tracking-[0.18em] transition-colors duration-200 group"
        >
          <ArrowLeft
            size={13}
            strokeWidth={2}
            className="group-hover:-translate-x-0.5 transition-transform duration-200"
          />
          Back to Login
        </Link>
      </motion.div>

      <div className="relative w-full max-w-sm">
        {/* Logo / heading */}
        <motion.div
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center mb-8"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center mb-4">
            <GraduationCap size={22} strokeWidth={2} className="text-white" />
          </div>
          <h1 className="text-[22px] font-semibold text-neutral-100 tracking-tight">
            Reset Password
          </h1>
          <p className="text-[12px] text-neutral-500 mt-1 tracking-wide text-center">
            Create a strong new password for your account.
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden"
        >
          <div className="h-[3px] w-full bg-gradient-to-r from-indigo-600 via-violet-500 to-indigo-600" />

          <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4">
            {/* New Password */}
            <div>
              <label
                htmlFor="new-password"
                className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-[0.18em] mb-2"
              >
                New Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Lock size={14} strokeWidth={1.6} className="text-neutral-600" />
                </div>
                <input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange("password")}
                  placeholder="Min. 8 characters"
                  disabled={loading}
                  className={`w-full bg-neutral-800 border rounded-xl py-3 pl-10 pr-10 text-[13px] text-neutral-100 placeholder-neutral-600 focus:outline-none focus:ring-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors.password
                      ? "border-rose-500/60 focus:ring-rose-500/20 focus:border-rose-500"
                      : "border-neutral-700 focus:ring-indigo-500/20 focus:border-indigo-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-neutral-600 hover:text-neutral-300 transition-colors duration-200 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff size={14} strokeWidth={1.6} />
                  ) : (
                    <Eye size={14} strokeWidth={1.6} />
                  )}
                </button>
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1.5 text-[11px] text-rose-400"
                >
                  {errors.password}
                </motion.p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-[0.18em] mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Lock size={14} strokeWidth={1.6} className="text-neutral-600" />
                </div>
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                  placeholder="Repeat your password"
                  disabled={loading}
                  className={`w-full bg-neutral-800 border rounded-xl py-3 pl-10 pr-10 text-[13px] text-neutral-100 placeholder-neutral-600 focus:outline-none focus:ring-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors.confirmPassword
                      ? "border-rose-500/60 focus:ring-rose-500/20 focus:border-rose-500"
                      : "border-neutral-700 focus:ring-indigo-500/20 focus:border-indigo-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-neutral-600 hover:text-neutral-300 transition-colors duration-200 cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={14} strokeWidth={1.6} />
                  ) : (
                    <Eye size={14} strokeWidth={1.6} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1.5 text-[11px] text-rose-400"
                >
                  {errors.confirmPassword}
                </motion.p>
              )}
            </div>

            {/* Password match indicator */}
            {form.password && form.confirmPassword && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center gap-1.5 text-[11px] ${
                  passwordsMatch ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                <CheckCircle size={12} strokeWidth={2} />
                {passwordsMatch ? "Passwords match" : "Passwords do not match"}
              </motion.div>
            )}

            {/* Submit button */}
            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="pt-2"
            >
              <button
                type="submit"
                id="reset-password-btn"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[13px] font-semibold py-3 rounded-xl transition-all duration-200 cursor-pointer"
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
                    />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </motion.div>
          </form>
        </motion.div>

        <motion.p
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-center text-[11px] text-neutral-600 mt-6 tracking-wide"
        >
          Access is granted by your institution administrator.
        </motion.p>
      </div>
    </div>
  );
}

export default ResetPassword;
