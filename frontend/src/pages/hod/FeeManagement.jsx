import { useState, useEffect, useCallback, useContext } from "react";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/common/ConfirmModal";
import { AuthContext } from "../../context/AuthContext";
import * as feeService from "../../services/feeService";
import FeeList from "../../components/fees/FeeList";
import FeeForm from "../../components/fees/FeeForm";
import FeePaymentsModal from "../../components/fees/FeePaymentsModal";
import { Plus } from "lucide-react";
import { LoadingPage } from "../../components/common/loading";

export default function FeeManagement() {
  const [fees, setFees] = useState([]);
  const [stats, setStats] = useState({ totalFees: 0, activeFees: 0 });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [remindTarget, setRemindTarget] = useState(null);
  const [isReminding, setIsReminding] = useState(false);
  const [paymentsTarget, setPaymentsTarget] = useState(null);

  const { user } = useContext(AuthContext);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [feesData, statsData] = await Promise.all([
        feeService.getHODFees().catch(() => []),
        feeService.getFeeStats().catch(() => ({ totalFees: 0, activeFees: 0 })),
      ]);
      setFees(feesData);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to load fee data:", error);
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

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (selectedFee) {
        await feeService.updateFee(selectedFee.id, formData);
        toast.success("Fee updated successfully.");
      } else {
        await feeService.createFee(formData);
        toast.success("Fee created successfully.");
      }
      await loadData();
      setShowForm(false);
      setSelectedFee(null);
    } catch (error) {
      console.error("Failed to save fee:", error);
      toast.error(
        error.response?.data?.detail || 
        error.response?.data?.message || 
        "Something went wrong while saving."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await feeService.deleteFee(deleteTarget);
      toast.success("Fee deleted successfully.");
      await loadData();
    } catch (error) {
      toast.error("Failed to delete fee.");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const confirmRemind = async () => {
    if (!remindTarget) return;
    setIsReminding(true);
    try {
      await feeService.sendFeeReminder(remindTarget);
      toast.success("Reminders sent successfully to unpaid students.");
    } catch (error) {
      toast.error("Failed to send reminders.");
    } finally {
      setIsReminding(false);
      setRemindTarget(null);
    }
  };

  if (loading) {
    return <LoadingPage text="Loading Fee Management..." fullScreen={false} />;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-6 px-4 md:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Fee Management</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Manage department fees and send reminders.
          </p>
        </div>
        <button 
          onClick={() => {
            setSelectedFee(null);
            setShowForm(true);
          }}
          className="h-9 px-4 flex items-center gap-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors"
        >
          <Plus size={16} />
          Create Fee
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between h-24">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Total Fees Created</p>
          <p className="text-2xl font-bold text-white">{fees.length || stats.totalFees}</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between h-24">
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Active Fees</p>
          <p className="text-2xl font-bold text-emerald-400">{stats.activeFees || fees.filter(f => new Date(f.due_date) > new Date()).length}</p>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-medium text-white">All Fees</h2>
        <FeeList
          fees={fees}
          onEdit={(fee) => {
            setSelectedFee(fee);
            setShowForm(true);
          }}
          onDelete={(id) => setDeleteTarget(id)}
          onRemind={(id) => setRemindTarget(id)}
          onShowPayments={(fee) => setPaymentsTarget(fee)}
        />
      </div>

      {/* Fee Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-neutral-800 bg-neutral-950 shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-800 shrink-0">
              <h2 className="text-lg font-semibold text-white">
                {selectedFee ? "Edit Fee" : "Create New Fee"}
              </h2>
            </div>

            <div className="p-6 overflow-y-auto">
              <FeeForm
                initialData={selectedFee}
                onSubmit={handleSubmit}
                onCancel={() => setShowForm(false)}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Fee"
        message="Are you sure you want to delete this fee? Students will no longer see it. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        loading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Reminder Confirmation */}
      <ConfirmModal
        open={!!remindTarget}
        title="Send Reminder"
        message="This will send an email reminder to all students who have not yet paid this fee. Continue?"
        confirmText="Send"
        cancelText="Cancel"
        loading={isReminding}
        onConfirm={confirmRemind}
        onCancel={() => setRemindTarget(null)}
      />

      {/* Payments Modal */}
      <FeePaymentsModal
        open={!!paymentsTarget}
        fee={paymentsTarget}
        onClose={() => setPaymentsTarget(null)}
      />
    </div>
  );
}
