import { Edit2, Trash2, Bell, AlertTriangle, Users } from "lucide-react";

export default function FeeList({ fees, onEdit, onDelete, onRemind, onShowPayments }) {
  if (!fees || fees.length === 0) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-12 text-center flex flex-col items-center">
        <AlertTriangle size={32} className="text-neutral-600 mb-3" />
        <h3 className="text-sm font-medium text-white mb-1">No Fees Found</h3>
        <p className="text-xs text-neutral-400">
          You haven't created any fees for this semester yet.
        </p>
      </div>
    );
  }

  const getCategoryBadge = (category) => {
    const styles = {
      TUITION: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      EXAM: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      LAB: "bg-orange-500/10 text-orange-400 border-orange-500/20",
      HOSTEL: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      TRANSPORT: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      OTHER: "bg-neutral-500/10 text-neutral-400 border-neutral-500/20",
    };
    return styles[category] || styles.OTHER;
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-neutral-300">
          <thead className="bg-neutral-950/50 text-neutral-400 font-medium border-b border-neutral-800 text-xs">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Semester</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Due Date</th>
              <th className="px-4 py-3 font-medium">Late Fee</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/50">
            {fees.map((fee) => (
              <tr key={fee.id} className="hover:bg-neutral-800/20 transition-colors group">
                <td className="px-4 py-3">
                  <span className="font-medium text-white">{fee.title}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 text-[10px] font-medium border rounded-full ${getCategoryBadge(fee.category)}`}>
                    {fee.category}
                  </span>
                </td>
                <td className="px-4 py-3">Sem {fee.semester}</td>
                <td className="px-4 py-3 font-medium text-white">₹{parseFloat(fee.amount).toLocaleString()}</td>
                <td className="px-4 py-3">
                  {new Date(fee.due_date).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}
                </td>
                <td className="px-4 py-3">
                  {fee.has_late_fee ? (
                    <span className="text-red-400 text-xs">
                      +₹{fee.late_fee_amount} <span className="text-neutral-500">after {fee.late_fee_days}d</span>
                    </span>
                  ) : (
                    <span className="text-neutral-500 text-xs">None</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onShowPayments(fee)}
                      className="p-1.5 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                      title="View Payments"
                    >
                      <Users size={14} />
                    </button>
                    <button
                      onClick={() => onRemind(fee.id)}
                      className="p-1.5 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                      title="Send Reminder"
                    >
                      <Bell size={14} />
                    </button>
                    <button
                      onClick={() => onEdit(fee)}
                      className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                      title="Edit Fee"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => onDelete(fee.id)}
                      className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete Fee"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
