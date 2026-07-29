import { X, Receipt, CheckCircle2, Printer, Calendar, User, BookOpen, CreditCard, Banknote, Hash, Tag, Clock } from "lucide-react";
import { format } from "date-fns";

export default function ReceiptModal({ open, payment, onClose }) {
  if (!open || !payment) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 overflow-hidden">
      <div className="w-full max-w-2xl max-h-[92vh] bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col transform-gpu will-change-transform">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-5 border-b border-neutral-800 bg-neutral-950/50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Receipt size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">Payment Receipt</h2>
              <p className="text-xs text-neutral-400">Official transaction record</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
              title="Print"
            >
              <Printer size={18} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content - GPU accelerated scroll */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain scroll-smooth p-6 space-y-6 receipt-scroll">
          {/* Success Status */}
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
              <CheckCircle2 size={32} className="text-emerald-500" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">
              ₹{parseFloat(payment.amount).toLocaleString('en-IN')}
            </h3>
            <p className="text-sm text-emerald-400 font-medium">Payment Successful</p>
          </div>

          {/* Receipt Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-950 border border-neutral-800 rounded-xl p-5 contain-content">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Hash size={16} className="text-neutral-500 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Receipt Number</p>
                  <p className="text-sm font-mono text-white truncate">{payment.receipt_number || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CreditCard size={16} className="text-neutral-500 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Transaction ID</p>
                  <p className="text-sm font-mono text-white truncate">{payment.razorpay_payment_id || payment.razorpay_order_id || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar size={16} className="text-neutral-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Payment Date</p>
                  <p className="text-sm text-white">{payment.paid_at ? format(new Date(payment.paid_at), "MMM dd, yyyy") : "N/A"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={16} className="text-neutral-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Payment Time</p>
                  <p className="text-sm text-white">{payment.paid_at ? format(new Date(payment.paid_at), "hh:mm a") : "N/A"}</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Banknote size={16} className="text-neutral-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Payment Method</p>
                  <p className="text-sm text-white">{payment.payment_method || "Online"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Tag size={16} className="text-neutral-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Status</p>
                  <span className="inline-flex px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20 rounded">
                    {payment.status || "PAID"}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-neutral-500 mt-0.5 flex-shrink-0">
                  <Receipt size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Fee Title</p>
                  <p className="text-sm text-white truncate">{payment.fee_title || payment.fee_title || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Student Details */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 contain-content">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <User size={14} />
              Student Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Full Name</p>
                <p className="text-sm font-medium text-white">{payment.student_name || "Unknown"}</p>
              </div>
              <div>
                <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Roll Number</p>
                <p className="text-sm font-medium text-white">{payment.student_roll_number || "N/A"}</p>
              </div>
              <div>
                <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Department</p>
                <p className="text-sm font-medium text-white">{payment.student_department || "N/A"}</p>
              </div>
              <div>
                <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Semester</p>
                <p className="text-sm font-medium text-white">{payment.student_semester ? `Semester ${payment.student_semester}` : "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Fee Breakdown */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 contain-content">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <BookOpen size={14} />
              Fee Breakdown
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-neutral-800">
                <span className="text-sm text-neutral-300">Base Fee</span>
                <span className="text-sm font-medium text-white">
                  ₹{parseFloat(payment.fee?.amount || payment.amount || 0).toLocaleString('en-IN')}
                </span>
              </div>
              {payment.late_fee_applied && payment.fee_late_fee_amount > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-orange-500/20">
                  <span className="text-sm text-orange-400">Late Fee</span>
                  <span className="text-sm font-medium text-orange-400">
                    +₹{parseFloat(payment.fee_late_fee_amount).toLocaleString('en-IN')}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm font-bold text-white">Total Amount</span>
                <span className="text-lg font-bold text-emerald-400">
                  ₹{parseFloat(payment.amount).toLocaleString('en-IN')}
                </span>
              </div>
              {payment.remarks && (
                <div className="mt-3 pt-3 border-t border-neutral-800">
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Remarks</p>
                  <p className="text-sm text-neutral-300 mt-1">{payment.remarks}</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center pt-2">
            <p className="text-[10px] text-neutral-600">
              This is a system-generated receipt. For any queries, please contact the administration.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-4 border-t border-neutral-800 bg-neutral-950/50 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[10px] text-neutral-500">
            Receipt ID: #{payment.id || "N/A"}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .receipt-scroll {
          -webkit-overflow-scrolling: touch;
          scrollbar-width: thin;
          scrollbar-color: #404040 transparent;
        }
        .receipt-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .receipt-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .receipt-scroll::-webkit-scrollbar-thumb {
          background: #404040;
          border-radius: 3px;
        }
        .receipt-scroll::-webkit-scrollbar-thumb:hover {
          background: #525252;
        }
      `}</style>
    </div>
  );
}