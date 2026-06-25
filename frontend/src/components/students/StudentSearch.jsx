import React from 'react';
import { Search, X } from 'lucide-react';

function StudentSearch({ searchTerm = '', setSearchTerm }) {
  return (
    <div className="relative w-full md:w-80">
      {/* Search Icon Container */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
        <Search className="h-4 w-4 text-neutral-500" strokeWidth={1.5} />
      </div>

      {/* Input Field Area */}
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm?.(e.target.value)}
        className="w-full pl-10 pr-9 py-2.5 text-xs bg-neutral-950 text-neutral-200 border border-neutral-800/80 focus:border-neutral-700 rounded-2xl placeholder-neutral-500 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/5 font-normal tracking-wide"
      />

      {/* Clear Search Action Button Trigger */}
      {searchTerm && (
        <button
          type="button"
          onClick={() => setSearchTerm?.('')}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-500 hover:text-neutral-300 active:text-neutral-100 transition-colors duration-200 cursor-pointer"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" strokeWidth={1.5} />
        </button>
      )}
    </div>
  );
}

export default StudentSearch;