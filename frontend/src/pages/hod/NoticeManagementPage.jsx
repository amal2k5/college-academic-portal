import NoticeFeed from "../../components/notices/NoticeFeed";
import { useContext, useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import NoticeForm from "../../components/notices/NoticeForm";
import { AuthContext } from "../../context/AuthContext";
import NoticeDetailModal from "../../components/notices/NoticeDetailModal";
import PageHeader from "../../components/common/PageHeader";
import ConfirmModal from "../../components/common/ConfirmModal";
import noticeService from "../../services/noticeService";
import { LoadingPage } from "../../components/common/loading";

function HODNoticeManagement() {
  const [showForm, setShowForm] = useState(false);
  const [notices, setNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [selectedViewNotice, setSelectedViewNotice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadNotices = useCallback(async () => {
    setLoading(true);
    try {
      const data = await noticeService.getNotices();
      setNotices(data);
    } catch (error) {
      console.error("Failed to load notices:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchNotices = async () => {
      setLoading(true);
      try {
        const data = await noticeService.getNotices();
        if (isMounted) {
          setNotices(data);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Failed to load notices:", error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (user) {
      fetchNotices();
    }

    return () => {
      isMounted = false;
    };
  }, [user]);

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      await noticeService.deleteNotice(deleteTarget);
      await loadNotices();
      toast.success("Notice deleted successfully.");
      setDeleteTarget(null);
    } catch (error) {
      console.error("Failed to delete notice:", error);
      toast.error("Failed to delete notice. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }, [deleteTarget, loadNotices]);

  const handleDelete = useCallback((id) => {
    setDeleteTarget(id);
  }, []);

  const handleTogglePin = useCallback(async (id) => {
    try {
      await noticeService.togglePin(id);
      await loadNotices();
      toast.success("Notice pin status updated.");
    } catch (error) {
      console.error("Failed to toggle pin:", error);
      toast.error("Failed to update pin status. Please try again.");
    }
  }, [loadNotices]);

  const handleSubmit = useCallback(async (data) => {
    setIsSubmitting(true);
    try {
      const payload = { ...data, scope: "DEPARTMENT" };
      if (selectedNotice) {
        await noticeService.updateNotice(selectedNotice.id, payload);
        toast.success("Notice updated successfully.");
      } else {
        await noticeService.createNotice(payload);
        toast.success("Notice created successfully.");
      }
      await loadNotices();
      setSelectedNotice(null);
      setShowForm(false);
    } catch (error) {
      console.error("Failed to save notice:", error);
      toast.error(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedNotice, loadNotices]);

  const handleCancel = useCallback(() => {
    setSelectedNotice(null);
    setShowForm(false);
  }, []);

  if (loading) {
    return <LoadingPage text="Loading Notice Management..." fullScreen={false} />;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-8 px-4 md:px-8">
      <PageHeader
        title="Notice Management"
        subtitle="Create, manage and publish notices for your department."
        buttonText="Create Notice"
        onButtonClick={() => setShowForm(true)}
      />

      <NoticeFeed
        notices={notices}
        currentUser={user}
        onView={setSelectedViewNotice}
        onEdit={(notice) => {
          setSelectedNotice(notice);
          setShowForm(true);
        }}
        onDelete={handleDelete}
        onTogglePin={handleTogglePin}
      />

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl max-h-[85vh] flex flex-col rounded-3xl border border-neutral-800 bg-neutral-950 p-8 shadow-2xl overflow-hidden">
            <div className="mb-6 shrink-0">
              <h2 className="text-xl font-semibold text-white">
                {selectedNotice ? "Edit Notice" : "Create Notice"}
              </h2>
              <p className="text-sm text-neutral-500 mt-1">
                Fill in the details below.
              </p>
            </div>

            <NoticeForm
              initialData={selectedNotice}
              onCancel={handleCancel}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      )}

      <NoticeDetailModal
        notice={selectedViewNotice}
        onClose={() => setSelectedViewNotice(null)}
      />

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Notice"
        message="Are you sure you want to delete this notice? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        loading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default HODNoticeManagement;