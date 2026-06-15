import { motion } from "framer-motion";
import Badge from "../common/Badge";

function DepartmentTable({ departments }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-100">
              <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                College ID
              </th>
              <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {departments.map((department, index) => (
              <motion.tr
                key={department.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.01)" }}
                className="group transition-colors duration-150"
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {department.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                  {department.college_id}
                </td>
                <td className="px-6 py-4">
                  <Badge isActive={department.is_active} />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {departments.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 text-gray-400 text-sm"
        >
          No departments found
        </motion.div>
      )}
    </motion.div>
  );
}

export default DepartmentTable;