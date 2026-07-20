import { useState, useMemo } from "react";
import { Search, Calendar, Clock, MapPin, Award, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { EXAM_TYPES } from "../../constants/examConstants";

function StatusBadge({ status }) {
  const configs = {
    SCHEDULED: { label: "Scheduled", className: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    RESCHEDULED: { label: "Rescheduled", className: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    CANCELLED: { label: "Cancelled", className: "text-red-400 bg-red-500/10 border-red-500/20" }
  };

  const current = configs[status] || { label: status || "Scheduled", className: "text-neutral-400 bg-neutral-800/50 border-neutral-700/50" };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider border ${current.className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {current.label}
    </span>
  );
}

function ExamTypeBadge({ type }) {
  const colors = {
    SERIES_TEST: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    MODEL_EXAM: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    UNIVERSITY_EXAM: "bg-red-500/10 text-red-400 border-red-500/20"
  };

  const config = EXAM_TYPES.find(t => t.value === type);
  const colorClass = colors[type] || "bg-neutral-500/10 text-neutral-400 border-neutral-500/20";

  return (
    <span className={`inline-flex border px-1.5 py-0.5 text-[8px] font-medium ${colorClass}`}>
      {config?.label || type || "Exam"}
    </span>
  );
}

function formatDate(date) {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatTime(time) {
  if (!time) return "N/A";
  const [hours, minutes] = time.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

export default function StudentExamHistory({ exams = [], onExamClick }) {
  const [selectedSemester, setSelectedSemester] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const uniqueSemesters = useMemo(() => {
    const sems = new Set(exams.map(e => e.semester).filter(Boolean));
    return Array.from(sems).sort((a, b) => a - b);
  }, [exams]);

  const processedExams = useMemo(() => {
    let list = [...exams];

    if (selectedSemester !== "ALL") {
      list = list.filter(e => String(e.semester) === String(selectedSemester));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(e =>
        (e.subject_name || "").toLowerCase().includes(q) ||
        (e.subject_code || "").toLowerCase().includes(q) ||
        (e.venue || "").toLowerCase().includes(q)
      );
    }

    return list.sort((a, b) => {
      const dateA = new Date(`${a.exam_date}T${a.start_time || "00:00"}`);
      const dateB = new Date(`${b.exam_date}T${b.start_time || "00:00"}`);
      return dateB - dateA;
    });
  }, [exams, selectedSemester, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Header & Filters */}
      <div className="bg-neutral-900/80 border border-neutral-800/60 p-4 flex flex-col md:flex-row items-center gap-4 justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 border border-indigo-500/15">
            <Filter size={15} className="text-indigo-400" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Exam History</h4>
            <p className="text-[10px] text-neutral-500">{processedExams.length} assessments</p>
          </div>
        </div>

        <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative w-full sm:w-56">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search exams..."
              className="w-full pl-9 pr-3 py-2 bg-neutral-950 border border-neutral-800/60 text-xs text-neutral-200 outline-none focus:border-indigo-500/50 transition-colors placeholder-neutral-500"
            />
          </div>

          <div className="relative w-full sm:w-40">
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full appearance-none px-3 py-2 pr-8 bg-neutral-950 border border-neutral-800/60 text-xs text-neutral-200 outline-none focus:border-indigo-500/50 cursor-pointer"
            >
              <option value="ALL">All Semesters</option>
              {uniqueSemesters.map(sem => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-neutral-500">
              <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      {processedExams.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-neutral-900/30 border border-neutral-800/40">
          <div className="w-12 h-12 bg-neutral-800/50 flex items-center justify-center mb-3">
            <Search size={18} className="text-neutral-500" />
          </div>
          <p className="text-sm text-neutral-400">No history found</p>
          <p className="text-[10px] text-neutral-500 mt-0.5">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {processedExams.map((exam, idx) => (
            <motion.div
              key={exam.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.01 }}
              onClick={() => onExamClick(exam)}
              className="group bg-neutral-900/50 border border-neutral-800/50 hover:border-neutral-700/50 hover:bg-neutral-900/70 p-4 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0 flex-1">
                  <h5 className="text-sm font-semibold text-white truncate group-hover:text-indigo-400 transition-colors">
                    {exam.subject_name || "Unknown"}
                  </h5>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[8px] font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5">
                      {exam.subject_code || "N/A"}
                    </span>
                    {exam.semester && (
                      <span className="text-[8px] font-medium text-neutral-500 bg-neutral-800/50 px-1.5 py-0.5">
                        S{exam.semester}
                      </span>
                    )}
                  </div>
                </div>
                <StatusBadge status={exam.status} />
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-neutral-300">
                  <Calendar size={12} className="text-neutral-500 shrink-0" />
                  <span>{formatDate(exam.exam_date)}</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-300">
                  <Clock size={12} className="text-neutral-500 shrink-0" />
                  <span className="whitespace-nowrap">{formatTime(exam.start_time)} - {formatTime(exam.end_time)}</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-300">
                  <MapPin size={12} className="text-neutral-500 shrink-0" />
                  <span className="truncate" title={exam.venue}>{exam.venue || "TBA"}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-neutral-800/40">
                <ExamTypeBadge type={exam.exam_type} />
                <span className="text-[10px] font-medium text-neutral-400 flex items-center gap-1">
                  <Award size={11} className="text-neutral-500" />
                  {exam.maximum_marks || "—"} marks
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}