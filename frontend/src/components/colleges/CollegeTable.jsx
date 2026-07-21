import { motion, AnimatePresence } from "framer-motion";
import { Building, Globe, MapPin, Eye, Edit, Trash2 } from "lucide-react";

function CollegeTable({ colleges, onEdit, onDelete, onView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-neutral-800/60 rounded-2xl bg-neutral-900/70 overflow-hidden shadow-xl"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-800/50 bg-neutral-900/50">
              <th className="px-5 py-3 text-left w-[30%]">
                <div className="flex items-center gap-2 text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
                  <Building className="w-3.5 h-3.5" />
                  College
                </div>
              </th>
              <th className="px-5 py-3 text-left w-[20%]">
                <div className="flex items-center gap-2 text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
                  <Globe className="w-3.5 h-3.5" />
                  Domain
                </div>
              </th>
              <th className="px-5 py-3 text-left w-[20%]">
                <div className="flex items-center gap-2 text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5" />
                  Location
                </div>
              </th>
              <th className="px-5 py-3 text-left w-[15%]">
                <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
                  Status
                </span>
              </th>
              <th className="px-5 py-3 text-right w-[15%]">
                <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </span>
              </th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-neutral-800/30">
            <AnimatePresence mode="wait">
              {colleges.map((college, index) => (
                <motion.tr
                  key={college.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  whileHover={{ backgroundColor: "rgba(38, 38, 38, 0.3)" }} // neutral-800/30
                  className="group transition-colors duration-150"
                >
                  {/* College Name */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-neutral-800/50 border border-neutral-700/50 flex items-center justify-center shrink-0">
                        <span className="text-[11px] font-semibold text-neutral-400">
                          {college.name?.[0]}
                        </span>
                      </div>
                      <span className="text-sm text-white font-medium truncate">
                        {college.name}
                      </span>
                    </div>
                  </td>

                  {/* Domain */}
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-neutral-400 font-mono bg-neutral-800/30 px-2 py-0.5 rounded border border-neutral-700/30 truncate max-w-[160px] inline-block">
                      {college.email_domain}
                    </span>
                  </td>

                  {/* Location */}
                  <td className="px-5 py-3.5">
                    <span className="text-sm text-neutral-400 truncate max-w-[160px] block">
                      {college.location}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        college.is_active ? "bg-emerald-400" : "bg-neutral-500"
                      }`} />
                      <span className={`text-xs font-medium ${
                        college.is_active ? "text-emerald-400" : "text-neutral-400"
                      }`}>
                        {college.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      {onView && (
                        <button
                          onClick={() => onView(college)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-400 bg-neutral-800/50 border border-neutral-700/50 hover:text-indigo-400 hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                      )}
                      
                      {onEdit && (
                        <button
                          onClick={() => onEdit(college)}
                          className="p-1.5 rounded-lg text-neutral-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {onDelete && (
                        <button
                          onClick={() => onDelete(college.id)}
                          className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {colleges.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="p-4 rounded-xl bg-neutral-800/30 border border-neutral-800/50">
              <Building className="w-8 h-8 text-neutral-600" />
            </div>
            <p className="text-sm text-neutral-500">No colleges found</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default CollegeTable;