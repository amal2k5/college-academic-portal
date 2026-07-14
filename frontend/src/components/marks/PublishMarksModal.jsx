import ConfirmModal from "../common/ConfirmModal";

export default function PublishMarksModal({ open, loading, onConfirm, onCancel }) {
  return (
    <ConfirmModal
      open={open}
      title="Publish Marks?"
      message="Publishing these marks will immediately make them visible to students and trigger notifications. This action cannot be undone."
      confirmText="Publish"
      cancelText="Cancel"
      loading={loading}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}
