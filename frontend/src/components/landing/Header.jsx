import { Link } from "react-router-dom";
import { GraduationCap, ArrowRight, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axiosInstance from "../../services/axiosInstance";

const ease = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export default function Header() {
  const [stats, setStats] = useState({
    colleges: 0,
    students: 0,
    departments: 0,
  });
  const [loading, setLoading] = useState(true);

  // Fetch real statistics from your API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get('/auth/public/stats/'); // Fetching public platform stats
        setStats({
          colleges: response.data.colleges || 0,
          students: response.data.students || 0,
          departments: response.data.departments || 0,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        // Fallback to default values if API fails
        setStats({
          colleges: 0,
          students: 0,
          departments: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Format numbers with commas
  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K+';
    }
    return num + '+';
  };

  return (
    <>
      {/* ── NAVBAR ── */}
      <header className="w-full border-b border-neutral-800/60 bg-neutral-950/90 backdrop-blur-md text-white sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-6 py-3 sm:py-4">
          <Link to="/" className="flex items-center gap-1.5 sm:gap-2.5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
              <GraduationCap size={14} strokeWidth={2} className="text-white sm:size-[16px]" />
            </div>
            <span className="text-[13px] sm:text-[15px] font-semibold text-neutral-100 tracking-wide">
              AcadPortal
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <a
              href="#features"
              className="text-[13px] font-medium text-neutral-400 hover:text-neutral-100 transition-colors duration-200"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-[13px] font-medium text-neutral-400 hover:text-neutral-100 transition-colors duration-200"
            >
              How It Works
            </a>
            <a
              href="#why-us"
              className="text-[13px] font-medium text-neutral-400 hover:text-neutral-100 transition-colors duration-200"
            >
              Why Us
            </a>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <Link
              to="/login"
              className="text-[11px] sm:text-[12px] font-semibold text-neutral-400 hover:text-neutral-100 transition-colors duration-200 px-1.5 sm:px-3 py-1.5 sm:py-2 whitespace-nowrap"
            >
              Portal Login
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-1 sm:gap-2 text-[11px] sm:text-[12px] font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all duration-200 whitespace-nowrap"
            >
              Register College
              <ArrowRight size={12} strokeWidth={2} className="sm:size-[13px]" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative bg-neutral-950 text-white overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] sm:w-[600px] lg:w-[800px] h-[300px] sm:h-[400px] lg:h-[500px] bg-indigo-600/8 rounded-full blur-[80px] sm:blur-[100px] lg:blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[250px] sm:w-[350px] lg:w-[400px] h-[200px] sm:h-[250px] lg:h-[300px] bg-violet-600/5 rounded-full blur-[70px] sm:blur-[80px] lg:blur-[100px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-16 sm:pt-20 pb-8 sm:pb-10 lg:pt-28 lg:pb-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="grid items-center gap-10 sm:gap-12 lg:gap-14 lg:grid-cols-2"
          >
            {/* ── LEFT ── */}
            <div className="space-y-5 sm:space-y-6 lg:space-y-7">
              <motion.div variants={fadeUp}>
                <span className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 sm:px-3.5 py-1.5 rounded-full uppercase tracking-[0.15em]">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                  Trusted Academic Management Platform
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-semibold text-white leading-[1.15] sm:leading-[1.12] tracking-tight"
              >
                One Platform.{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-300">
                  Every Academic
                </span>{" "}
                Operation.
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-[14px] sm:text-[15px] text-neutral-400 leading-relaxed max-w-lg tracking-wide"
              >
                Digitize admissions, departments, HODs and students using one
                secure cloud-based management system built for higher education.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1"
              >
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[12px] sm:text-[13px] font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-all duration-200"
                >
                  Register College
                  <ArrowRight size={13} strokeWidth={2} className="sm:size-[14px]" />
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 text-[12px] sm:text-[13px] font-semibold text-neutral-300 hover:text-white border border-neutral-700 hover:border-neutral-600 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-all duration-200"
                >
                  Learn More
                </a>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="flex flex-wrap items-center gap-3 sm:gap-5 pt-2"
              >
                {[
                  "No setup fees",
                  "Instant onboarding",
                  "Secure & reliable",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-medium text-neutral-500"
                  >
                    <CheckCircle size={11} strokeWidth={2} className="text-emerald-500 shrink-0 sm:size-[12px]" />
                    {item}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* ── RIGHT — Hero Image/Illustration ── */}
            <motion.div variants={fadeUp} className="relative">
              <div className="absolute -inset-3 sm:-inset-4 bg-indigo-600/5 rounded-3xl blur-2xl pointer-events-none" />

              <div className="relative bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="h-[3px] w-full bg-gradient-to-r from-indigo-600 via-violet-500 to-indigo-600" />

                <div className="p-6 sm:p-8">
                  <div className="space-y-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-white">
                      Modern Education Management
                    </h3>
                    <p className="text-sm text-neutral-400 leading-relaxed">
                      Streamline your institution's operations with our comprehensive
                      academic management platform designed for the digital age.
                    </p>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="bg-neutral-800/50 border border-neutral-700/60 rounded-xl p-3 text-center">
                        <p className="text-2xl font-semibold text-indigo-400">
                          {loading ? '...' : formatNumber(stats.colleges)}
                        </p>
                        <p className="text-[9px] font-semibold text-neutral-500 uppercase tracking-[0.15em] mt-1">
                          Colleges
                        </p>
                      </div>
                      <div className="bg-neutral-800/50 border border-neutral-700/60 rounded-xl p-3 text-center">
                        <p className="text-2xl font-semibold text-emerald-400">
                          {loading ? '...' : formatNumber(stats.students)}
                        </p>
                        <p className="text-[9px] font-semibold text-neutral-500 uppercase tracking-[0.15em] mt-1">
                          Students
                        </p>
                      </div>
                      <div className="bg-neutral-800/50 border border-neutral-700/60 rounded-xl p-3 text-center col-span-2">
                        <p className="text-2xl font-semibold text-violet-400">
                          {loading ? '...' : formatNumber(stats.departments)}
                        </p>
                        <p className="text-[9px] font-semibold text-neutral-500 uppercase tracking-[0.15em] mt-1">
                          Departments
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* ── STATS BAR ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease, delay: 0.5 }}
            className="mt-12 sm:mt-16 lg:mt-20 pt-8 sm:pt-10 border-t border-neutral-800"
          >
            <p className="text-center text-[9px] sm:text-[10px] font-semibold text-neutral-600 uppercase tracking-[0.25em] mb-6 sm:mb-8 lg:mb-10">
              Trusted by Modern Institutions
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {[
                {
                  value: loading ? '...' : formatNumber(stats.colleges),
                  label: "Colleges",
                  color: "text-indigo-400"
                },
                {
                  value: loading ? '...' : formatNumber(stats.students),
                  label: "Students",
                  color: "text-emerald-400"
                },
                {
                  value: loading ? '...' : formatNumber(stats.departments),
                  label: "Departments",
                  color: "text-violet-400"
                },
                {
                  value: "99.9%",
                  label: "Availability",
                  color: "text-amber-400"
                },
              ].map(({ value, label, color }) => (
                <div
                  key={label}
                  className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 sm:p-5 lg:p-6 text-center hover:border-neutral-700 transition-colors duration-200"
                >
                  <p className={`text-2xl sm:text-3xl font-semibold ${color} leading-none mb-1.5 sm:mb-2`}>
                    {value}
                  </p>
                  <p className="text-[9px] sm:text-[10px] font-semibold text-neutral-500 uppercase tracking-[0.2em]">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}