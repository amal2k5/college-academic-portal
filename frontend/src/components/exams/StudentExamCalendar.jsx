import { useState, useMemo, useCallback } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getExamTypeLabel } from "../../constants/examConstants";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function StudentExamCalendar({ exams = [], onExamClick }) {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const getDaysInMonth = useCallback((y, m) => new Date(y, m + 1, 0).getDate(), []);
  const getFirstDayOfMonth = useCallback((y, m) => new Date(y, m, 1).getDay(), []);

  const cells = useMemo(() => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayIndex = getFirstDayOfMonth(year, month);
    const prevMonthDays = getDaysInMonth(year, month - 1);
    const result = [];

    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const m = month === 0 ? 11 : month - 1;
      const y = month === 0 ? year - 1 : year;
      result.push({ day: d, isCurrentMonth: false, dateStr: `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}` });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      result.push({ day: i, isCurrentMonth: true, dateStr: `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}` });
    }

    const remaining = result.length % 7;
    if (remaining > 0) {
      const nextDays = 7 - remaining;
      for (let i = 1; i <= nextDays; i++) {
        const m = month === 11 ? 0 : month + 1;
        const y = month === 11 ? year + 1 : year;
        result.push({ day: i, isCurrentMonth: false, dateStr: `${y}-${String(m + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}` });
      }
    }
    return result;
  }, [year, month, getDaysInMonth, getFirstDayOfMonth]);

  const isToday = useCallback((dateStr) => {
    const d = new Date();
    return dateStr === `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }, []);

  const examMap = useMemo(() => {
    const map = new Map();
    exams.forEach(exam => {
      if (!map.has(exam.exam_date)) map.set(exam.exam_date, []);
      map.get(exam.exam_date).push(exam);
    });
    return map;
  }, [exams]);

  const getExamStatusStyle = (exam) => {
    if (exam.status === "CANCELLED") return "bg-red-500/20 text-red-300 border-red-500/30 line-through";
    if (exam.status === "RESCHEDULED") return "bg-amber-500/20 text-amber-300 border-amber-500/30";
    return "bg-indigo-500/20 text-indigo-300 border-indigo-500/30";
  };

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const handleToday = () => setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));

  return (
    <div className="bg-neutral-900/80 border border-neutral-700/60 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/20 border border-indigo-400/20">
            <CalendarIcon className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{MONTHS[month]} {year}</h3>
            <p className="text-xs text-neutral-400 font-medium">Exam Calendar</p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-neutral-800/50 border border-neutral-700/50 p-1">
          <button onClick={handlePrevMonth} className="p-2 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors">
            <ChevronLeft size={18} />
          </button>
          <button onClick={handleToday} className="px-3 py-1.5 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors text-xs font-semibold tracking-wider">
            Today
          </button>
          <button onClick={handleNextMonth} className="p-2 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-2 mb-3">
        {WEEKDAYS.map((day) => (
          <div key={day} className="text-center text-xs font-bold text-neutral-400 uppercase tracking-wider py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-2">
        {cells.map((cell, idx) => {
          const dayExams = examMap.get(cell.dateStr) || [];
          const isTodayDate = isToday(cell.dateStr);

          return (
            <div
              key={idx}
              className={`min-h-[100px] p-3 border transition-all duration-200 ${cell.isCurrentMonth
                ? `bg-neutral-800/40 border-neutral-700/50 hover:border-neutral-600/50 ${isTodayDate ? 'ring-2 ring-indigo-400/50 border-indigo-400/30 shadow-lg shadow-indigo-500/10' : ''}`
                : "bg-neutral-800/20 border-neutral-700/30 opacity-40"
                }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-bold ${isTodayDate ? 'text-indigo-400 bg-indigo-500/20 px-2 py-0.5' : cell.isCurrentMonth ? 'text-white' : 'text-neutral-500'}`}>
                  {cell.day}
                </span>
                {dayExams.length > 0 && cell.isCurrentMonth && (
                  <span className="w-2 h-2 bg-indigo-400 animate-pulse" />
                )}
              </div>

              <div className="flex flex-col gap-1.5 max-h-[60px] overflow-y-auto custom-scrollbar">
                {cell.isCurrentMonth && dayExams.slice(0, 2).map((exam) => (
                  <div
                    key={exam.id}
                    onClick={() => onExamClick(exam)}
                    className={`text-xs px-2 py-1.5 border text-left font-medium cursor-pointer transition-all hover:translate-x-1 ${getExamStatusStyle(exam)}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate">{exam.subject_code || "Exam"}</span>
                      {exam.start_time && (
                        <span className="text-[10px] opacity-70 flex items-center gap-1 shrink-0">
                          <Clock size={10} /> {exam.start_time.substring(0, 5)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {dayExams.length > 2 && (
                  <div className="text-xs text-neutral-400 font-medium text-center">+{dayExams.length - 2} more</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-4 pt-4 border-t border-neutral-700/30">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-indigo-400" />
          <span className="text-xs text-neutral-300">Scheduled</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-amber-400" />
          <span className="text-xs text-neutral-300">Rescheduled</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-red-400" />
          <span className="text-xs text-neutral-300">Cancelled</span>
        </div>
      </div>
    </div>
  );
}