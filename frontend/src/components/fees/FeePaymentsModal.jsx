import { useState, useEffect } from "react";
import { X, CheckCircle2, Clock } from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "../../services/axiosInstance";

export default function FeePaymentsModal({ fee, open, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open && fee) {
      setLoading(true);
      axiosInstance.get(`/fees/hod/${fee.id}/payments/`)
        .then(res => {
          setData(res.data);
        })
        .catch(err => {
          console.error(err);
          toast.error("Failed to load payments.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, fee]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col max-h-[85vh] shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          <div>
            <h2 className="text-lg font-semibold text-white">Payments: {fee?.title}</h2>
            <p className="text-sm text-neutral-400">Sem {fee?.semester} • {fee?.category}</p>
          </div>
          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-neutral-700 border-t-white rounded-full animate-spin" />
            </div>
          ) : data ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-neutral-950/50 border border-neutral-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    <span className="text-sm font-medium text-neutral-300">Paid Students</span>
                  </div>
                  <div className="text-2xl font-semibold text-white">{data.total_paid}</div>
                </div>
                <div className="bg-neutral-950/50 border border-neutral-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={16} className="text-orange-500" />
                    <span className="text-sm font-medium text-neutral-300">Pending Students</span>
                  </div>
                  <div className="text-2xl font-semibold text-white">{data.total_pending}</div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-white mb-3">Paid Students</h3>
                <div className="border border-neutral-800 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-sm text-neutral-300">
                    <thead className="bg-neutral-950/50 text-neutral-400 border-b border-neutral-800 text-xs">
                      <tr>
                        <th className="px-3 py-2 font-medium">Roll No</th>
                        <th className="px-3 py-2 font-medium">Name</th>
                        <th className="px-3 py-2 font-medium">Amount</th>
                        <th className="px-3 py-2 font-medium">Paid On</th>
                        <th className="px-3 py-2 font-medium">Receipt No</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/50">
                      {data.paid_students.length === 0 ? (
                        <tr><td colSpan="5" className="px-3 py-6 text-center text-neutral-500 text-xs">No paid students yet.</td></tr>
                      ) : data.paid_students.map(p => (
                        <tr key={p.student_id}>
                          <td className="px-3 py-2">{p.roll_number}</td>
                          <td className="px-3 py-2 font-medium text-white">{p.name}</td>
                          <td className="px-3 py-2">₹{parseFloat(p.amount).toLocaleString()}</td>
                          <td className="px-3 py-2">{new Date(p.paid_at).toLocaleDateString()}</td>
                          <td className="px-3 py-2 text-xs font-mono">{p.receipt_number || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-white mb-3">Pending Students</h3>
                <div className="border border-neutral-800 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-sm text-neutral-300">
                    <thead className="bg-neutral-950/50 text-neutral-400 border-b border-neutral-800 text-xs">
                      <tr>
                        <th className="px-3 py-2 font-medium">Roll No</th>
                        <th className="px-3 py-2 font-medium">Name</th>
                        <th className="px-3 py-2 font-medium">Department</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/50">
                      {data.pending_students.length === 0 ? (
                        <tr><td colSpan="3" className="px-3 py-6 text-center text-neutral-500 text-xs">All students have paid.</td></tr>
                      ) : data.pending_students.map(s => (
                        <tr key={s.student_id}>
                          <td className="px-3 py-2">{s.roll_number}</td>
                          <td className="px-3 py-2 font-medium text-white">{s.name}</td>
                          <td className="px-3 py-2">{s.department}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
