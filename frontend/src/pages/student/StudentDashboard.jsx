import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Activity,
  ChevronRight,
  BookOpen
} from "lucide-react";

import { getStudentProfile } from "../../services/studentService";
import examService from "../../services/examService";
import ProfileSummaryCard from "../../components/common/ProfileSummaryCard";

const ease = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};

function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, examsData] = await Promise.all([
          getStudentProfile(),
          examService.getExams().catch(() => [])
        ]);
        
        if (profileData && Object.keys(profileData).length > 0) {
          setStudent(profileData);
        } else {
          setError("No profile data found.");
        }
        
        setExams(Array.isArray(examsData) ? examsData : []);
      } catch (err) {
        setError(err.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const nextExam = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcoming = exams.filter(e => {
      const d = new Date(e.date);
      d.setHours(0,0,0,0);
      return d >= today;
    });
    upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
    return upcoming.length > 0 ? upcoming[0] : null;
  }, [exams]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 gap-5">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-6 h-6 rounded-full border-2 border-neutral-800 border-t-indigo-400"
        />
        <p className="text-[11px] text-neutral-500 tracking-[0.2em] uppercase">
          Loading dashboard
        </p>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 p-6">
        <div className="w-full max-w-sm p-6 bg-neutral-900 border border-neutral-800 rounded-2xl text-center">
          <p className="text-sm text-rose-400 tracking-wide">
            {error || "No dashboard data available."}
          </p>
        </div>
      </div>
    );
  }

  const s = student;
  const fullName = `${s.first_name || ""} ${s.last_name || ""}`.trim() || "Student";

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="min-h-screen bg-neutral-950 text-neutral-400 antialiased p-4 md:p-6 lg:p-10 max-w-[1300px] mx-auto space-y-8"
    >
      <ProfileSummaryCard
        role="STUDENT"
        collegeName={s.college_name}
        userName={fullName}
        rollNumber={s.roll_number}
        departmentName={s.department_name}
        semester={s.semester}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Welcome Banner */}
          <motion.div variants={fadeUp} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <h1 className="text-2xl font-bold text-white tracking-wide">
              Welcome back, {s.first_name || "Student"}!
            </h1>
            <p className="text-sm text-neutral-400 mt-2">
              Here's what is happening with your academics today.
            </p>
          </motion.div>

          {/* Quick Actions / Summary Stats could go here */}

        </div>

        {/* Right Column: Widgets */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Upcoming Exam Widget */}
          <motion.div variants={fadeUp} className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col">
            <div className="h-[3px] w-full bg-gradient-to-r from-indigo-600 via-violet-500 to-indigo-600" />
            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-neutral-800/60">
                <Activity size={14} className="text-indigo-400" />
                <h2 className="text-[10px] font-bold text-neutral-300 uppercase tracking-[0.2em]">Next Examination</h2>
              </div>
              
              <div className="flex-1">
                {nextExam ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-[14px] font-semibold text-neutral-100 leading-snug">
                        {nextExam.subject_name || "Subject"}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                          {nextExam.subject_code}
                        </span>
                        <span className="text-[11px] text-neutral-500 font-medium">
                          {nextExam.exam_type.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 bg-neutral-800/30 rounded-xl p-4 border border-neutral-800/50">
                      <div className="flex items-center gap-2 text-[12px] text-neutral-300">
                        <Calendar size={12} className="text-neutral-500" />
                        <span>
                          {new Date(nextExam.date).toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[12px] text-neutral-300">
                        <Clock size={12} className="text-neutral-500" />
                        <span>{nextExam.time.substring(0, 5)}</span>
                      </div>
                      <div className="flex items-start gap-2 text-[12px] text-neutral-300">
                        <MapPin size={12} className="text-neutral-500 mt-0.5 shrink-0" />
                        <span className="truncate">{nextExam.venue}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
                    <div className="p-3 bg-neutral-800/50 rounded-full">
                      <Calendar size={18} className="text-neutral-500" />
                    </div>
                    <p className="text-[12px] font-medium text-neutral-400">No upcoming exams</p>
                    <p className="text-[10px] text-neutral-600 px-4">Enjoy your break! We'll notify you when new exams are scheduled.</p>
                  </div>
                )}
              </div>

              <Link to="/student/exams" className="mt-4 pt-4 border-t border-neutral-800/60 flex items-center justify-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors group">
                View all exams
                <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}

export default StudentDashboard;