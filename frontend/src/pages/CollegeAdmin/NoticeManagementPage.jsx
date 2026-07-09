import NoticeFeed from "../../components/notices/NoticeFeed";
import { useContext, useEffect, useState } from "react";
import noticeService from "../../services/noticeService";
import NoticeForm from "../../components/notices/NoticeForm";
import { AuthContext } from "../../context/AuthContext";
import NoticeDetailModal from "../../components/notices/NoticeDetailModal";
import PageHeader from "../../components/common/PageHeader";

function NoticeManagement() {
  const [showForm, setShowForm] = useState(false);
  const [notices, setNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [selectedViewNotice, setSelectedViewNotice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadNotices = async () => {
    setLoading(true);
    try {
      const data = await noticeService.getNotices();
      setNotices(data);
    } catch (error) {
      console.error("Failed to load notices:", error);
    } finally {
      setLoading(false);
    }
  };

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
        console.error("Failed to load notices:", error);
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

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = { ...data, scope: "COLLEGE" };
      if (selectedNotice) {
        await noticeService.updateNotice(selectedNotice.id, payload);
      } else {
        await noticeService.createNotice(payload);
      }
      await loadNotices();
      setSelectedNotice(null);
      setShowForm(false);
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) return;

    try {
      await noticeService.deleteNotice(id);
      await loadNotices();
    } catch (error) {
      console.error("Failed to delete:", error);
      alert("Failed to delete notice.");
    }
  };

  const handleTogglePin = async (id) => {
    try {
      await noticeService.togglePin(id);
      await loadNotices();
    } catch (error) {
      console.error("Failed to toggle pin:", error);
      alert("Failed to update pin status.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-neutral-700 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8 max-w-7xl mx-auto py-8 px-4 md:px-8">
        <PageHeader
          title="College Notice Management"
          subtitle="Create, manage and publish notices for your college."
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
                onCancel={() => {
                  setSelectedNotice(null);
                  setShowForm(false);
                }}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        )}

        {selectedViewNotice && (
          <NoticeDetailModal
            notice={selectedViewNotice}
            onClose={() => setSelectedViewNotice(null)}
          />
        )}
      </div>
    </>
  );
}

export default NoticeManagement;
