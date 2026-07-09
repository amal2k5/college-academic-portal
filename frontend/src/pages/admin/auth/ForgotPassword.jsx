import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { GraduationCap, Mail, ArrowLeft, Send } from "lucide-react";
import { forgotPassword } from "../../../services/authService";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: i * 0.07 },
  }),
};

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    if (!email.trim()) {
      setEmailError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (emailError) setEmailError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const data = await forgotPassword(email);
      toast.success(data.message || "OTP sent! Check your email.");
      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      const res = err.response?.data;
      const message =
        res?.message ||
        res?.detail ||
        res?.email?.[0] ||
        "Something went wrong. Please try again.";

      if (res?.email) {
        setEmailError(Array.isArray(res.email) ? res.email[0] : res.email);
      } else {
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
            Forgot Password
          </h1>
          <p className="text-[12px] text-neutral-500 mt-1 tracking-wide text-center">
            Enter your registered email and we'll send you an OTP.
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
            {/* Email field */}
            <div>
              <label
                htmlFor="forgot-email"
                className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-[0.18em] mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Mail size={14} strokeWidth={1.6} className="text-neutral-600" />
                </div>
                <input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={handleChange}
                  placeholder="name@college.com"
                  disabled={loading}
                  className={`w-full bg-neutral-800 border rounded-xl py-3 pl-10 pr-4 text-[13px] text-neutral-100 placeholder-neutral-600 focus:outline-none focus:ring-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                    emailError
                      ? "border-rose-500/60 focus:ring-rose-500/20 focus:border-rose-500"
                      : "border-neutral-700 focus:ring-indigo-500/20 focus:border-indigo-500"
                  }`}
                />
              </div>
              {emailError && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1.5 text-[11px] text-rose-400"
                >
                  {emailError}
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
                id="send-otp-btn"
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
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <Send size={14} strokeWidth={1.8} />
                    Send OTP
                  </>
                )}
              </button>
            </motion.div>

            <div className="text-center pt-1">
              <Link
                to="/login"
                className="inline-block text-[11px] font-semibold text-neutral-500 hover:text-neutral-200 uppercase tracking-[0.18em] transition-colors duration-200"
              >
                Remember your password?
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

export default ForgotPassword;
