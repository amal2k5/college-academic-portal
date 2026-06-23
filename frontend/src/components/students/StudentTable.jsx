import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

function StudentTable({ students = [], onEdit, onDelete }) {
  if (!students || students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
        <p className="text-sm font-medium text-gray-500">
          No student records available.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          {/* Table Header */}
          <thead className="bg-gray-50/70 border-b border-gray-200">
            <tr>
              <th
                scope="col"
                className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Admission No
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Roll No
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Email Address
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Semester
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Department
              </th>
              <th
                scope="col"
                className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center"
              >
                Actions
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-100 bg-white">
            {students.map((student) => (
              <tr
                key={student.id || student.admission_number}
                className="hover:bg-gray-50/80 transition-colors duration-150 group"
              >
                {/* Admission Number */}
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {student.admission_number}
                </td>

                {/* Roll Number */}
                <td className="px-6 py-4 text-sm text-gray-600">
                  {student.roll_number}
                </td>

                {/* Name */}
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  {student.first_name} {student.last_name}
                </td>

                {/* Email */}
                <td className="px-6 py-4 text-sm text-gray-500">
                  {student.email}
                </td>

                {/* Semester (Badged Layout) */}
                <td className="px-6 py-4 text-sm">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200/60">
                    Sem {student.semester}
                  </span>
                </td>

                {/* Department */}
                <td className="px-6 py-4 text-sm text-gray-600">
                  {student.department_name}
                </td>

                {/* Actions Panel */}
                <td className="px-6 py-4 text-sm text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Link
                      to={`/hod/students/${student.id}/edit`}
                      className="text-blue-600"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => onDelete(student.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 bg-white border border-gray-200 hover:bg-red-50/50 hover:border-red-200 active:bg-red-50 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-gray-400 group-hover:text-red-500 transition-colors" />
                      Delete
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
