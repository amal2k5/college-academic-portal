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

// ── Animation variants ──────────────────────────────────────────────────────────
const ease = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

const gridStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

// ── Grade Color Mapping ─────────────────────────────────────────────────────────
const gradeColorMap = {
  "A+": "text-emerald-400",
  A: "text-emerald-400",
  "B+": "text-cyan-400",
  B: "text-cyan-400",
  C: "text-amber-400",
  D: "text-orange-400",
  F: "text-red-400",
};

const gradeAccentMap = {
  "A+": "from-emerald-600 via-emerald-400 to-emerald-600",
  A: "from-emerald-600 via-emerald-400 to-emerald-600",
  "B+": "from-cyan-600 via-cyan-400 to-cyan-600",
  B: "from-cyan-600 via-cyan-400 to-cyan-600",
  C: "from-amber-600 via-amber-400 to-amber-600",
  D: "from-orange-600 via-orange-400 to-orange-600",
  F: "from-red-600 via-red-400 to-red-600",
};

// ── SVG Bar Chart ───────────────────────────────────────────────────────────────
const chartColors = [
  "#818cf8", // indigo-400
  "#a78bfa", // violet-400
  "#22d3ee", // cyan-400
  "#fbbf24", // amber-400
  "#6366f1", // indigo-500
  "#8b5cf6", // violet-500
];

function BarChart({ data }) {
  // data: [{ label, value, maxValue }]
  if (!data || data.length === 0) return null;

  const chartHeight = 180;
  const barWidth = 40;
  const gap = 16;
  const labelHeight = 50;
  const topPadding = 24;
  const chartWidth = data.length * (barWidth + gap) - gap + 40;
  const maxVal = Math.max(...data.map((d) => Number(d.maxValue) || 100));

  return (
    <div className="overflow-x-auto custom-scrollbar pb-2 -mx-1 px-1">
      <svg
        width={Math.max(chartWidth, 200)}
        height={chartHeight + labelHeight + topPadding}
        viewBox={`0 0 ${Math.max(chartWidth, 200)} ${
          chartHeight + labelHeight + topPadding
        }`}
        className="mx-auto"
        role="img"
        aria-label="Marks trend chart"
      >
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((pct) => {
          const y = topPadding + chartHeight - (pct / 100) * chartHeight;
          return (
            <g key={pct}>
              <line
                x1={20}
                y1={y}
                x2={chartWidth - 10}
                y2={y}
                stroke="rgba(255,255,255,0.06)"
                strokeDasharray="4 4"
              />
              <text
                x={14}
                y={y + 3}
                fill="rgba(255,255,255,0.25)"
                fontSize="8"
                textAnchor="end"
                fontFamily="monospace"
              >
                {pct}%
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((item, i) => {
          const pct =
            Number(item.maxValue) > 0
              ? (Number(item.value) / Number(item.maxValue)) * 100
              : 0;
          const barHeight = (pct / 100) * chartHeight;
          const x = 20 + i * (barWidth + gap);
          const y = topPadding + chartHeight - barHeight;
          const color = chartColors[i % chartColors.length];

          return (
            <g key={i}>
              {/* Bar background */}
              <rect
                x={x}
                y={topPadding}
                width={barWidth}
                height={chartHeight}
                rx={6}
                fill="rgba(255,255,255,0.03)"
              />
              {/* Bar */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={6}
                fill={color}
                opacity={0.85}
              >
                <animate
                  attributeName="height"
                  from="0"
                  to={barHeight}
                  dur="0.6s"
                  fill="freeze"
                  begin="0.1s"
                />
                <animate
                  attributeName="y"
                  from={topPadding + chartHeight}
                  to={y}
                  dur="0.6s"
                  fill="freeze"
                  begin="0.1s"
                />
              </rect>
              {/* Value label */}
              <text
                x={x + barWidth / 2}
                y={y - 6}
                fill={color}
                fontSize="10"
                fontWeight="600"
                textAnchor="middle"
                fontFamily="system-ui"
              >
                {Number(item.value).toFixed(0)}
              </text>
              {/* X-axis label */}
              <text
                x={x + barWidth / 2}
                y={topPadding + chartHeight + 16}
                fill="rgba(255,255,255,0.4)"
                fontSize="9"
                textAnchor="middle"
                fontFamily="system-ui"
              >
                {item.label.length > 8
                  ? item.label.slice(0, 7) + "…"
                  : item.label}
              </text>
              <text
                x={x + barWidth / 2}
                y={topPadding + chartHeight + 30}
                fill="rgba(255,255,255,0.2)"
                fontSize="8"
                textAnchor="middle"
                fontFamily="monospace"
              >
                {pct.toFixed(0)}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── Marks Card ──────────────────────────────────────────────────────────────────
function MarksCard({ mark }) {
  const pct =
    Number(mark.maximum_marks) > 0
      ? ((Number(mark.marks) / Number(mark.maximum_marks)) * 100).toFixed(1)
      : "0.0";

  const gradeColor = gradeColorMap[mark.grade] || "text-neutral-400";
  const stripGradient =
    gradeAccentMap[mark.grade] ||
    "from-indigo-600 via-violet-500 to-indigo-600";

  const examLabel = (mark.exam_type || "")
    .replace(/([A-Z])/g, " $1")
    .trim();

  return (
    <motion.div
      variants={fadeUp}
      className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-2xl overflow-hidden transition-all duration-200 group"
    >
      <div className={`h-[3px] w-full bg-gradient-to-r ${stripGradient}`} />
      <div className="p-5">
        {/* Subject + Exam type */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium text-neutral-100 tracking-wide truncate leading-snug">
              {mark.subject_name}
            </p>
            <p className="text-[10px] text-neutral-500 font-mono tracking-wide mt-0.5">
              {mark.subject_code}
            </p>
          </div>
          <span className="text-[10px] font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-lg whitespace-nowrap">
            {examLabel}
          </span>
        </div>

        {/* Marks Display */}
        <div className="flex items-end justify-between gap-4 mb-4">
          <div>
            <p className="text-[9px] font-semibold text-neutral-500 uppercase tracking-[0.2em] mb-1">
              Obtained / Maximum
            </p>
            <p className="text-xl font-semibold text-neutral-100 tracking-tight">
              {Number(mark.marks).toFixed(0)}
              <span className="text-sm text-neutral-500 font-normal">
                {" "}
                / {Number(mark.maximum_marks).toFixed(0)}
              </span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-semibold text-neutral-500 uppercase tracking-[0.2em] mb-1">
              Percentage
            </p>
            <p className="text-lg font-semibold text-neutral-200">{pct}%</p>
          </div>
        </div>

        {/* Grade + Status */}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
          <div className="flex items-center gap-2">
            <Award size={13} strokeWidth={1.6} className={gradeColor} />
            <span className={`text-sm font-bold ${gradeColor}`}>
              Grade {mark.grade || "—"}
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-lg uppercase tracking-widest">
            Published
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Semester Section ────────────────────────────────────────────────────────────
function SemesterSection({ semester, marks }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <motion.div variants={fadeUp}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 mb-4 group cursor-pointer"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2.5">
          <div className="text-violet-400">
            <BookOpen size={14} strokeWidth={1.6} />
          </div>
          <h2 className="text-[10px] font-bold text-neutral-300 uppercase tracking-[0.22em]">
            Semester {semester}
          </h2>
          <span className="text-[9px] font-semibold text-neutral-600 bg-neutral-800/50 border border-neutral-700/50 px-2 py-0.5 rounded-lg">
            {marks.length} {marks.length === 1 ? "result" : "results"}
          </span>
        </div>
        <div className="flex-1 h-px bg-neutral-800/60" />
        <div className="text-neutral-500 group-hover:text-neutral-300 transition-colors">
          {isExpanded ? (
            <ChevronUp size={14} />
          ) : (
            <ChevronDown size={14} />
          )}
        </div>
      </button>

      {isExpanded && (
        <motion.div
          variants={gridStagger}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8"
        >
          {marks.map((mark) => (
            <MarksCard key={mark.id} mark={mark} />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
function MarksPage() {
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMarks = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await marksService.getStudentMarks();
      setMarks(data);
    } catch (err) {
      console.error("Failed to load marks:", err);
      setError("Failed to load your marks. Please try again.");
      toast.error("Failed to load marks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMarks();
  }, []);

  // ── Group by semester ───────────────────────────────────────────────────────
  const semesterGroups = useMemo(() => {
    const map = new Map();
    for (const mark of marks) {
      const semKey = mark.semester || "Unknown";
      if (!map.has(semKey)) {
        map.set(semKey, []);
      }
      map.get(semKey).push(mark);
    }
    
    // Sort semesters descending
    const keys = Array.from(map.keys()).sort((a,b) => {
      if (a === "Unknown") return 1;
      if (b === "Unknown") return -1;
      return Number(b) - Number(a);
    });

    return keys.map(k => ({ semester: k, marks: map.get(k) }));
  }, [marks]);

  // ── Chart data ──────────────────────────────────────────────────────────────
  const chartData = useMemo(() => {
    return marks.map((m) => ({
      label: (m.exam_type || "").replace(/([A-Z])/g, " $1").trim(),
      value: Number(m.marks),
      maxValue: Number(m.maximum_marks),
    }));
  }, [marks]);

  // ── Summary stats ─────────────────────────────────────────────────────────
  const summaryStats = useMemo(() => {
    if (marks.length === 0) return null;
    const totalMarks = marks.reduce((s, m) => s + Number(m.marks), 0);
    const totalMax = marks.reduce((s, m) => s + Number(m.maximum_marks), 0);
    const avgPct = totalMax > 0 ? ((totalMarks / totalMax) * 100).toFixed(1) : 0;
    // Find best grade
    const gradeOrder = ["A+", "A", "B+", "B", "C", "D", "F"];
    const bestGrade = marks.reduce((best, m) => {
      const idx = gradeOrder.indexOf(m.grade);
      const bestIdx = gradeOrder.indexOf(best);
      return idx !== -1 && (bestIdx === -1 || idx < bestIdx) ? m.grade : best;
    }, "");

    return {
      totalExams: marks.length,
      avgPercentage: avgPct,
      bestGrade: bestGrade || "—",
      totalSubjects: new Set(marks.map(m => m.subject_code || m.subject_name)).size,
    };
  }, [marks]);

  // ── Loading State ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 gap-5">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-6 h-6 rounded-full border-2 border-neutral-800 border-t-indigo-400"
        />
        <p className="text-[11px] text-neutral-500 tracking-[0.2em] uppercase">
          Loading your marks
        </p>
      </div>
    );
  }

  // ── Error State ───────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 p-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4 mx-auto">
            <AlertCircle size={22} className="text-red-400" />
          </div>
          <p className="text-sm text-red-400 mb-4">{error}</p>
          <button
            onClick={loadMarks}
            className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs font-semibold transition-colors border border-neutral-700"
          >
            <RefreshCw size={12} />
            Retry
          </button>
        </motion.div>
      </div>
    );
  }

  // ── Empty State ───────────────────────────────────────────────────────────
  if (marks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 p-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-5 mx-auto">
            <GraduationCap size={24} className="text-neutral-600" />
          </div>
          <p className="text-sm text-neutral-400 mb-1">No marks available yet</p>
          <p className="text-[11px] text-neutral-600">
            Your published examination results will appear here.
          </p>
        </motion.div>
      </div>
    );
  }

  // ── Main Content ──────────────────────────────────────────────────────────
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="min-h-screen bg-neutral-950 text-neutral-400 antialiased p-4 md:p-6 lg:p-10 max-w-7xl mx-auto"
    >
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="pb-7 border-b border-neutral-800 mb-8">
        <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-[0.22em] mb-2">
          Academic Results
        </p>
        <h1 className="text-2xl font-semibold text-white tracking-tight mb-1">
          My Marks
        </h1>
        <p className="text-[11px] text-neutral-500 tracking-wide">
          View your published examination results and performance trends.
        </p>
      </motion.div>

      {/* ── Summary Stats ─────────────────────────────────────────────────── */}
      {summaryStats && (
        <motion.div
          variants={gridStagger}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {[
            {
              title: "Total Exams",
              value: summaryStats.totalExams,
              icon: BookOpen,
              iconClass: "text-indigo-400",
              strip: "from-indigo-600 via-indigo-400 to-indigo-600",
            },
            {
              title: "Subjects",
              value: summaryStats.totalSubjects,
              icon: GraduationCap,
              iconClass: "text-violet-400",
              strip: "from-violet-600 via-violet-400 to-violet-600",
            },
            {
              title: "Average",
              value: `${summaryStats.avgPercentage}%`,
              icon: TrendingUp,
              iconClass: "text-cyan-400",
              strip: "from-cyan-600 via-cyan-400 to-cyan-600",
            },
            {
              title: "Best Grade",
              value: summaryStats.bestGrade,
              icon: Award,
              iconClass: "text-amber-400",
              strip: "from-amber-600 via-amber-400 to-amber-600",
            },
          ].map(({ title, value, icon: Icon, iconClass, strip }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-2xl overflow-hidden transition-all duration-200"
            >
              <div className={`h-[3px] w-full bg-gradient-to-r ${strip}`} />
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <p className="text-[9px] font-semibold text-neutral-500 uppercase tracking-[0.2em]">
                    {title}
                  </p>
                  <div
                    className={`p-1.5 sm:p-2 bg-neutral-800 border border-neutral-700 rounded-xl ${iconClass} shrink-0`}
                  >
                    <Icon size={12} strokeWidth={1.6} />
                  </div>
                </div>
                <p className="text-xl sm:text-2xl font-semibold text-neutral-100 tracking-tight leading-none">
                  {value}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* ── Trend Chart ───────────────────────────────────────────────────── */}
      {chartData.length >= 2 && (
        <motion.div
          variants={fadeUp}
          className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden mb-8"
        >
          <div className="h-[3px] w-full bg-gradient-to-r from-indigo-600 via-violet-500 to-indigo-600" />
          <div className="p-5">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="text-indigo-400">
                <BarChart3 size={14} strokeWidth={1.6} />
              </div>
              <h2 className="text-[10px] font-bold text-neutral-300 uppercase tracking-[0.22em]">
                Performance Trend
              </h2>
              <div className="flex-1 h-px bg-neutral-800/60" />
            </div>
            <BarChart data={chartData} />
          </div>
        </motion.div>
      )}

      {/* ── Marks by Semester ─────────────────────────────────────────────── */}
      <motion.div variants={stagger}>
        {semesterGroups.map((group) => (
          <SemesterSection
            key={group.semester}
            semester={group.semester}
            marks={group.marks}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

export default MarksPage;
