import React, { useState, useEffect } from "react";
import { paymentService } from "../../services/paymentService";
import { CheckCircle, AlertCircle, Loader2, CreditCard, RefreshCw, Key, ShoppingBag, ShieldCheck } from "lucide-react";

// Script Loader Utility
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const RazorpayTestPage = () => {
  const [feeId, setFeeId] = useState("1");
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  const [creatingOrder, setCreatingOrder] = useState(false);
  const [openingCheckout, setOpeningCheckout] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRazorpayScript().then((res) => {
      setIsScriptLoaded(res);
      if (!res) {
        setError("Razorpay SDK failed to load. Check your connection.");
      }
    });
  }, []);

  const handleCreateOrder = async () => {
    setCreatingOrder(true);
    setError(null);
    setOrder(null);
    setPayment(null);
    setVerificationResult(null);

    try {
      const data = await paymentService.createOrder(feeId);
      // Backend might wrap in an 'order' object or return directly.
      setOrder(data.order || data);
    } catch (err) {
      setError(
        err.response?.data?.message || err.response?.data?.detail || err.message || "Failed to create order."
      );
    } finally {
      setCreatingOrder(false);
    }
  };

  const handleOpenCheckout = () => {
    if (!isScriptLoaded) {
      setError("Razorpay SDK not loaded.");
      return;
    }
    if (!order) {
      setError("Please create an order first.");
      return;
    }

    setOpeningCheckout(true);
    setError(null);

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency || "INR",
      name: "College Academic Portal",
      description: "Semester Fee Payment",
      order_id: order.id,
      handler: async function (response) {
        setOpeningCheckout(false);
        setPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        });
        await handleVerifyPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        });
      },
      prefill: {
        name: "Test User",
        email: "test@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#4f46e5",
      },
      modal: {
        ondismiss: function () {
          setOpeningCheckout(false);
          setError("Payment popup closed by user.");
        }
      }
    };

    try {
      const rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        setOpeningCheckout(false);
        setError(`Payment Failed: ${response.error.description}`);
      });
      rzp1.open();
    } catch (err) {
      setOpeningCheckout(false);
      setError("Failed to open Razorpay checkout.");
      console.error(err);
    }
  };

  const handleVerifyPayment = async (paymentData) => {
    setVerifying(true);
    try {
      const result = await paymentService.verifyPayment(paymentData);
      setVerificationResult(result);
    } catch (err) {
      setError(
        err.response?.data?.message || err.response?.data?.error || err.message || "Failed to verify payment."
      );
    } finally {
      setVerifying(false);
    }
  };

  const resetState = () => {
    setFeeId("1");
    setOrder(null);
    setPayment(null);
    setVerificationResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white text-center relative">
          <h2 className="text-2xl font-bold flex justify-center items-center gap-2">
            <CreditCard className="w-6 h-6" />
            Razorpay Payment Testing
          </h2>
          <p className="text-indigo-100 text-sm mt-2 font-medium">Internal testing utility for backend verification</p>
          <button 
            onClick={resetState}
            className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors"
            title="Reset"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8">
          {/* Controls */}
          <div className="flex flex-col md:flex-row items-end gap-4 mb-8">
            <div className="flex-1 w-full">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Fee ID</label>
              <input
                type="number"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                value={feeId}
                onChange={(e) => setFeeId(e.target.value)}
                placeholder="Enter Fee ID"
              />
            </div>
            <button
              onClick={handleCreateOrder}
              disabled={creatingOrder || !feeId}
              className="w-full md:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg disabled:opacity-70 flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
            >
              {creatingOrder ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingBag className="w-4 h-4" />}
              Create Order
            </button>
            <button
              onClick={handleOpenCheckout}
              disabled={!order || openingCheckout || isScriptLoaded === false}
              className="w-full md:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg disabled:opacity-70 flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
            >
              {openingCheckout ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              Open Checkout
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">Error Occurred</h4>
                <p className="text-sm mt-0.5 opacity-90">{error}</p>
              </div>
            </div>
          )}

          {/* Status Display Area */}
          <div className="space-y-4">
            {/* Order Status */}
            <div className={`p-4 rounded-xl border transition-all ${order ? 'border-indigo-200 bg-indigo-50/50' : 'border-gray-200 bg-gray-50/50'}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-gray-400" />
                  Order Details
                </h3>
                {order && <span className="text-xs font-bold px-2 py-1 bg-indigo-100 text-indigo-700 rounded-md">CREATED</span>}
              </div>
              {order ? (
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-500">Order ID:</div>
                  <div className="font-mono font-medium text-gray-900 break-all">{order.id}</div>
                  <div className="text-gray-500">Amount:</div>
                  <div className="font-medium text-gray-900">{order.amount} {order.currency}</div>
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">No order created yet.</p>
              )}
            </div>

            {/* Payment Status */}
            <div className={`p-4 rounded-xl border transition-all ${payment ? 'border-emerald-200 bg-emerald-50/50' : 'border-gray-200 bg-gray-50/50'}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Key className="w-4 h-4 text-gray-400" />
                  Payment Details
                </h3>
                {payment && <span className="text-xs font-bold px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md">CAPTURED</span>}
              </div>
              {payment ? (
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex justify-between items-start border-b border-emerald-100/50 pb-2">
                    <span className="text-gray-500">Payment ID:</span>
                    <span className="font-mono font-medium text-gray-900 break-all ml-4">{payment.razorpay_payment_id}</span>
                  </div>
                  <div className="flex justify-between items-start pt-1">
                    <span className="text-gray-500">Signature:</span>
                    <span className="font-mono font-medium text-gray-900 break-all ml-4 text-xs truncate max-w-[200px]" title={payment.razorpay_signature}>{payment.razorpay_signature}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">No payment captured yet.</p>
              )}
            </div>

            {/* Verification Status */}
            <div className={`p-4 rounded-xl border transition-all ${verifying ? 'border-amber-200 bg-amber-50 animate-pulse' : verificationResult ? 'border-blue-200 bg-blue-50/50' : 'border-gray-200 bg-gray-50/50'}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-gray-400" />
                  Backend Verification
                </h3>
                {verifying && <span className="text-xs font-bold px-2 py-1 bg-amber-100 text-amber-700 rounded-md flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin"/> VERIFYING</span>}
                {verificationResult && <span className="text-xs font-bold px-2 py-1 bg-blue-100 text-blue-700 rounded-md">COMPLETED</span>}
              </div>
              {verificationResult ? (
                <div className="p-3 bg-white rounded-lg border border-blue-100">
                  <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm mb-2">
                    <CheckCircle className="w-5 h-5" />
                    Payment Verified Successfully
                  </div>
                  <pre className="text-xs text-gray-600 bg-gray-50 p-2 rounded overflow-auto border border-gray-100 max-h-40">
                    {JSON.stringify(verificationResult, null, 2)}
                  </pre>
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">
                  {verifying ? "Verifying signature with backend..." : "Awaiting verification..."}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RazorpayTestPage;
