import React from 'react';

function StudentForm({
  formData = {},
  handleChange,
  handleSubmit,
  submitLabel = "Save Student",
  loading = false,
  isEditMode = false,
}) {
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-50 rounded-2xl p-6 md:p-10 max-w-4xl mx-auto font-sans text-slate-900 border border-slate-100 shadow-xl shadow-slate-100/40"
    >
      {/* Decorative Form Section Header */}
      <div className="mb-8 border-b border-slate-200/60 pb-4">
        <h2 className="text-lg font-bold text-slate-800">
          {isEditMode ? 'Edit Student Record' : 'Profile Information'}
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          {isEditMode 
            ? 'Student identity information cannot be modified after registration.' 
            : 'All fields marked * are required for profile generation.'}
        </p>
      </div>

      {/* ✅ Read-only Notice for Edit Mode */}
      {isEditMode && (
        <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs text-amber-700 flex items-center gap-2">
            <span className="text-lg">🔒</span>
            <span>
              <strong>Identity fields locked:</strong> First Name, Last Name, Roll Number, and Admission Number 
              cannot be changed after registration.
            </span>
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7">

        {/* First Name - Read-only in Edit Mode */}
        <div className="relative group">
          <input
            type="text"
            name="first_name"
            id="first_name"
            value={formData.first_name || ''}
            onChange={handleChange}
            disabled={isEditMode}
            className={`peer w-full text-sm px-4 py-3 rounded-r-xl font-medium
              ${isEditMode 
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200' 
                : 'bg-white text-slate-900 border-l-2 border-l-indigo-500 border-y border-r border-slate-200 focus:outline-none focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/5'
              }`}
            required
          />
          <label 
            htmlFor="first_name"
            className="absolute left-4 -top-2.5 px-1.5 bg-white text-[11px] font-bold text-indigo-600 uppercase tracking-wider transition-all peer-focus:text-indigo-500 rounded"
          >
            First Name *
            {isEditMode && ' 🔒'}
          </label>
        </div>

        {/* Last Name - Read-only in Edit Mode */}
        <div className="relative group">
          <input
            type="text"
            name="last_name"
            id="last_name"
            value={formData.last_name || ''}
            onChange={handleChange}
            disabled={isEditMode}
            className={`peer w-full text-sm px-4 py-3 rounded-r-xl font-medium
              ${isEditMode 
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200' 
                : 'bg-white text-slate-900 border-l-2 border-l-indigo-500 border-y border-r border-slate-200 focus:outline-none focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/5'
              }`}
            required
          />
          <label 
            htmlFor="last_name"
            className="absolute left-4 -top-2.5 px-1.5 bg-white text-[11px] font-bold text-indigo-600 uppercase tracking-wider transition-all peer-focus:text-indigo-500 rounded"
          >
            Last Name *
            {isEditMode && ' 🔒'}
          </label>
        </div>

        {/* Email Address - Always Editable */}
        <div className="relative group">
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email || ''}
            onChange={handleChange}
            className="peer w-full text-sm px-4 py-3 bg-white text-slate-900 border-l-2 border-l-indigo-500 border-y border-r border-slate-200 rounded-r-xl transition-all focus:outline-none focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 font-medium"
            required
          />
          <label 
            htmlFor="email"
            className="absolute left-4 -top-2.5 px-1.5 bg-white text-[11px] font-bold text-indigo-600 uppercase tracking-wider transition-all peer-focus:text-indigo-500 rounded"
          >
            Email Address *
          </label>
        </div>

        {/* Phone Number - Always Editable */}
        <div className="relative group">
          <input
            type="tel"
            name="phone"
            id="phone"
            value={formData.phone || ''}
            onChange={handleChange}
            className="peer w-full text-sm px-4 py-3 bg-white text-slate-900 border-l-2 border-l-slate-400 border-y border-r border-slate-200 rounded-r-xl transition-all focus:outline-none focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-500/5 font-medium"
          />
          <label 
            htmlFor="phone"
            className="absolute left-4 -top-2.5 px-1.5 bg-white text-[11px] font-bold text-slate-500 uppercase tracking-wider transition-all peer-focus:text-slate-400 rounded"
          >
            Phone Number
          </label>
        </div>

        {/* Roll Number - Read-only in Edit Mode */}
        <div className="relative group">
          <input
            type="text"
            name="roll_number"
            id="roll_number"
            value={formData.roll_number || ''}
            onChange={handleChange}
            disabled={isEditMode}
            className={`peer w-full text-sm px-4 py-3 rounded-r-xl font-medium
              ${isEditMode 
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200' 
                : 'bg-white text-slate-900 border-l-2 border-l-indigo-500 border-y border-r border-slate-200 focus:outline-none focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/5'
              }`}
            required
          />
          <label 
            htmlFor="roll_number"
            className="absolute left-4 -top-2.5 px-1.5 bg-white text-[11px] font-bold text-indigo-600 uppercase tracking-wider transition-all peer-focus:text-indigo-500 rounded"
          >
            Roll Number *
            {isEditMode && ' 🔒'}
          </label>
        </div>

        {/* Admission Number - Read-only in Edit Mode */}
        <div className="relative group">
          <input
            type="text"
            name="admission_number"
            id="admission_number"
            value={formData.admission_number || ''}
            onChange={handleChange}
            disabled={isEditMode}
            className={`peer w-full text-sm px-4 py-3 rounded-r-xl font-medium
              ${isEditMode 
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200' 
                : 'bg-white text-slate-900 border-l-2 border-l-indigo-500 border-y border-r border-slate-200 focus:outline-none focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/5'
              }`}
            required
          />
          <label 
            htmlFor="admission_number"
            className="absolute left-4 -top-2.5 px-1.5 bg-white text-[11px] font-bold text-indigo-600 uppercase tracking-wider transition-all peer-focus:text-indigo-500 rounded"
          >
            Admission Number *
            {isEditMode && ' 🔒'}
          </label>
        </div>

        {/* Semester - Always Editable */}
        <div className="relative group">
          <input
            type="number"
            name="semester"
            id="semester"
            value={formData.semester || ''}
            onChange={handleChange}
            min="1"
            max="8"
            className="peer w-full text-sm px-4 py-3 bg-white text-slate-900 border-l-2 border-l-indigo-500 border-y border-r border-slate-200 rounded-r-xl transition-all focus:outline-none focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 font-medium"
            required
          />
          <label 
            htmlFor="semester"
            className="absolute left-4 -top-2.5 px-1.5 bg-white text-[11px] font-bold text-indigo-600 uppercase tracking-wider transition-all peer-focus:text-indigo-500 rounded"
          >
            Semester *
          </label>
        </div>

        {/* Academic Year - Always Editable */}
        <div className="relative group">
          <input
            type="text"
            name="academic_year"
            id="academic_year"
            value={formData.academic_year || ''}
            onChange={handleChange}
            placeholder="e.g., 2024-2025"
            className="peer w-full text-sm px-4 py-3 bg-white text-slate-900 border-l-2 border-l-indigo-500 border-y border-r border-slate-200 rounded-r-xl transition-all focus:outline-none focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 font-medium"
            required
          />
          <label 
            htmlFor="academic_year"
            className="absolute left-4 -top-2.5 px-1.5 bg-white text-[11px] font-bold text-indigo-600 uppercase tracking-wider transition-all peer-focus:text-indigo-500 rounded"
          >
            Academic Year *
          </label>
        </div>

        {/* Date of Birth - Always Editable */}
        <div className="relative group">
          <input
            type="date"
            name="date_of_birth"
            id="date_of_birth"
            value={formData.date_of_birth || ''}
            onChange={handleChange}
            className="peer w-full text-sm px-4 py-3 bg-white text-slate-900 border-l-2 border-l-slate-400 border-y border-r border-slate-200 rounded-r-xl transition-all focus:outline-none focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-500/5 font-medium"
          />
          <label 
            htmlFor="date_of_birth"
            className="absolute left-4 -top-2.5 px-1.5 bg-white text-[11px] font-bold text-slate-500 uppercase tracking-wider transition-all peer-focus:text-slate-400 rounded"
          >
            Date of Birth
          </label>
        </div>

        {/* Gender - Always Editable */}
        <div className="relative group">
          <select
            name="gender"
            id="gender"
            value={formData.gender || ''}
            onChange={handleChange}
            className="peer w-full text-sm px-4 py-3 bg-white text-slate-900 border-l-2 border-l-slate-400 border-y border-r border-slate-200 rounded-r-xl transition-all focus:outline-none focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-500/5 font-medium appearance-none"
          >
            <option value="">Select Gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
          <label 
            htmlFor="gender"
            className="absolute left-4 -top-2.5 px-1.5 bg-white text-[11px] font-bold text-slate-500 uppercase tracking-wider transition-all peer-focus:text-slate-400 rounded"
          >
            Gender
          </label>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Parent Name - Always Editable */}
        <div className="relative group">
          <input
            type="text"
            name="parent_name"
            id="parent_name"
            value={formData.parent_name || ''}
            onChange={handleChange}
            className="peer w-full text-sm px-4 py-3 bg-white text-slate-900 border-l-2 border-l-slate-400 border-y border-r border-slate-200 rounded-r-xl transition-all focus:outline-none focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-500/5 font-medium"
          />
          <label 
            htmlFor="parent_name"
            className="absolute left-4 -top-2.5 px-1.5 bg-white text-[11px] font-bold text-slate-500 uppercase tracking-wider transition-all peer-focus:text-slate-400 rounded"
          >
            Parent Name
          </label>
        </div>

        {/* Parent Phone - Always Editable */}
        <div className="relative group">
          <input
            type="tel"
            name="parent_phone"
            id="parent_phone"
            value={formData.parent_phone || ''}
            onChange={handleChange}
            className="peer w-full text-sm px-4 py-3 bg-white text-slate-900 border-l-2 border-l-slate-400 border-y border-r border-slate-200 rounded-r-xl transition-all focus:outline-none focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-500/5 font-medium"
          />
          <label 
            htmlFor="parent_phone"
            className="absolute left-4 -top-2.5 px-1.5 bg-white text-[11px] font-bold text-slate-500 uppercase tracking-wider transition-all peer-focus:text-slate-400 rounded"
          >
            Parent Phone
          </label>
        </div>

      </div>

      {/* Modern Footer Actions */}
      <div className="mt-10 pt-6 border-t border-slate-200/60 flex items-center justify-between">
        <span className="text-xs text-slate-400 hidden sm:inline">
          {isEditMode 
            ? '🔒 Identity fields are locked' 
            : '* Required fields for student registration.'}
        </span>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 active:bg-black text-white text-xs font-bold uppercase tracking-widest px-8 py-3.5 rounded-xl shadow-lg shadow-slate-900/10 transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (isEditMode ? 'Updating...' : 'Creating...') : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default StudentForm;