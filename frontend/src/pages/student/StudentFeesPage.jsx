import { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import * as feeService from "../../services/feeService";
import {
  Clock, CheckCircle2, AlertCircle, RefreshCw, History, CreditCard, Receipt
} from "lucide-react";

export default function StudentFeesPage() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await feeService.getStudentFees();

      setFees(
        Array.isArray(data)
          ? data
          : Array.isArray(data.results)
            ? data.results
            : Array.isArray(data.data)
              ? data.data
              : []
      );
    } catch (error) {
      console.error("Failed to load fees:", error);
      toast.error("Failed to load fees.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, loadData]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (fee) => {
    if (processingId) return;
    setProcessingId(fee.id);

    try {
      const res = await loadRazorpayScript();
      if (!res) {
        toast.error("Failed to load Razorpay SDK. Check your connection.");
        setProcessingId(null);
        return;
      }

      // Create order
      const orderData = await feeService.createPaymentOrder(fee.id);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || orderData.key,
        amount: orderData.amount,
        currency: "INR",
        name: "College Portal",
        description: `Payment for ${fee.title}`,
        order_id: orderData.order.id,
        handler: async function (response) {
          try {
            const verificationData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              fee_id: fee.id,
            };
            const verifyRes = await feeService.verifyPayment(verificationData);

            navigate("/student/fees/success", {
              state: {
                payment: verifyRes,
                fee: fee
              }
            });
          } catch (error) {
            toast.error("Payment verification failed. Please contact support.");
            setProcessingId(null);
          }
        },
        prefill: {
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
        },
        theme: { color: "#10B981" },
        modal: {
          ondismiss: function () {
            toast.info("Payment cancelled.");
            setProcessingId(null);
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Payment initiation failed:", error);
      toast.error(error.response?.data?.detail || "Failed to initiate payment.");
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neutral-700 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  const pendingFees = fees.filter(f => !f.is_paid);
  const paidFees = fees.filter(f => f.is_paid);

  const totalPendingAmount = pendingFees.reduce((acc, f) => acc + parseFloat(f.amount), 0);
  const totalPaidAmount = paidFees.reduce((acc, f) => acc + parseFloat(f.amount), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-6 px-4 md:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Fee Dashboard</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Manage your tuition payments and transaction history.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => loadData()}
            className="h-9 px-3 flex items-center gap-2 text-sm font-medium text-neutral-300 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
          <button
            onClick={() => navigate("/student/fees/history")}
            className="h-9 px-3 flex items-center gap-2 text-sm font-medium text-neutral-300 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <History size={14} />
            History
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between h-24">
          <div className="flex items-center gap-2 text-neutral-400">
            <Clock size={16} className="text-orange-400" />
            <span className="text-xs font-medium uppercase tracking-wider">Pending Amount</span>
          </div>
          <p className="text-2xl font-bold text-white">₹{totalPendingAmount.toLocaleString()}</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between h-24">
          <div className="flex items-center gap-2 text-neutral-400">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span className="text-xs font-medium uppercase tracking-wider">Paid Amount</span>
          </div>
          <p className="text-2xl font-bold text-white">₹{totalPaidAmount.toLocaleString()}</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between h-24">
          <div className="flex items-center gap-2 text-neutral-400">
            <AlertCircle size={16} />
            <span className="text-xs font-medium uppercase tracking-wider">Pending Fees</span>
          </div>
          <p className="text-2xl font-bold text-white">{pendingFees.length}</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between h-24">
          <div className="flex items-center gap-2 text-neutral-400">
            <Receipt size={16} />
            <span className="text-xs font-medium uppercase tracking-wider">Paid Fees</span>
          </div>
          <p className="text-2xl font-bold text-white">{paidFees.length}</p>
        </div>
      </div>

      {/* Pending Fees Table */}
      <div className="space-y-3">
        <h2 className="text-lg font-medium text-white">Pending Payments</h2>

        {pendingFees.length === 0 ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center shrink-0">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-white">No pending payments</p>
              <p className="text-xs text-neutral-400">You are all caught up with your fees.</p>
            </div>
          </div>
        ) : (
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-neutral-300">
                <thead className="bg-neutral-950/50 text-neutral-400 font-medium border-b border-neutral-800 text-xs">
                  <tr>
                    <th className="px-4 py-3 font-medium">Fee Title</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Semester</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Due Date</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/50">
                  {pendingFees.map((fee) => (
                    <tr key={fee.id} className="hover:bg-neutral-800/20 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-medium text-white">{fee.title}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-neutral-400">{fee.category}</td>
                      <td className="px-4 py-3">Sem {fee.semester}</td>
                      <td className="px-4 py-3 font-medium text-white">₹{parseFloat(fee.amount).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        {new Date(fee.due_date).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                          Pending
                        </span>
                        {fee.has_late_fee && (
                          <div className="text-[10px] text-red-400 mt-1">
                            +₹{fee.late_fee_amount} late fee
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handlePayment(fee)}
                          disabled={processingId === fee.id}
                          className="h-9 px-4 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                        >
                          {processingId === fee.id ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              <CreditCard size={14} />
                              Pay Now
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Paid Fees Table (Recent) */}
      {paidFees.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-neutral-800">
          <h2 className="text-lg font-medium text-white">Recently Paid</h2>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-neutral-300">
                <thead className="bg-neutral-950/50 text-neutral-400 font-medium border-b border-neutral-800 text-xs">
                  <tr>
                    <th className="px-4 py-3 font-medium">Fee Title</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Semester</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/50 opacity-80 hover:opacity-100 transition-opacity">
                  {paidFees.slice(0, 3).map((fee) => (
                    <tr key={fee.id} className="hover:bg-neutral-800/20 transition-colors">
                      <td className="px-4 py-3 font-medium text-white">{fee.title}</td>
                      <td className="px-4 py-3 text-xs text-neutral-400">{fee.category}</td>
                      <td className="px-4 py-3">Sem {fee.semester}</td>
                      <td className="px-4 py-3 font-medium text-white">₹{parseFloat(fee.amount).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          Paid
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => navigate("/student/fees/history")}
                          className="h-9 px-3 inline-flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          View Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
