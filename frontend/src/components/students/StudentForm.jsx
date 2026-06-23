import React from 'react';

function StudentForm({
  formData = {},
  handleChange,
  handleSubmit,
  submitLabel = "Save Student",
}) {
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-50 rounded-2xl p-6 md:p-10 max-w-4xl mx-auto font-sans text-slate-900 border border-slate-100 shadow-xl shadow-slate-100/40"
    >
      {/* Decorative Form Section Header */}
      <div className="mb-8 border-b border-slate-200/60 pb-4">
        <h2 className="text-lg font-bold text-slate-800">Profile Information</h2>
        <p className="text-xs text-slate-400 mt-0.5">All fields marked are required for profile generation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7">
        
        {/* First Name */}
        <div className="relative group">
          <input
            type="text"
            name="first_name"
            id="first_name"
            value={formData.first_name || ''}
            onChange={handleChange}
            className="peer w-full text-sm px-4 py-3 bg-white text-slate-900 border-l-2 border-l-indigo-500 border-y border-r border-slate-200 rounded-r-xl transition-all focus:outline-none focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 font-medium"
            required
          />
          <label 
            htmlFor="first_name"
            className="absolute left-4 -top-2.5 px-1.5 bg-white text-[11px] font-bold text-indigo-600 uppercase tracking-wider transition-all peer-focus:text-indigo-500 rounded"
          >
            First Name
          </label>
        </div>

        {/* Last Name */}
        <div className="relative group">
          <input
            type="text"
            name="last_name"
            id="last_name"
            value={formData.last_name || ''}
            onChange={handleChange}
            className="peer w-full text-sm px-4 py-3 bg-white text-slate-900 border-l-2 border-l-indigo-500 border-y border-r border-slate-200 rounded-r-xl transition-all focus:outline-none focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 font-medium"
            required
          />
          <label 
            htmlFor="last_name"
            className="absolute left-4 -top-2.5 px-1.5 bg-white text-[11px] font-bold text-indigo-600 uppercase tracking-wider transition-all peer-focus:text-indigo-500 rounded"
          >
            Last Name
          </label>
        </div>

        {/* Email Address */}
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
            Email Address
          </label>
        </div>

        {/* Phone Number */}
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

        {/* Roll Number */}
        <div className="relative group">
          <input
            type="text"
            name="roll_number"
            id="roll_number"
            value={formData.roll_number || ''}
            onChange={handleChange}
            className="peer w-full text-sm px-4 py-3 bg-white text-slate-900 border-l-2 border-l-indigo-500 border-y border-r border-slate-200 rounded-r-xl transition-all focus:outline-none focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 font-medium"
            required
          />
          <label 
            htmlFor="roll_number"
            className="absolute left-4 -top-2.5 px-1.5 bg-white text-[11px] font-bold text-indigo-600 uppercase tracking-wider transition-all peer-focus:text-indigo-500 rounded"
          >
            Roll Number
          </label>
        </div>

        {/* Admission Number */}
        <div className="relative group">
          <input
            type="text"
            name="admission_number"
            id="admission_number"
            value={formData.admission_number || ''}
            onChange={handleChange}
            className="peer w-full text-sm px-4 py-3 bg-white text-slate-900 border-l-2 border-l-indigo-500 border-y border-r border-slate-200 rounded-r-xl transition-all focus:outline-none focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 font-medium"
            required
          />
          <label 
            htmlFor="admission_number"
            className="absolute left-4 -top-2.5 px-1.5 bg-white text-[11px] font-bold text-indigo-600 uppercase tracking-wider transition-all peer-focus:text-indigo-500 rounded"
          >
            Admission Number
          </label>
        </div>

      </div>

      {/* Modern Footer Actions */}
      <div className="mt-10 pt-6 border-t border-slate-200/60 flex items-center justify-between">
        <span className="text-xs text-slate-400 hidden sm:inline">Ensure information matches institutional records.</span>
        
        <button
          type="submit"
          className="w-full sm:w-auto inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 active:bg-black text-white text-xs font-bold uppercase tracking-widest px-8 py-3.5 rounded-xl shadow-lg shadow-slate-900/10 transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

export default StudentForm;