import React from 'react';
// Note: If you don't have lucide-react, install it via `npm install lucide-react`
import { ChevronDown, Filter } from 'lucide-react';

function StudentFilters({
  semesterFilter = '',
  setSemesterFilter,
  genderFilter = '',
  setGenderFilter,
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      {/* Visual Filter Indicator Label for Context */}
      <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:flex">
        <Filter className="h-3.5 w-3.5" />
        <span>Filters:</span>
      </div>

      {/* Semester Dropdown */}
      <div className="relative w-full sm:w-44">
        <select
          value={semesterFilter}
          onChange={(e) => setSemesterFilter?.(e.target.value)}
          className="w-full appearance-none pl-3 pr-10 py-2 text-sm bg-white text-gray-700 border border-gray-200 rounded-lg shadow-sm transition-all focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
        >
          <option value="">All Semesters</option>
          {Array.from({ length: 8 }, (_, i) => i + 1).map((sem) => (
            <option key={sem} value={sem.toString()}>
              Semester {sem}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>

      {/* Gender Dropdown */}
      <div className="relative w-full sm:w-40">
        <select
          value={genderFilter}
          onChange={(e) => setGenderFilter?.(e.target.value)}
          className="w-full appearance-none pl-3 pr-10 py-2 text-sm bg-white text-gray-700 border border-gray-200 rounded-lg shadow-sm transition-all focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
        >
          <option value="">All Genders</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

export default StudentFilters;