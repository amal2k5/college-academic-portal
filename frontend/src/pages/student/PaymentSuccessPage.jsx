import { useEffect, useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { CheckCircle2, ArrowLeft, Receipt, Eye } from "lucide-react";
import { format } from "date-fns";
import ReceiptModal from "../../components/fees/ReceiptModal";

export default function PaymentSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { payment, fee } = location.state || {};
  
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  if (!payment) {
    return <Navigate to="/student/fees" replace />;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
        
        <div className="flex flex-col items-center text-center mt-2">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 size={24} className="text-emerald-500" />
          </div>
          
          <h1 className="text-xl font-bold text-white mb-1">Payment Successful</h1>
          <p className="text-sm text-neutral-400 mb-6">
            Your payment for {fee?.title} has been verified.
          </p>

          <div className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 mb-6 space-y-3 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-800">
              <span className="text-xs text-neutral-500 font-medium">Amount Paid</span>
              <span className="text-base font-bold text-white">
                ₹{parseFloat(payment.amount).toLocaleString()}
              </span>
            </div>
            
            <div className="flex justify-between items-center text-xs">
              <span className="text-neutral-500 font-medium">Transaction ID</span>
              <span className="text-white font-mono">{payment.razorpay_payment_id}</span>
            </div>
            
            <div className="flex justify-between items-center text-xs">
              <span className="text-neutral-500 font-medium">Date & Time</span>
              <span className="text-white">
                {format(new Date(), "MMM dd, yyyy HH:mm")}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-neutral-500 font-medium">Status</span>
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                Verified
              </span>
            </div>
          </div>

          <div className="w-full space-y-2">
            <button 
              onClick={() => setShowReceiptModal(true)}
              className="w-full h-9 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-2"
            >
              <Eye size={14} />
              View Receipt
            </button>

            <button 
              onClick={() => navigate("/student/fees/history")}
              className="w-full h-9 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-2"
            >
              <Receipt size={14} />
              View in History
            </button>

            <button 
              onClick={() => navigate("/student/fees")}
              className="w-full h-9 bg-transparent hover:bg-neutral-800/50 text-neutral-300 rounded-lg text-sm font-medium transition-colors flex justify-center items-center gap-2"
            >
              <ArrowLeft size={14} />
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>

      <ReceiptModal 
        open={showReceiptModal}
        payment={{...payment, fee}}
        onClose={() => setShowReceiptModal(false)}
      />
    </div>
  );
}
