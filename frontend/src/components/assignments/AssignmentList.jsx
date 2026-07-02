import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList } from "lucide-react";
import AssignmentCard from "./AssignmentCard";

function AssignmentList({ assignments = [], onEdit, onDelete }) {
  if (assignments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
        <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-4 text-neutral-600">
          <ClipboardList size={32} />
        </div>
        <h3 className="text-neutral-200 font-medium text-lg mb-1">No assignments found</h3>
        <p className="text-neutral-500 text-sm max-w-xs mx-auto">Create your first assignment to see it appear here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <AnimatePresence mode="popLayout">
        {assignments.map((assignment) => (
          <AssignmentCard 
            key={assignment.id} 
            assignment={assignment} 
            onEdit={onEdit} 
            onDelete={onDelete} 
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

export default AssignmentList;