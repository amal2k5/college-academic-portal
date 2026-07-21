import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  GraduationCap,
  BookOpen,
  TrendingUp,
  Award,
  RefreshCw,
  AlertCircle,
  BarChart3,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import marksService from "../../services/marksService";
import { getExamTypeLabel } from "../../constants/examConstants";

// ── Animation Config ──────────────────────────────────────────────────────────
const ease = [0.22, 1, 0.36, 1];
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
};
const stagger = {
  visible: { transition: { staggerChildren: 0.05 } },
};

// ── Constants & Helpers ───────────────────────────────────────────────────────
const GRADE_STYLES = {
  "A+": { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", strip: "from-emerald-500 to-emerald-700" },
  A: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", strip: "from-emerald-500 to-emerald-700" },
  "B+": { text: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20", strip: "from-cyan-500 to-cyan-700" },
  B: { text: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20", strip: "from-cyan-500 to-cyan-700" },
  C: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", strip: "from-amber-500 to-amber-700" },
  D: { text: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", strip: "from-orange-500 to-orange-700" },
  F: { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", strip: "from-red-500 to-red-700" },
  DEFAULT: { text: "text-neutral-400", bg: "bg-neutral-800", border: "border-neutral-700", strip: "from-neutral-600 to-neutral-800" }
};

const CHART_COLORS = ["#818cf8", "#a78bfa", "#22d3ee", "#fbbf24", "#6366f1"];

// ── Components ────────────────────────────────────────────────────────────────

function BarChart({ data }) {
  if (!data?.length) return null;
  const height = 180;
  const barWidth = 32;
  const gap = 24;
  const width = Math.max(data.length * (barWidth + gap), 300);

  return (
    <div className="overflow-x-auto pb-2">
      <svg width={width} height={height + 60} viewBox={`0 0 ${width} ${height + 60}`}>
        {/* Grid Lines */}
        {[0, 50, 100].map((pct) => {
          const y = height - (pct / 100) * height;
          return (
            <g key={pct}>
              <line x1={0} y1={y} x2={width} y2={y} stroke="rgba(255,255,255,0.05)" />
              <text x={-10} y={y + 4} fill="rgba(255,255,255,0.2)" fontSize="10" textAnchor="end">{pct}%</text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((item, i) => {
          const pct = item.maxValue > 0 ? (item.value / item.maxValue) * 100 : 0;
          const barH = (pct / 100) * height;
          const x = i * (barWidth + gap) + 10;
          const y = height - barH;

          return (
            <g key={i}>
              <rect x={x} y={y} width={barWidth} height={barH} fill={CHART_COLORS[i % CHART_COLORS.length]} rx={0} />
              <text x={x + barWidth / 2} y={y - 8} fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">{item.value}</text>
              <text x={x + barWidth / 2} y={height + 20} fill="rgba(255,255,255,0.4)" fontSize="9" textAnchor="middle">{item.label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function MarksCard({ mark }) {
  const styles = GRADE_STYLES[mark.grade] || GRADE_STYLES.DEFAULT;
  const pct = mark.maximum_marks > 0 ? ((mark.marks / mark.maximum_marks) * 100).toFixed(1) : 0;

  return (
    <motion.div variants={fadeUp} className="group bg-neutral-900 border border-neutral-800 hover:border-neutral-600 transition-colors relative overflow-hidden">
      <div className={`h-1 w-full bg-gradient-to-r ${styles.strip}`} />
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-sm font-bold text-white truncate max-w-[180px]">{mark.subject_name}</h3>
            <span className="text-[10px] font-mono text-neutral-500 mt-1 block">{mark.subject_code}</span>
          </div>
          <span className={`text-[10px] font-bold px-2 py-1 border ${styles.bg} ${styles.border} ${styles.text} uppercase tracking-wider`}>
            {getExamTypeLabel(mark.exam_type)}
          </span>
        </div>

        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">Score</p>
            <p className="text-2xl font-bold text-white">
              {mark.marks}<span className="text-sm text-neutral-500 font-normal">/{mark.maximum_marks}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">Grade</p>
            <p className={`text-xl font-bold ${styles.text}`}>{mark.grade || "-"}</p>
          </div>
        </div>

        <div className="pt-3 border-t border-neutral-800 flex justify-between items-center">
          <div className="w-full bg-neutral-800 h-1.5 mr-4">
            <div className={`h-full ${styles.strip.replace('from-', 'bg-').split(' ')[0]}`} style={{ width: `${pct}%` }} />
          </div>
          <span className="text-[10px] font-mono text-neutral-400">{pct}%</span>
        </div>
      </div>
    </motion.div>
  );
}

function SemesterSection({ semester, marks }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <motion.div variants={fadeUp} className="mb-8">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 py-2 border-b border-neutral-800 mb-4 group hover:bg-neutral-900/50 transition-colors px-2"
      >
        <BookOpen size={16} className="text-indigo-400" />
        <h2 className="text-xs font-bold text-white uppercase tracking-widest">Semester {semester}</h2>
        <span className="text-[10px] bg-neutral-800 text-neutral-400 px-2 py-0.5 ml-2">{marks.length} Results</span>
        <div className="flex-1" />
        {expanded ? <ChevronUp size={16} className="text-neutral-500" /> : <ChevronDown size={16} className="text-neutral-500" />}
      </button>

      {expanded && (
        <motion.div initial="hidden" animate="visible" variants={stagger} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {marks.map((m) => <MarksCard key={m.id} mark={m} />)}
        </motion.div>
      )}
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
function MarksPage() {
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    marksService.getStudentMarks()
      .then(setMarks)
      .catch(() => { setError("Failed to load marks"); toast.error("Error loading data"); })
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    if (!marks.length) return null;
    const total = marks.reduce((a, b) => a + Number(b.marks), 0);
    const max = marks.reduce((a, b) => a + Number(b.maximum_marks), 0);
    const avg = max ? ((total / max) * 100).toFixed(1) : 0;

    // Simple best grade logic
    const grades = ["A+", "A", "B+", "B", "C", "D", "F"];
    const best = marks.map(m => m.grade).sort((a, b) => grades.indexOf(a) - grades.indexOf(b))[0] || "-";

    return [
      { label: "Average Score", value: `${avg}%`, icon: TrendingUp, color: "text-cyan-400", strip: "from-cyan-500 to-cyan-700" },
      { label: "Best Grade", value: best, icon: Award, color: "text-amber-400", strip: "from-amber-500 to-amber-700" },
      { label: "Total Exams", value: marks.length, icon: BookOpen, color: "text-indigo-400", strip: "from-indigo-500 to-indigo-700" },
      { label: "Subjects", value: new Set(marks.map(m => m.subject_code)).size, icon: GraduationCap, color: "text-violet-400", strip: "from-violet-500 to-violet-700" },
    ];
  }, [marks]);

  const chartData = useMemo(() => marks.map(m => ({
    label: m.subject_code,
    value: Number(m.marks),
    maxValue: Number(m.maximum_marks)
  })), [marks]);

  const semesters = useMemo(() => {
    const groups = {};
    marks.forEach(m => {
      const sem = m.semester || "Other";
      if (!groups[sem]) groups[sem] = [];
      groups[sem].push(m);
    });
    return Object.entries(groups).sort((a, b) => b[0] - a[0]);
  }, [marks]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-neutral-950"><div className="w-8 h-8 border-2 border-neutral-800 border-t-indigo-500 animate-spin" /></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-red-400">{error}</div>;
  if (!marks.length) return <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-500">No marks found.</div>;

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="min-h-screen bg-neutral-950 text-neutral-200 p-6 lg:p-12 max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-10 border-b border-neutral-800 pb-6">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Academic Performance</h1>
        <p className="text-neutral-400 text-sm">Track your grades, attendance, and overall progress.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat, i) => (
          <motion.div key={i} variants={fadeUp} className="bg-neutral-900 border border-neutral-800 relative overflow-hidden group hover:border-neutral-700 transition-colors">
            <div className={`h-1 w-full bg-gradient-to-r ${stat.strip}`} />
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{stat.label}</span>
                <stat.icon size={16} className={stat.color} />
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      {chartData.length > 1 && (
        <motion.div variants={fadeUp} className="bg-neutral-900 border border-neutral-800 p-6 mb-10">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 size={18} className="text-indigo-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-widest">Performance Trend</h2>
          </div>
          <BarChart data={chartData} />
        </motion.div>
      )}

      {/* Semesters */}
      <div>
        {semesters.map(([sem, marksList]) => (
          <SemesterSection key={sem} semester={sem} marks={marksList} />
        ))}
      </div>
    </motion.div>
  );
}

export default MarksPage;