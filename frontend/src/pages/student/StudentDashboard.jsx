import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Building2,
  Hash,
  Calendar,
  ArrowRight,
  User,
  Mail,
  Phone,
  Bookmark
} from "lucide-react";

import { getStudentProfile } from "../../services/studentService";

function StudentDashboard() {
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getStudentProfile();
        setStudent(data);
      } catch (err) {
        setError("Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 bg-neutral-950 rounded-3xl border border-neutral-900 max-w-7xl mx-auto relative overflow-hidden">
        {/* Soft core background loader silver aura */}
        <div className="absolute w-80 h-80 bg-white/5 rounded-full blur-[130px] pointer-events-none" />
        <div className="h-6 w-6 animate-spin rounded-full border border-neutral-900 border-b-neutral-400 relative z-10"></div>
        <p className="text-[10px] font-medium text-neutral-500 mt-4 tracking-widest uppercase relative z-10">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4 bg-neutral-900/50 border border-rose-950/40 text-xs font-medium tracking-wider uppercase text-rose-400 rounded-2xl flex items-center gap-3 backdrop-blur-md">
        <div className="h-1 w-1 rounded-full bg-rose-500 animate-pulse shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  const metrics = [
    {
      title: "Department",
      value: student.department_name,
      icon: Building2,
      accentClass: "from-blue-500/20 to-transparent border-blue-500/30 text-blue-400",
      pillClass: "bg-blue-500/10 text-blue-300 border-blue-500/20"
    },
    {
      title: "Semester Status",
      value: `Semester ${student.semester}`,
      icon: GraduationCap,
      accentClass: "from-emerald-500/20 to-transparent border-emerald-500/30 text-emerald-400",
      pillClass: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
    },
    {
      title: "Academic Year",
      value: student.academic_year,
      icon: Calendar,
      accentClass: "from-amber-500/20 to-transparent border-amber-500/30 text-amber-400",
      pillClass: "bg-amber-500/10 text-amber-300 border-amber-500/20"
    },
    {
      title: "Roll Number",
      value: student.roll_number,
      icon: Hash,
      accentClass: "from-purple-500/20 to-transparent border-purple-500/30 text-purple-400",
      pillClass: "bg-purple-500/10 text-purple-300 border-purple-500/20"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto font-sans antialiased text-neutral-400 p-4 bg-neutral-950 min-h-screen space-y-12 relative">
      
      {/* ── HIGH-END SILVER SHINING RADIANCE FIELDS ── */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.04),transparent_35%)] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_70%,rgba(200,200,200,0.03),transparent_40%)] pointer-events-none z-0" />

      <div className="relative z-10 space-y-12">
        {/* ── HIGH-DEFINITION AMBIENT HEADER ── */}
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-neutral-800/40 pb-8">
          <div className="space-y-1.5 z-10">
            <h1 className="text-xl md:text-2xl font-medium text-neutral-100 tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-400">{student.first_name}</span> 👋
            </h1>
            <p className="text-xs text-neutral-500 tracking-wide font-normal">
              Account verified. Reviewing real-time institutional records and metric fields.
            </p>
          </div>
          

        </div>

        {/* ── CORE WORKSPACE INTERFACE ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side Pane: Deep-Contrast Metric Block Grid */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 lg:sticky lg:top-24">
            {metrics.map(({ title, value, icon: Icon, accentClass, pillClass }) => (
              <div
                key={title}
                className="group relative rounded-2xl border border-neutral-800/50 bg-neutral-900/40 p-5 overflow-hidden transition-all duration-300 hover:border-neutral-700/60 shadow-[0_4px_25px_rgba(0,0,0,0.4)] backdrop-blur-md"
              >
                {/* Subtle visual background gradient slide effect */}
                <div className={`absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b ${accentClass} opacity-80 rounded-l-2xl`} />
                
                <div className="flex justify-between items-center relative z-10">
                  <div className="space-y-2 min-w-0">
                    <p className="text-[9px] font-medium text-neutral-500 uppercase tracking-widest">{title}</p>
                    <h3 className="text-sm font-medium text-neutral-200 tracking-wide truncate pr-2">
                      {value}
                    </h3>
                  </div>
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-neutral-800/80 bg-neutral-950 ${accentClass.split(" ").pop()} transition-all duration-300 group-hover:border-neutral-700`}>
                    <Icon size={14} strokeWidth={1.5} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Side Pane: High-Definition Structural Profile Ledger Sheet */}
          <div className="relative lg:col-span-7 rounded-3xl border border-neutral-800/50 bg-neutral-900/30 p-6 md:p-8 space-y-8 shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            {/* Local ambient corner highlight */}
            <div className="absolute -right-24 -top-24 w-64 h-64 bg-white/5 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800/50 pb-6 relative z-10">
              <div className="space-y-1">
                <h2 className="text-xs font-medium text-neutral-300 uppercase tracking-widest">
                  Student Record Dossier
                </h2>
                <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-wider">
                  Primary Profile Verification Credentials
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/student/profile")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-950 hover:bg-neutral-900 text-neutral-300 hover:text-white text-xs font-medium uppercase tracking-wider px-4 py-2.5 border border-neutral-800 transition duration-150 cursor-pointer group whitespace-nowrap self-start sm:self-auto"
              >
                <span>Explore Profile</span>
                <ArrowRight size={12} strokeWidth={1.5} className="transform group-hover:translate-x-0.5 transition-transform duration-150 text-neutral-400 group-hover:text-white" />
              </button>
            </div>

            {/* Detailed Roster Rows Area */}
            <div className="space-y-4 relative z-10">
              
              {/* Full Name Attribute Row */}
              <div className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-neutral-950/60 border border-neutral-800/40 rounded-2xl hover:border-neutral-700/60 transition-all duration-200 gap-3 backdrop-blur-md">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="p-2 bg-neutral-900 border border-neutral-800 rounded-xl text-indigo-400 shrink-0 shadow-inner">
                    <User size={14} strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-medium text-neutral-500 uppercase tracking-widest">Full Name</p>
                    <h4 className="text-xs font-medium text-neutral-200 tracking-wide truncate">
                      {student.first_name} {student.last_name}
                    </h4>
                  </div>
                </div>
                <div className="text-[10px] font-medium tracking-wide text-neutral-400 px-3 py-1 bg-neutral-900/50 border border-neutral-800 rounded-lg shrink-0 self-start sm:self-auto">
                  Verified Identity
                </div>
              </div>

              {/* Email Address Attribute Row */}
              <div className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-neutral-950/60 border border-neutral-800/40 rounded-2xl hover:border-neutral-700/60 transition-all duration-200 gap-3 backdrop-blur-md">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="p-2 bg-neutral-900 border border-neutral-800 rounded-xl text-violet-400 shrink-0 shadow-inner">
                    <Mail size={14} strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-medium text-neutral-500 uppercase tracking-widest">Email Address</p>
                    <h4 className="text-xs font-medium text-neutral-200 tracking-wide truncate">
                      {student.email}
                    </h4>
                  </div>
                </div>
                <div className="text-[10px] font-medium tracking-wide text-indigo-300/80 px-3 py-1 bg-indigo-950/10 border border-indigo-900/20 rounded-lg shrink-0 self-start sm:self-auto">
                  Primary Contact
                </div>
              </div>

              {/* Contact Number Attribute Row */}
              <div className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-neutral-950/60 border border-neutral-800/40 rounded-2xl hover:border-neutral-700/60 transition-all duration-200 gap-3 backdrop-blur-md">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="p-2 bg-neutral-900 border border-neutral-800 rounded-xl text-cyan-400 shrink-0 shadow-inner">
                    <Phone size={14} strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-medium text-neutral-500 uppercase tracking-widest">Contact Number</p>
                    <h4 className="text-xs font-medium text-neutral-200 tracking-wide truncate">
                      {student.phone || "—"}
                    </h4>
                  </div>
                </div>
                <div className="text-[10px] font-medium tracking-wide text-neutral-400 px-3 py-1 bg-neutral-900/50 border border-neutral-800 rounded-lg shrink-0 self-start sm:self-auto">
                  Secondary
                </div>
              </div>

              {/* Academic Department Attribute Row */}
              <div className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-neutral-950/60 border border-neutral-800/40 rounded-2xl hover:border-neutral-700/60 transition-all duration-200 gap-3 backdrop-blur-md">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="p-2 bg-neutral-900 border border-neutral-800 rounded-xl text-emerald-400 shrink-0 shadow-inner">
                    <Bookmark size={14} strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-medium text-neutral-500 uppercase tracking-widest">Academic Department</p>
                    <h4 className="text-xs font-medium text-neutral-200 tracking-wide truncate">
                      {student.department_name}
                    </h4>
                  </div>
                </div>
                <div className="text-[10px] font-medium tracking-wide text-emerald-400/80 px-3 py-1 bg-emerald-950/10 border border-emerald-900/20 rounded-lg shrink-0 self-start sm:self-auto">
                  Active Division
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;