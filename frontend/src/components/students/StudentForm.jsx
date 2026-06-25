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
      className="bg-neutral-900/40 border border-neutral-800/60 rounded-[32px] p-6 md:p-10 max-w-4xl mx-auto font-sans text-neutral-400 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl"
    >
      {/* Soft silver corner reflection flare */}
      <div className="absolute -right-24 -top-24 w-64 h-64 bg-white/5 rounded-full blur-[80px] pointer-events-none z-0" />

      <div className="relative z-10 space-y-8">
        {/* Form Section Header */}
        <div className="border-b border-neutral-800/60 pb-5">
          <h2 className="text-base font-medium text-neutral-200 tracking-wide">
            {isEditMode ? 'Modify Student Record' : 'Student Profile Information'}
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            {isEditMode 
              ? 'Core structural account identification settings remain protected after registration.' 
              : 'Please populate all fields marked with an asterisk to generate an active institutional profile.'}
          </p>
        </div>

        {/* Read-only Notice for Edit Mode */}
        {isEditMode && (
          <div className="p-4 bg-amber-950/10 border border-amber-900/30 rounded-2xl shadow-inner">
            <p className="text-xs text-amber-400/90 flex items-center gap-3 font-normal leading-relaxed">
              <span className="text-sm">🔒</span>
              <span>
                <span className="text-amber-300 font-medium">Account Metrics Protected:</span> First Name, Last Name, Roll Number, and Admission Number are permanently locked onto the ledger.
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
              className={`peer w-full text-xs px-4 py-3 rounded-2xl font-normal tracking-wide transition-all duration-200
                ${isEditMode 
                  ? 'bg-neutral-950/60 text-neutral-600 cursor-not-allowed border border-neutral-900/80 shadow-inner' 
                  : 'bg-neutral-950 text-neutral-200 border-l-2 border-l-indigo-500/50 border-y border-r border-neutral-800/80 focus:outline-none focus:border-neutral-700 focus:ring-4 focus:ring-white/5'
                }`}
              required
            />
            <label 
              htmlFor="first_name"
              className="absolute left-4 -top-2 px-1.5 bg-neutral-950 text-[9px] font-medium text-neutral-400 uppercase tracking-widest transition-all peer-focus:text-neutral-300 rounded"
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
              className={`peer w-full text-xs px-4 py-3 rounded-2xl font-normal tracking-wide transition-all duration-200
                ${isEditMode 
                  ? 'bg-neutral-950/60 text-neutral-600 cursor-not-allowed border border-neutral-900/80 shadow-inner' 
                  : 'bg-neutral-950 text-neutral-200 border-l-2 border-l-indigo-500/50 border-y border-r border-neutral-800/80 focus:outline-none focus:border-neutral-700 focus:ring-4 focus:ring-white/5'
                }`}
              required
            />
            <label 
              htmlFor="last_name"
              className="absolute left-4 -top-2 px-1.5 bg-neutral-950 text-[9px] font-medium text-neutral-400 uppercase tracking-widest transition-all peer-focus:text-neutral-300 rounded"
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
              className="peer w-full text-xs px-4 py-3 bg-neutral-950 text-neutral-200 border-l-2 border-l-indigo-500/50 border-y border-r border-neutral-800/80 rounded-2xl transition-all focus:outline-none focus:border-neutral-700 focus:ring-4 focus:ring-white/5 font-normal tracking-wide"
              required
            />
            <label 
              htmlFor="email"
              className="absolute left-4 -top-2 px-1.5 bg-neutral-950 text-[9px] font-medium text-neutral-400 uppercase tracking-widest transition-all peer-focus:text-neutral-300 rounded"
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
              className="peer w-full text-xs px-4 py-3 bg-neutral-950 text-neutral-200 border-l-2 border-l-neutral-600 border-y border-r border-neutral-800/80 rounded-2xl transition-all focus:outline-none focus:border-neutral-700 focus:ring-4 focus:ring-white/5 font-normal tracking-wide"
            />
            <label 
              htmlFor="phone"
              className="absolute left-4 -top-2 px-1.5 bg-neutral-950 text-[9px] font-medium text-neutral-500 uppercase tracking-widest transition-all peer-focus:text-neutral-400 rounded"
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
              className={`peer w-full text-xs px-4 py-3 rounded-2xl font-normal tracking-wide transition-all duration-200
                ${isEditMode 
                  ? 'bg-neutral-950/60 text-neutral-600 cursor-not-allowed border border-neutral-900/80 shadow-inner' 
                  : 'bg-neutral-950 text-neutral-200 border-l-2 border-l-indigo-500/50 border-y border-r border-neutral-800/80 focus:outline-none focus:border-neutral-700 focus:ring-4 focus:ring-white/5'
                }`}
              required
            />
            <label 
              htmlFor="roll_number"
              className="absolute left-4 -top-2 px-1.5 bg-neutral-950 text-[9px] font-medium text-neutral-400 uppercase tracking-widest transition-all peer-focus:text-neutral-300 rounded"
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
              className={`peer w-full text-xs px-4 py-3 rounded-2xl font-normal tracking-wide transition-all duration-200
                ${isEditMode 
                  ? 'bg-neutral-950/60 text-neutral-600 cursor-not-allowed border border-neutral-900/80 shadow-inner' 
                  : 'bg-neutral-950 text-neutral-200 border-l-2 border-l-indigo-500/50 border-y border-r border-neutral-800/80 focus:outline-none focus:border-neutral-700 focus:ring-4 focus:ring-white/5'
                }`}
              required
            />
            <label 
              htmlFor="admission_number"
              className="absolute left-4 -top-2 px-1.5 bg-neutral-950 text-[9px] font-medium text-neutral-400 uppercase tracking-widest transition-all peer-focus:text-neutral-300 rounded"
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
              className="peer w-full text-xs px-4 py-3 bg-neutral-950 text-neutral-200 border-l-2 border-l-indigo-500/50 border-y border-r border-neutral-800/80 rounded-2xl transition-all focus:outline-none focus:border-neutral-700 focus:ring-4 focus:ring-white/5 font-normal tracking-wide"
              required
            />
            <label 
              htmlFor="semester"
              className="absolute left-4 -top-2 px-1.5 bg-neutral-950 text-[9px] font-medium text-neutral-400 uppercase tracking-widest transition-all peer-focus:text-neutral-300 rounded"
            >
              Current Semester *
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
              className="peer w-full text-xs px-4 py-3 bg-neutral-950 text-neutral-200 border-l-2 border-l-indigo-500/50 border-y border-r border-neutral-800/80 rounded-2xl transition-all focus:outline-none focus:border-neutral-700 focus:ring-4 focus:ring-white/5 font-normal tracking-wide"
              required
            />
            <label 
              htmlFor="academic_year"
              className="absolute left-4 -top-2 px-1.5 bg-neutral-950 text-[9px] font-medium text-neutral-400 uppercase tracking-widest transition-all peer-focus:text-neutral-300 rounded"
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
              className="peer w-full text-xs px-4 py-3 bg-neutral-950 text-neutral-200 border-l-2 border-l-neutral-600 border-y border-r border-neutral-800/80 rounded-2xl transition-all focus:outline-none focus:border-neutral-700 focus:ring-4 focus:ring-white/5 font-normal tracking-wide custom-calendar-picker"
            />
            <label 
              htmlFor="date_of_birth"
              className="absolute left-4 -top-2 px-1.5 bg-neutral-950 text-[9px] font-medium text-neutral-500 uppercase tracking-widest transition-all peer-focus:text-neutral-400 rounded"
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
              className="peer w-full text-xs px-4 py-3 bg-neutral-950 text-neutral-200 border-l-2 border-l-neutral-600 border-y border-r border-neutral-800/80 rounded-2xl transition-all focus:outline-none focus:border-neutral-700 focus:ring-4 focus:ring-white/5 font-normal tracking-wide appearance-none cursor-pointer"
            >
              <option value="" className="bg-neutral-950 text-neutral-500">Select Gender</option>
              <option value="MALE" className="bg-neutral-950 text-neutral-200">Male</option>
              <option value="FEMALE" className="bg-neutral-950 text-neutral-200">Female</option>
              <option value="OTHER" className="bg-neutral-950 text-neutral-200">Other</option>
            </select>
            <label 
              htmlFor="gender"
              className="absolute left-4 -top-2 px-1.5 bg-neutral-950 text-[9px] font-medium text-slate-500 uppercase tracking-widest transition-all peer-focus:text-neutral-400 rounded"
            >
              Gender
            </label>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-3.5 h-3.5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
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
              className="peer w-full text-xs px-4 py-3 bg-neutral-950 text-neutral-200 border-l-2 border-l-neutral-600 border-y border-r border-neutral-800/80 rounded-2xl transition-all focus:outline-none focus:border-neutral-700 focus:ring-4 focus:ring-white/5 font-normal tracking-wide"
            />
            <label 
              htmlFor="parent_name"
              className="absolute left-4 -top-2 px-1.5 bg-neutral-950 text-[9px] font-medium text-slate-500 uppercase tracking-widest transition-all peer-focus:text-neutral-400 rounded"
            >
              Parent / Guardian Name
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
              className="peer w-full text-xs px-4 py-3 bg-neutral-950 text-neutral-200 border-l-2 border-l-neutral-600 border-y border-r border-neutral-800/80 rounded-2xl transition-all focus:outline-none focus:border-neutral-700 focus:ring-4 focus:ring-white/5 font-normal tracking-wide"
            />
            <label 
              htmlFor="parent_phone"
              className="absolute left-4 -top-2 px-1.5 bg-neutral-950 text-[9px] font-medium text-slate-500 uppercase tracking-widest transition-all peer-focus:text-neutral-400 rounded"
            >
              Parent's Contact Number
            </label>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="mt-10 pt-6 border-t border-neutral-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">
            
          </span>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center bg-white hover:bg-neutral-200 active:bg-neutral-300 text-black text-xs font-medium uppercase tracking-widest px-8 py-3.5 rounded-xl shadow-lg transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:translate-y-0"
          >
            {loading ? (isEditMode ? 'Updating...' : 'Registering...') : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}

export default StudentForm;