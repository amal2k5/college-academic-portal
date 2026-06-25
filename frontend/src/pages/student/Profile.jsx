import { useEffect, useState } from "react";
import {
  User,
  GraduationCap,
  Users,
  Mail,
  Phone,
  Calendar,
  Building2,
  Hash,
  Copy,
  CheckCircle2,
  Bookmark,
  ShieldCheck,
} from "lucide-react";

import { getStudentProfile } from "../../services/studentService";

function Profile() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(null);

  const copyToClipboard = (text, label) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 1800);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getStudentProfile();
        setStudent(data);
      } catch (err) {
        setError("Failed to load student profile information.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 text-neutral-100 relative overflow-hidden">
        {/* Soft core background loader aura */}
        <div className="absolute w-80 h-80 bg-indigo-500/5 rounded-full blur-[130px] pointer-events-none" />
        <div className="h-6 w-6 border border-neutral-800 border-t-indigo-400 rounded-full animate-spin relative z-10" />
        <p className="mt-4 text-[10px] font-medium text-neutral-500 tracking-widest uppercase relative z-10">
          Retrieving Profile Dossier...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 p-6">
        <div className="max-w-md w-full p-5 bg-neutral-900 border border-neutral-800/60 rounded-3xl text-center shadow-2xl">
          <p className="text-rose-400 text-xs font-medium uppercase tracking-wider">
            {error}
          </p>
        </div>
      </div>
    );
  }

  const InfoItem = ({
    icon: Icon,
    label,
    value,
    themeColor,
    copyable = false,
  }) => (
    <div className="bg-neutral-900/30 border border-neutral-800/40 hover:border-neutral-700/60 rounded-3xl p-5 group transition-all duration-300 relative flex flex-col justify-between min-h-[115px] shadow-[0_4px_30px_rgba(0,0,0,0.3)] backdrop-blur-md">
      {/* Structural Left-Side Micro Indicator Rail */}
      <div className={`absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-${themeColor.split("-")[1]}-500/40 to-transparent rounded-l-3xl`} />
      
      <div className="flex justify-between items-start gap-4 relative z-10">
        <div className="space-y-1 min-w-0">
          <span className="text-[9px] font-medium text-neutral-500 uppercase tracking-widest block">
            {label}
          </span>
          <p className="text-neutral-200 font-normal text-xs tracking-wide leading-relaxed break-all truncate pr-1">
            {value || "—"}
          </p>
        </div>

        <div className={`p-2 bg-neutral-950 border border-neutral-900 rounded-2xl ${themeColor} transition-all duration-300 group-hover:border-neutral-700 shrink-0`}>
          <Icon size={13} strokeWidth={1.5} />
        </div>
      </div>

      {copyable && value && (
        <div className="mt-2 pt-2 border-t border-neutral-800/40 flex justify-end relative z-10">
          <button
            type="button"
            onClick={() => copyToClipboard(value, label)}
            className="inline-flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-widest text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
          >
            {copied === label ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 size={11} /> Copied
              </span>
            ) : (
              <>
                <Copy size={10} strokeWidth={1.5} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );

  const SectionTitle = ({ icon: Icon, title, highlightColor }) => (
    <div className="flex items-center gap-3 mb-6 px-1 border-b border-neutral-800/40 pb-3">
      <div className={`p-1.5 bg-neutral-900 border border-neutral-800 rounded-xl ${highlightColor}`}>
        <Icon size={13} strokeWidth={1.5} />
      </div>
      <h2 className="text-[10px] font-medium uppercase tracking-widest text-neutral-300">
        {title}
      </h2>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-400 font-sans antialiased p-4 md:p-8 lg:p-12 max-w-[1350px] mx-auto selection:bg-neutral-800 selection:text-white relative">
      
      {/* ── HIGH-END SHINING RADIANCE FIELDS ── */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(99,102,241,0.05),transparent_40%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_75%,rgba(139,92,246,0.03),transparent_45%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(16,185,129,0.02),transparent_50%)] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* ── LEFT COLUMN: Profile Identity Badge Summary ── */}
        <div className="lg:col-span-4 lg:sticky lg:top-8 space-y-5">
          <div className="bg-neutral-900/40 border border-neutral-800/60 rounded-[32px] p-6 md:p-8 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            {/* Embedded shining corner flare */}
            <div className="absolute -right-24 -top-24 w-64 h-64 bg-indigo-500/15 rounded-full blur-[90px] pointer-events-none" />

            <div className="flex flex-col items-center text-center pb-6 border-b border-neutral-800/60">
              <div className="relative mb-5">
                <div className="w-20 h-20 rounded-[22px] bg-neutral-950 border border-neutral-800 p-0.5 shadow-2xl">
                  <div className="w-full h-full bg-neutral-900/60 rounded-[18px] flex items-center justify-center text-transparent bg-clip-text bg-gradient-to-br from-neutral-200 via-neutral-100 to-indigo-400 font-sans text-2xl font-medium tracking-tight">
                    {student.first_name?.[0]}{student.last_name?.[0]}
                  </div>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-emerald-500 rounded-full border-[3px] border-neutral-950 flex items-center justify-center shadow-lg">
                  <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                </div>
              </div>

              <h1 className="text-lg font-medium tracking-tight text-neutral-200">
                {student.first_name} {student.last_name}
              </h1>

            </div>

            {/* Parameter Field Breakdown */}
            <div className="pt-6 space-y-3 text-xs">
              
              <div className="flex justify-between items-center p-3.5 bg-neutral-950/40 border border-neutral-800/40 rounded-2xl hover:border-neutral-700/60 transition-colors duration-200">
                <span className="text-[9px] font-medium text-neutral-500 uppercase tracking-widest">
                  Admission No
                </span>
                <span className="font-mono text-neutral-300 uppercase tracking-wider text-[10px] bg-neutral-950 px-2 py-0.5 border border-neutral-800 rounded-md">
                  {student.admission_number || "—"}
                </span>
              </div>

              <div className="flex justify-between items-center p-3.5 bg-neutral-950/40 border border-neutral-800/40 rounded-2xl hover:border-neutral-700/60 transition-colors duration-200">
                <span className="text-[9px] font-medium text-neutral-500 uppercase tracking-widest">
                  Department
                </span>
                <span className="text-xs font-medium text-neutral-300 max-w-[170px] truncate">
                  {student.department_name}
                </span>
              </div>

              <div className="flex justify-between items-center p-3.5 bg-neutral-950/40 border border-neutral-800/40 rounded-2xl hover:border-neutral-700/60 transition-colors duration-200">
                <span className="text-[9px] font-medium text-neutral-500 uppercase tracking-widest">
                  Current Status
                </span>
                <span className="text-[10px] font-medium tracking-wide text-emerald-400 bg-emerald-950/10 border border-emerald-900/20 px-2.5 py-0.5 rounded-lg">
                  Semester {student.semester} • {student.academic_year}
                </span>
              </div>

            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Student Information Categories ── */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Section 1: Personal Details */}
          <div>
            <SectionTitle
              icon={User}
              title="Personal Registration Record"
              highlightColor="text-violet-400 border-neutral-800"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoItem
                icon={User}
                label="Full Name"
                value={`${student.first_name} ${student.last_name}`}
                themeColor="text-violet-400"
              />
              <InfoItem
                icon={Calendar}
                label="Date of Birth"
                value={student.date_of_birth}
                themeColor="text-violet-400"
              />
              <InfoItem
                icon={User}
                label="Gender"
                value={student.gender}
                themeColor="text-violet-400"
              />
              <InfoItem
                icon={Mail}
                label="Email Address"
                value={student.email}
                themeColor="text-violet-400"
                copyable
              />
              <InfoItem
                icon={Phone}
                label="Phone Number"
                value={student.phone}
                themeColor="text-violet-400"
                copyable
              />
            </div>
          </div>

          {/* Section 2: Academic Registry */}
          <div>
            <SectionTitle
              icon={GraduationCap}
              title="Academic Standing Matrix"
              highlightColor="text-cyan-400 border-neutral-800"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoItem
                icon={Building2}
                label="Department"
                value={student.department_name}
                themeColor="text-cyan-400"
              />
              <InfoItem
                icon={Hash}
                label="Roll Number"
                value={student.roll_number}
                themeColor="text-cyan-400"
              />
              <InfoItem
                icon={Hash}
                label="Admission Number"
                value={student.admission_number}
                themeColor="text-cyan-400"
              />
              <InfoItem
                icon={Calendar}
                label="Academic Year"
                value={student.academic_year}
                themeColor="text-cyan-400"
              />
              <InfoItem
                icon={Bookmark}
                label="Current Semester"
                value={`Semester ${student.semester}`}
                themeColor="text-cyan-400"
              />
            </div>
          </div>

          {/* Section 3: Parent & Guardian Details */}
          <div>
            <SectionTitle
              icon={Users}
              title="Parent & Guardian Roster"
              highlightColor="text-amber-400 border-neutral-800"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoItem
                icon={User}
                label="Parent / Guardian Name"
                value={student.parent_name}
                themeColor="text-amber-400"
              />
              <InfoItem
                icon={Phone}
                label="Parent Contact Number"
                value={student.parent_phone}
                themeColor="text-amber-400"
                copyable
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;