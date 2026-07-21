import { motion } from "framer-motion";
import { Eye, Edit2, Power, Building2 } from "lucide-react";
import Badge from "../common/Badge";

function DepartmentTable({
  departments,
  onEdit,
  onView,
  onToggleStatus,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border border-neutral-800/60 rounded-2xl bg-neutral-900/70 backdrop-blur-xl overflow-hidden shadow-xl"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-800/50 bg-neutral-900/30">
              <th className="px-5 py-3 text-left">
                <div className="flex items-center gap-2 text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
                  <Building2 className="w-3.5 h-3.5" />
                  Department
                </div>
              </th>
              <th className="px-5 py-3 text-left">
                <div className="flex items-center gap-2 text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
                  Status
                </div>
              </th>
              <th className="px-5 py-3 text-right">
                <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/30">
            {departments.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Building2 className="w-8 h-8 text-neutral-700" />
                    <p className="text-sm text-neutral-500">No departments found</p>
                  </div>
                </td>
              </tr>
            ) : (
              departments.map((department, index) => (
                <motion.tr
                  key={department.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  whileHover={{ backgroundColor: "rgba(38, 38, 38, 0.3)" }} // neutral-800/30
                  className="group transition-colors duration-150"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-neutral-800/50 border border-neutral-700/50 flex items-center justify-center text-xs font-medium text-neutral-300">
                        {department.name?.[0]?.toUpperCase()}
                      </div>
                      <span className="text-sm text-white font-medium">
                        {department.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        department.is_active ? "bg-emerald-400" : "bg-neutral-500"
                      }`} />
                      <span className={`text-xs font-medium ${
                        department.is_active ? "text-emerald-400" : "text-neutral-400"
                      }`}>
                        {department.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onView(department)}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-150"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(department)}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all duration-150"
                        title="Edit Department"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onToggleStatus(department.id, department.is_active)}
                        className={`p-1.5 rounded-lg transition-all duration-150 ${
                          department.is_active
                            ? "text-neutral-500 hover:text-red-400 hover:bg-red-500/10"
                            : "text-neutral-500 hover:text-emerald-400 hover:bg-emerald-500/10"
                        }`}
                        title={department.is_active ? "Deactivate" : "Activate"}
                      >
                        <Power className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export default DepartmentTable;