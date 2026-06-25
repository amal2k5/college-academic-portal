import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

function StudentTable({ students = [], onEdit, onDelete }) {
  if (!students || students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-neutral-900/20 border border-dashed border-neutral-800 rounded-3xl relative overflow-hidden backdrop-blur-md">
        {/* Subtle background reflection flare */}
        <div className="absolute w-48 h-44 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <p className="text-xs font-normal text-neutral-500 tracking-wide relative z-10">
          No student records available at this time.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900/30 border border-neutral-800/50 rounded-[32px] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl relative">
      {/* Structural Left-Side Silver Metallic Accent Rail */}
      <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-white/20 to-transparent rounded-l-[32px] z-20" />

      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
        <table className="w-full text-left border-collapse whitespace-nowrap relative z-10">
          
          {/* Table Header */}
          <thead className="bg-neutral-950 border-b border-neutral-800/60">
            <tr>
              <th
                scope="col"
                className="px-6 py-4 text-[9px] font-medium text-neutral-400 uppercase tracking-widest pl-7"
              >
                Admission Number
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-[9px] font-medium text-neutral-400 uppercase tracking-widest"
              >
                Roll Number
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-[9px] font-medium text-neutral-400 uppercase tracking-widest"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-[9px] font-medium text-neutral-400 uppercase tracking-widest"
              >
                Email Address
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-[9px] font-medium text-neutral-400 uppercase tracking-widest"
              >
                Semester
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-[9px] font-medium text-neutral-400 uppercase tracking-widest"
              >
                Department
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-[9px] font-medium text-neutral-400 uppercase tracking-widest text-center pr-7"
              >
                Actions
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-neutral-800/40 bg-transparent">
            {students.map((student) => (
              <tr
                key={student.id || student.admission_number}
                className="hover:bg-neutral-900/30 transition-colors duration-200 group"
              >
                {/* Admission Number */}
                <td className="px-6 py-4 text-xs font-normal text-neutral-200 pl-7">
                  {student.admission_number}
                </td>

                {/* Roll Number */}
                <td className="px-6 py-4 text-xs font-mono text-neutral-400 tracking-wide">
                  {student.roll_number}
                </td>

                {/* Name */}
                <td className="px-6 py-4 text-xs font-medium text-neutral-200 tracking-wide">
                  {student.first_name} {student.last_name}
                </td>

                {/* Email */}
                <td className="px-6 py-4 text-xs font-normal text-neutral-400">
                  {student.email}
                </td>

                {/* Semester */}
                <td className="px-6 py-4 text-xs">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-medium bg-neutral-950 text-neutral-300 border border-neutral-800/80">
                    Sem {student.semester}
                  </span>
                </td>

                {/* Department */}
                <td className="px-6 py-4 text-xs font-normal text-neutral-400">
                  {student.department_name}
                </td>

                {/* Actions Panel */}
                <td className="px-6 py-4 text-xs text-center pr-7">
                  <div className="flex items-center justify-center gap-3">
                    
                    {/* Edit Action Button */}
                    <Link
                      to={`/hod/students/${student.id}/edit`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-medium uppercase tracking-widest text-neutral-400 bg-neutral-950 border border-neutral-800/60 hover:text-white hover:border-neutral-700 transition duration-200 shadow-sm"
                    >
                      <Edit2 className="w-3 h-3 text-neutral-500 group-hover:text-neutral-300 transition-colors" strokeWidth={1.5} />
                      <span>Edit</span>
                    </Link>

                    {/* Delete Action Button */}
                    <button
                      type="button"
                      onClick={() => onDelete(student.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-medium uppercase tracking-widest text-rose-500 bg-neutral-950 border border-neutral-800/60 hover:text-rose-400 hover:bg-rose-950/10 hover:border-rose-900/50 active:bg-rose-950/20 transition duration-200 shadow-sm cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3 text-rose-500/60 group-hover:text-rose-400 transition-colors" strokeWidth={1.5} />
                      <span>Delete</span>
                    </button>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentTable;