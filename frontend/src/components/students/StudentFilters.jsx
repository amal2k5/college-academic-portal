// StudentFilters.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';

const SelectField = ({ value, onChange, options, placeholder }) => (
  <motion.div
    whileHover={{ scale: 1.01 }}
    className="relative flex-1 min-w-[140px]"
  >
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full appearance-none px-3.5 py-2.5 text-sm bg-neutral-900 text-neutral-200 border border-neutral-700/60 rounded-xl transition-all duration-200 focus:outline-none focus:border-indigo-400/60 hover:border-neutral-600 cursor-pointer"
    >
      <option value="" className="bg-neutral-900 text-neutral-500">{placeholder}</option>
      {options.map(({ value, label }) => (
        <option key={value} value={value} className="bg-neutral-900 text-neutral-200">{label}</option>
      ))}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500 pointer-events-none" />
  </motion.div>
);

function StudentFilters({ semesterFilter = '', setSemesterFilter, genderFilter = '', setGenderFilter }) {
  const hasActiveFilters = semesterFilter || genderFilter;

  const semesterOptions = Array.from({ length: 8 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `Semester ${i + 1}`
  }));

  const genderOptions = [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
    { value: 'OTHER', label: 'Other' }
  ];

  const clearFilters = () => {
    setSemesterFilter('');
    setGenderFilter('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3.5 bg-neutral-900/80 border border-neutral-800/60 rounded-2xl"
    >
      <div className="flex items-center gap-2 text-xs font-medium text-neutral-400 uppercase tracking-wider whitespace-nowrap">
        <SlidersHorizontal className="h-3.5 w-3.5 text-neutral-500" />
        <span className="hidden sm:inline">Filters</span>
      </div>

      <SelectField
        value={semesterFilter}
        onChange={setSemesterFilter}
        options={semesterOptions}
        placeholder="All Semesters"
      />

      <SelectField
        value={genderFilter}
        onChange={setGenderFilter}
        options={genderOptions}
        placeholder="All Genders"
      />

      {hasActiveFilters && (
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={clearFilters}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-400 hover:text-white bg-neutral-800/50 hover:bg-neutral-800 rounded-lg transition-colors whitespace-nowrap"
        >
          <X className="h-3.5 w-3.5" />
          Clear
        </motion.button>
      )}
    </motion.div>
  );
}

export default StudentFilters;