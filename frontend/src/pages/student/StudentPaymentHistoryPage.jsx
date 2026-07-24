import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import * as feeService from "../../services/feeService";
import { Receipt, Search, Filter, Eye } from "lucide-react";
import { format } from "date-fns";
import ReceiptModal from "../../components/fees/ReceiptModal";

export default function StudentPaymentHistoryPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSemester, setFilterSemester] = useState("ALL");
  const [selectedPayment, setSelectedPayment] = useState(null);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
      const data = await feeService.getPaymentHistory();
      setPayments(data);
    } catch (error) {
      console.error("Failed to load payment history:", error);
      toast.error("Failed to load payment history.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = payment.fee?.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          payment.razorpay_order_id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSemester = filterSemester === "ALL" || payment.fee?.semester === parseInt(filterSemester);
    return matchesSearch && matchesSemester;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Payment History</h1>
          <p className="text-sm text-neutral-400 mt-1">
            View all your past fee payments and download receipts.
          </p>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-neutral-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-neutral-950/30">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
            <input
              type="text"
              placeholder="Search fee or Order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-neutral-700 transition-colors"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter size={16} className="text-neutral-500 hidden sm:block" />
            <select
              value={filterSemester}
              onChange={(e) => setFilterSemester(e.target.value)}
              className="w-full sm:w-40 bg-neutral-900 border border-neutral-800 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-neutral-700 appearance-none"
            >
              <option value="ALL">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                <option key={s} value={s}>Semester {s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-300">
            <thead className="bg-neutral-950/50 text-neutral-400 font-medium border-b border-neutral-800 text-xs">
              <tr>
                <th className="px-4 py-3 font-medium">Transaction ID</th>
                <th className="px-4 py-3 font-medium">Fee Details</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Paid On</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/50">
              {loading ? (
                [1, 2, 3, 4].map((skeleton) => (
                  <tr key={skeleton} className="animate-pulse">
                    <td className="px-4 py-3"><div className="h-4 bg-neutral-800 rounded w-24"></div></td>
                    <td className="px-4 py-3"><div className="h-4 bg-neutral-800 rounded w-32"></div></td>
                    <td className="px-4 py-3"><div className="h-4 bg-neutral-800 rounded w-16"></div></td>
                    <td className="px-4 py-3"><div className="h-4 bg-neutral-800 rounded w-20"></div></td>
                    <td className="px-4 py-3"><div className="h-5 bg-neutral-800 rounded w-16"></div></td>
                    <td className="px-4 py-3"><div className="h-8 bg-neutral-800 rounded-lg w-20 ml-auto"></div></td>
                  </tr>
                ))
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-neutral-500">
                      <Receipt size={32} className="mb-3 opacity-20" />
                      <p>No payment history found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-neutral-800/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-white">{payment.razorpay_order_id}</div>
                      <div className="text-[10px] text-neutral-500 font-mono mt-0.5">{payment.razorpay_payment_id}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-white">{payment.fee?.title || "Unknown Fee"}</div>
                      <div className="text-xs text-neutral-400 mt-0.5">Sem {payment.fee?.semester} • {payment.fee?.category}</div>
                    </td>
                    <td className="px-4 py-3 font-medium text-white">
                      ₹{parseFloat(payment.amount).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-neutral-400">
                      {payment.created_at ? format(new Date(payment.created_at), "MMM dd, yyyy HH:mm") : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${
                        payment.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                        payment.status === 'FAILED' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                        'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          payment.status === 'SUCCESS' ? 'bg-emerald-400' : 
                          payment.status === 'FAILED' ? 'bg-red-400' : 'bg-orange-400'
                        }`} />
                        {payment.status || 'SUCCESS'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {payment.status === 'SUCCESS' || payment.status === 'PAID' ? (
                        <button 
                          onClick={() => setSelectedPayment(payment)}
                          className="h-8 px-3 inline-flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-medium transition-colors"
                        >
                          <Eye size={14} />
                          View Receipt
                        </button>
                      ) : (
                        <span className="text-xs text-neutral-500 flex justify-end items-center gap-1">
                          <div className="w-3 h-3 border-2 border-neutral-500 border-t-transparent rounded-full animate-spin" />
                          Processing
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <ReceiptModal 
        open={!!selectedPayment}
        payment={selectedPayment}
        onClose={() => setSelectedPayment(null)}
      />
    </div>
  );
}
