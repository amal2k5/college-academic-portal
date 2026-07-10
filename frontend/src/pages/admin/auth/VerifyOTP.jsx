import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { GraduationCap, ShieldCheck, ArrowLeft } from "lucide-react";
import { verifyOTP } from "../../../services/authService";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: i * 0.07 },
  }),
};

function VerifyOTP() {
  const location = useLocation();
  const navigate = useNavigate();

  // Prefer navigation state; fall back to query param
  const params = new URLSearchParams(location.search);
  const email = location.state?.email || params.get("email") || "";

  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!otp.trim()) {
      setOtpError("OTP is required");
      return false;
    }
    if (!/^\d{6}$/.test(otp.trim())) {
      setOtpError("OTP must be exactly 6 digits");
      return false;
    }
    setOtpError("");
    return true;
  };

  const handleChange = (e) => {
    // Allow only digits, max 6
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(val);
    if (otpError) setOtpError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const data = await verifyOTP(email, otp.trim());
      const resetToken = data.reset_token;

      sessionStorage.setItem("reset_token", resetToken);
      toast.success(data.message || "OTP verified successfully.");
      navigate("/reset-password");
    } catch (err) {
      const res = err.response?.data;
      const message =
        res?.message ||
        res?.detail ||
        res?.otp?.[0] ||
        "Invalid or expired OTP. Please try again.";

      if (res?.otp) {
        setOtpError(Array.isArray(res.otp) ? res.otp[0] : res.otp);
      } else {
        setOtpError(message);
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-indigo-600/8 rounded-full blur-[100px] pointer-events-none" />

      {/* Back to forgot password */}
      <motion.div
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="absolute top-6 left-6"
      >
        <Link
          to="/forgot-password"
          className="inline-flex items-center gap-2 text-[11px] font-semibold text-neutral-500 hover:text-neutral-200 uppercase tracking-[0.18em] transition-colors duration-200 group"
        >
          <ArrowLeft
            size={13}
            strokeWidth={2}
            className="group-hover:-translate-x-0.5 transition-transform duration-200"
          />
          Back
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
            Verify OTP
          </h1>
          <p className="text-[12px] text-neutral-500 mt-1 tracking-wide text-center">
            Enter the 6-digit code sent to{" "}
            {email ? (
              <span className="text-indigo-400 font-medium">{email}</span>
            ) : (
              "your email"
            )}
            .
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
            {/* OTP field */}
            <div>
              <label
                htmlFor="otp-input"
                className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-[0.18em] mb-2"
              >
                One-Time Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <ShieldCheck size={14} strokeWidth={1.6} className="text-neutral-600" />
                </div>
                <input
                  id="otp-input"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={otp}
                  onChange={handleChange}
                  placeholder="••••••"
                  disabled={loading}
                  className={`w-full bg-neutral-800 border rounded-xl py-3 pl-10 pr-4 text-[13px] text-neutral-100 placeholder-neutral-600 focus:outline-none focus:ring-2 tracking-[0.4em] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                    otpError
                      ? "border-rose-500/60 focus:ring-rose-500/20 focus:border-rose-500"
                      : "border-neutral-700 focus:ring-indigo-500/20 focus:border-indigo-500"
                  }`}
                />
              </div>
              {otpError && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1.5 text-[11px] text-rose-400"
                >
                  {otpError}
                </motion.p>
              )}
            </div>

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
                id="verify-otp-btn"
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
                    Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </button>
            </motion.div>

            <div className="text-center pt-1">
              <Link
                to="/forgot-password"
                className="inline-block text-[11px] font-semibold text-neutral-500 hover:text-neutral-200 uppercase tracking-[0.18em] transition-colors duration-200"
              >
                Resend OTP
              </Link>
            </div>
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

export default VerifyOTP;
