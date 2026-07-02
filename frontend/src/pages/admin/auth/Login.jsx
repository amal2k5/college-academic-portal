import { useState, useContext } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Eye, EyeOff, GraduationCap, Mail, Lock, ArrowLeft } from "lucide-react";
import { AuthContext } from "../../../context/AuthContext";
import { login } from "../../../services/authService";

const ROLE_ROUTES = {
  PLATFORM_ADMIN: "/admin",
  COLLEGE_ADMIN: "/college-admin",
  HOD: "/hod",
  STUDENT: "/student",
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: i * 0.07 },
  }),
};

const Field = ({ id, label, type, icon: Icon, value, onChange, error, placeholder, disabled, extra }) => (
  <div>
    <label
      htmlFor={id}
      className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-[0.18em] mb-2"
    >
      {label}
    </label>
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
        <Icon size={14} strokeWidth={1.6} className="text-neutral-600" />
      </div>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full bg-neutral-800 border rounded-xl py-3 pl-10 ${extra ? "pr-10" : "pr-4"} text-[13px] text-neutral-100 placeholder-neutral-600 focus:outline-none focus:ring-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
          error
            ? "border-rose-500/60 focus:ring-rose-500/20 focus:border-rose-500"
            : "border-neutral-700 focus:ring-indigo-500/20 focus:border-indigo-500"
        }`}
      />
      {extra}
    </div>
    {error && (
      <motion.p
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-1.5 text-[11px] text-rose-400"
      >
        {error}
      </motion.p>
    )}
  </div>
);

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const token = localStorage.getItem("access");
  const role = localStorage.getItem("role");

  if (token && ROLE_ROUTES[role]) {
    return <Navigate to={ROLE_ROUTES[role]} replace />;
  }

  const validate = () => {
    const e = { email: "", password: "" };
    if (!form.email.trim()) {
      e.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Enter a valid email address";
    }
    if (!form.password.trim()) {
      e.password = "Password is required";
    } else if (form.password.length < 6) {
      e.password = "Password must be at least 6 characters";
    }
    setErrors(e);
    return !e.email && !e.password;
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      loginUser(data);

      const route = ROLE_ROUTES[data.role];
      if (route) {
        toast.success("Welcome back!");
        navigate(route, { replace: true });
      } else {
        toast.warning("Unknown role. Please contact support.");
      }
    } catch (err) {
      const res = err.response?.data;
      const message =
        res?.message ||
        res?.detail ||
        res?.non_field_errors?.[0] ||
        "Invalid email or password.";

      toast.error(message);

      setErrors({
        email: res?.email
          ? Array.isArray(res.email) ? res.email[0] : res.email
          : err.response?.status === 400 || err.response?.status === 401
          ? message
          : "",
        password: res?.password
          ? Array.isArray(res.password) ? res.password[0] : res.password
          : err.response?.status === 400 || err.response?.status === 401
          ? message
          : "",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">

      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-indigo-600/8 rounded-full blur-[100px] pointer-events-none" />

      {/* Back to home — top left */}
      <motion.div
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="absolute top-6 left-6"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[11px] font-semibold text-neutral-500 hover:text-neutral-200 uppercase tracking-[0.18em] transition-colors duration-200 group"
        >
          <ArrowLeft
            size={13}
            strokeWidth={2}
            className="group-hover:-translate-x-0.5 transition-transform duration-200"
          />
          Home
        </Link>
      </motion.div>

      <div className="relative w-full max-w-sm">

        {/* Logo */}
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
            Welcome back
          </h1>
          <p className="text-[12px] text-neutral-500 mt-1 tracking-wide">
            Sign in to your portal account
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

            <Field
              id="email"
              label="Email Address"
              type="email"
              icon={Mail}
              value={form.email}
              onChange={handleChange("email")}
              error={errors.email}
              placeholder="name@college.com"
              disabled={loading}
            />

            <Field
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              icon={Lock}
              value={form.password}
              onChange={handleChange("password")}
              error={errors.password}
              placeholder="••••••••"
              disabled={loading}
              extra={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-neutral-600 hover:text-neutral-300 transition-colors duration-200 cursor-pointer"
                >
                  {showPassword
                    ? <EyeOff size={14} strokeWidth={1.6} />
                    : <Eye size={14} strokeWidth={1.6} />
                  }
                </button>
              }
            />

            <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible" className="pt-2">
              <button
                type="submit"
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
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </motion.div>

            <div className="text-center pt-2">
              <Link
                to="/forgot-password"
                className="inline-block text-[11px] font-semibold text-neutral-500 hover:text-neutral-200 uppercase tracking-[0.18em] transition-colors duration-200"
              >
                Forgot Password?
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

export default Login;