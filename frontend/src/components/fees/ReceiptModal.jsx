import { X, Receipt, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";

export default function ReceiptModal({ open, payment, onClose }) {
  if (!open || !payment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-neutral-950/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Receipt size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">College Portal</h2>
              <p className="text-xs text-neutral-400">Payment Receipt</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 size={24} className="text-emerald-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              ₹{parseFloat(payment.amount).toLocaleString()}
            </h3>
            <p className="text-sm text-neutral-400">Successfully Paid</p>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden text-sm">
            
            {/* Receipt & Transaction Details */}
            <div className="p-4 border-b border-neutral-800 space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-neutral-500 font-medium">Receipt No</span>
                <span className="font-mono text-white">{payment.receipt_number || "-"}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-neutral-500 font-medium">Transaction ID</span>
                <span className="font-mono text-white">{payment.razorpay_payment_id || payment.razorpay_order_id || "-"}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-neutral-500 font-medium">Paid On</span>
                <span className="text-white">{payment.paid_at ? format(new Date(payment.paid_at), "MMM dd, yyyy hh:mm a") : "-"}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-neutral-500 font-medium">Payment Status</span>
                <span className="text-emerald-400 font-medium">{payment.status || "PAID"}</span>
              </div>
            </div>

            {/* Student Details */}
            <div className="p-4 border-b border-neutral-800 space-y-3 bg-neutral-900/50">
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Student Details</h4>
              <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                <div>
                  <div className="text-xs text-neutral-500 mb-0.5">Name</div>
                  <div className="text-white font-medium">{payment.student_name || "Unknown"}</div>
                </div>
                <div>
                  <div className="text-xs text-neutral-500 mb-0.5">Roll Number</div>
                  <div className="text-white font-medium">{payment.student_roll_number || "-"}</div>
                </div>
                <div>
                  <div className="text-xs text-neutral-500 mb-0.5">Department</div>
                  <div className="text-white font-medium">{payment.student_department || "-"}</div>
                </div>
                <div>
                  <div className="text-xs text-neutral-500 mb-0.5">Semester</div>
                  <div className="text-white font-medium">{payment.student_semester ? `Semester ${payment.student_semester}` : "-"}</div>
                </div>
              </div>
            </div>

            {/* Fee Details */}
            <div className="p-4 space-y-3">
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Fee Details</h4>
              <div className="flex justify-between items-start">
                <span className="text-neutral-500 font-medium">Fee Title</span>
                <span className="font-medium text-white">{payment.fee?.title || payment.fee_title || "-"}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-neutral-500 font-medium">Fee Type</span>
                <span className="text-white">{payment.fee?.fee_type || payment.fee_type || "-"}</span>
              </div>
              
              {payment.late_fee_applied && (
                <div className="flex justify-between items-start text-orange-400">
                  <span className="font-medium">Late Fee Applied</span>
                  <span>+₹{parseFloat(payment.fee_late_fee_amount || 0).toLocaleString()}</span>
                </div>
              )}
              
              {payment.remarks && (
                <div className="flex justify-between items-start">
                  <span className="text-neutral-500 font-medium">Remarks</span>
                  <span className="text-white text-right max-w-[200px]">{payment.remarks}</span>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="p-4 bg-emerald-500/10 border-t border-emerald-500/20 flex justify-between items-center">
              <span className="font-bold text-emerald-500">Total Paid</span>
              <span className="text-lg font-bold text-emerald-500">₹{parseFloat(payment.amount).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-neutral-800 bg-neutral-950/30 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
