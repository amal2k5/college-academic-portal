import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Clock, 
  AlertCircle, 
  Download, 
  FileText, 
  Pencil, 
  Trash2, 
  MoreVertical 
} from "lucide-react";

function getTimeLeft(deadline) {
  const now = new Date();
  const end = new Date(deadline);
  const diff = end - now;

  if (diff <= 0) return { text: "Overdue", isLate: true, color: "text-red-400" };
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) return { text: `${days}d ${hours}h left`, isLate: false, color: "text-indigo-400" };
  if (hours > 0) return { text: `${hours}h left`, isLate: false, color: "text-amber-400" };
  return { text: "Due soon", isLate: false, color: "text-emerald-400" };
}

function AssignmentCard({ assignment, onEdit, onDelete }) {
  const [timeInfo, setTimeInfo] = useState(getTimeLeft(assignment.deadline));

  // Update countdown every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeInfo(getTimeLeft(assignment.deadline));
    }, 60000);
    return () => clearInterval(interval);
  }, [assignment.deadline]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      layout
      className="group relative rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 overflow-hidden"
    >
      {/* Status Bar */}
      <div className={`h-1 w-full ${timeInfo.isLate ? 'bg-red-500' : 'bg-indigo-500'}`} />

      <div className="p-6 space-y-5">
        {/* Header: Subject & Year */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-block px-2 py-0.5 rounded-md bg-neutral-800 text-[10px] font-bold uppercase tracking-wider text-neutral-400 border border-neutral-700">
              {assignment.subject}
            </span>
            <h3 className="text-lg font-semibold text-neutral-100 leading-snug line-clamp-1">
              {assignment.title}
            </h3>
          </div>
          
          {/* Actions Dropdown Trigger (Simplified as buttons for this demo) */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onEdit(assignment)} className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors">
              <Pencil size={14} />
            </button>
            <button onClick={() => onDelete(assignment.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-neutral-400 hover:text-red-400 transition-colors">
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-neutral-400 line-clamp-2 leading-relaxed">
          {assignment.description}
        </p>

        {/* Meta Data Grid */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          {/* Deadline */}
          <div className={`flex items-center gap-2 text-xs font-medium ${timeInfo.color}`}>
            {timeInfo.isLate ? <AlertCircle size={14} /> : <Clock size={14} />}
            <span>{timeInfo.text}</span>
          </div>

          {/* Marks */}
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-400">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
            Max Marks: {assignment.max_marks}
          </div>
        </div>

        {/* Footer: Attachment & Target Year */}
        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500">
              <FileText size={14} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-neutral-500 uppercase font-semibold">Attachment</span>
              {assignment.attachment ? (
                <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                  Download PDF <Download size={10} />
                </a>
              ) : (
                <span className="text-xs text-neutral-600 italic">No file</span>
              )}
            </div>
          </div>

          <div className="px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[10px] font-bold text-neutral-400">
            Year {assignment.target_year}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default AssignmentCard;