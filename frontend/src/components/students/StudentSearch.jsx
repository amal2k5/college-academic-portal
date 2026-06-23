import React from 'react';
import { Search, X } from 'lucide-react';

function StudentSearch({ searchTerm = '', setSearchTerm }) {
  return (
    <div className="relative w-full md:w-80">
      {/* Search Icon */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" />
      </div>

      {/* Input Field */}
      <input
        type="text"
        placeholder="Search by name, email, roll no..."
        value={searchTerm}
        onChange={(e) => setSearchTerm?.(e.target.value)}
        className="w-full pl-10 pr-9 py-2 text-sm bg-white text-gray-900 border border-gray-200 rounded-lg placeholder-gray-400 shadow-sm transition-all focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
      />


      {searchTerm && (
        <button
          type="button"
          onClick={() => setSearchTerm?.('')}
          className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-gray-400 hover:text-gray-600 active:text-gray-800 transition-colors"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export default StudentSearch;