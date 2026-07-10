import { motion } from "framer-motion";
import {
  Building2,
  GraduationCap,
  Users,
  ShieldCheck,
  BarChart3,
  Cloud,
  ArrowRight,
  CheckCircle2,
  UserCheck,
  Clock,
  Zap,
  Lock,
  TrendingUp,
  Globe,
} from "lucide-react";

// ── Animation Variants ──
const ease = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease } },
};

// ── Data Arrays ──
const features = [
  {
    icon: Building2,
    title: "College Management",
    description:
      "Complete oversight of all college operations, from admissions to graduation tracking.",
  },
  {
    icon: Users,
    title: "Department Administration",
    description:
      "Streamline department workflows, course scheduling, and faculty coordination.",
  },
  {
    icon: GraduationCap,
    title: "HOD & Student Management",
    description:
      "Empower HODs with tools to manage students, attendance, and academic progress.",
  },
  {
    icon: ShieldCheck,
    title: "Student Portal",
    description:
      "Give students secure access to grades, schedules, and important announcements.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Real-time insights and reports on institution performance, enrollment, and more.",
  },
  {
    icon: Cloud,
    title: "Cloud Infrastructure",
    description:
      "Scalable, secure cloud platform ensuring 99.9% uptime and data protection.",
  },
];

const workflowSteps = [
  {
    number: "1",
    title: "Register College",
    description: "Sign up and provide basic institution details.",
  },
  {
    number: "2",
    title: "Platform Review",
    description: "Our team reviews and verifies your registration.",
  },
  {
    number: "3",
    title: "Approval",
    description: "Get approved and receive platform access credentials.",
  },
  {
    number: "4",
    title: "Password Setup",
    description: "Secure your account with a strong password.",
  },
  {
    number: "5",
    title: "Start Managing",
    description: "Begin managing departments, HODs, and students.",
  },
];

const benefits = [
  {
    icon: Lock,
    title: "Secure Authentication",
    description: "Enterprise-grade security with role-based access control.",
  },
  {
    icon: TrendingUp,
    title: "Scalable Platform",
    description: "Grows with your institution from 100 to 100,000+ users.",
  },
  {
    icon: Zap,
    title: "Real-Time Insights",
    description: "Live analytics and reporting for data-driven decisions.",
  },
  {
    icon: Globe,
    title: "Cloud Access",
    description:
      "Access your institution data anytime, anywhere, on any device.",
  },
];

const Features = () => {
  return (
    <section className="bg-neutral-950 text-white py-16 sm:py-20 lg:py-24 px-4 sm:px-6 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        {/* ─── FEATURES SECTION ─── */}
        <motion.div
          id="features"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="mb-16 sm:mb-20 lg:mb-28"
        >
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 lg:mb-16">
            <motion.div variants={fadeUp}>
              <span className="text-[10px] sm:text-[11px] font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 sm:px-3.5 py-1.5 rounded-full uppercase tracking-[0.15em]">
                Features
              </span>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="text-2xl sm:text-3xl md:text-4xl font-semibold mt-4 mb-3 sm:mb-4 tracking-tight"
            >
              Everything You Need to Manage
              <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-300">
                Your Academic Institution
              </span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-[14px] sm:text-[15px] text-neutral-400 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0"
            >
              Designed to simplify administration, improve collaboration and
              modernize academic operations.
            </motion.p>
          </div>

          {/* Features Grid */}
          <motion.div
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeUp}
                  whileHover={{
                    y: -8,
                    transition: { duration: 0.3, ease },
                  }}
                  className="group relative bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-6 lg:p-7 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5"
                >
                  <div className="relative z-10">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-indigo-500/20 group-hover:scale-110 transition-all duration-300">
                      <Icon size={18} className="text-indigo-400 sm:size-[20px]" />
                    </div>
                    <h3 className="text-[14px] sm:text-[15px] font-semibold text-white mb-1.5 sm:mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-[12px] sm:text-[13px] text-neutral-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-violet-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* ─── HOW IT WORKS SECTION ─── */}
        <motion.div
          id="how-it-works"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="mb-16 sm:mb-20 lg:mb-28"
        >
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 lg:mb-16">
            <motion.div variants={fadeUp}>
              <span className="text-[10px] sm:text-[11px] font-semibold text-violet-400 bg-violet-500/10 border border-violet-500/20 px-3 sm:px-3.5 py-1.5 rounded-full uppercase tracking-[0.15em]">
                How It Works
              </span>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="text-2xl sm:text-3xl md:text-4xl font-semibold mt-4 mb-3 sm:mb-4 tracking-tight"
            >
              How It Works
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-[14px] sm:text-[15px] text-neutral-400 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0"
            >
              Get started in minutes with our simple onboarding process.
            </motion.p>
          </div>

          {/* Desktop Timeline */}
          <div className="hidden lg:block relative">
            {/* Connecting line */}
            <div className="absolute top-8 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500" />

            <div className="grid grid-cols-5 gap-0 relative">
              {workflowSteps.map((step, index) => (
                <motion.div key={index} variants={fadeUp} className="relative">
                  <div className="flex flex-col items-center text-center">
                    {/* Step number */}
                    <div className="w-16 h-16 rounded-full bg-neutral-900 border-2 border-indigo-500 flex items-center justify-center text-xl font-bold text-indigo-400 relative z-10 mb-4">
                      {step.number}
                    </div>
                    <h4 className="text-[13px] font-semibold text-white mb-1">
                      {step.title}
                    </h4>
                    <p className="text-[11px] text-neutral-500 max-w-[140px] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile Timeline */}
          <div className="lg:hidden relative">
            {/* Vertical line */}
            <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-[2px] bg-gradient-to-b from-indigo-500 via-violet-500 to-indigo-500" />

            <div className="space-y-6 sm:space-y-8">
              {workflowSteps.map((step, index) => (
                <motion.div
                  key={index}
                  variants={fadeUp}
                  className="relative pl-12 sm:pl-16"
                >
                  {/* Step number */}
                  <div className="absolute left-0 top-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-neutral-900 border-2 border-indigo-500 flex items-center justify-center text-base sm:text-lg font-bold text-indigo-400 z-10">
                    {step.number}
                  </div>
                  <div>
                    <h4 className="text-[13px] sm:text-[14px] font-semibold text-white mb-0.5 sm:mb-1">
                      {step.title}
                    </h4>
                    <p className="text-[11px] sm:text-[12px] text-neutral-500 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ─── WHY CHOOSE US SECTION ─── */}
        <motion.div
          id="why-us" 
          initial="hidden"
          className="scroll-mt-24"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 lg:mb-16">
            <motion.div variants={fadeUp}>
              <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 sm:px-3.5 py-1.5 rounded-full uppercase tracking-[0.15em]">
                Why Choose Us
              </span>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="text-2xl sm:text-3xl md:text-4xl font-semibold mt-4 mb-3 sm:mb-4 tracking-tight"
            >
              Why Institutions Choose
              <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-300">
                Our Platform
              </span>
            </motion.h2>
          </div>

          <motion.div
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6"
          >
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeUp}
                  whileHover={{
                    y: -4,
                    transition: { duration: 0.3, ease },
                  }}
                  className="group bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-6 lg:p-7 text-center hover:border-emerald-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all duration-300">
                    <Icon size={20} className="text-emerald-400 sm:size-[24px]" />
                  </div>
                  <h4 className="text-[13px] sm:text-[14px] font-semibold text-white mb-1.5 sm:mb-2">
                    {benefit.title}
                  </h4>
                  <p className="text-[11px] sm:text-[12px] text-neutral-500 leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;