// StudentSearch.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';

function StudentSearch({ searchTerm = '', setSearchTerm, placeholder = 'Search students...' }) {
  const isActive = searchTerm?.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full md:w-72 group"
    >
      <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${isActive ? 'text-indigo-400' : 'text-neutral-500'
        }`} />

      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm?.(e.target.value)}
        className="w-full pl-10 pr-9 py-2.5 text-sm bg-neutral-900 text-neutral-200 border border-neutral-700/60 rounded-xl transition-all duration-200 focus:outline-none focus:border-indigo-400/60 hover:border-neutral-600 placeholder:text-neutral-500"
      />

      <AnimatePresence>
        {isActive && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={() => setSearchTerm?.('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-200 transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Search Stats */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute -bottom-5 left-0 text-[10px] text-neutral-500 font-medium"
          >
            {searchTerm.length} {searchTerm.length === 1 ? 'character' : 'characters'}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default StudentSearch;