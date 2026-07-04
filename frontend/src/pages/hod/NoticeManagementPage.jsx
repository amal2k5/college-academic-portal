import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import NoticeFeed from "../../components/notices/NoticeFeed";
import noticeService from "../../services/noticeService";
import { useEffect, useState } from "react";
import NoticeForm from "../../components/notices/NoticeForm";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function NoticeManagement() {
  const [showForm, setShowForm] = useState(false);
  const [notices, setNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const loadNotices = async () => {
      const data = await noticeService.getNotices();
      setNotices(data);
    };

    loadNotices();
  }, []);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto p-4 md:p-8 antialiased text-neutral-400 font-sans min-h-screen relative"
    >
      {/* Liquid silver shine glow background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.04),transparent_35%)] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_75%,rgba(200,200,200,0.03),transparent_40%)] pointer-events-none z-0" />

      <div className="relative z-10 space-y-8">
        {/* Header Area */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-800/40 pb-6">
          <div className="space-y-1">
            <h1 className="text-xl md:text-2xl font-medium text-neutral-100 tracking-tight">
              Notice Management
            </h1>
            <p className="text-xs text-neutral-500 tracking-wide font-normal">
              Create, manage and publish notices for your department.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-neutral-200 active:bg-neutral-300 text-black text-xs font-medium uppercase tracking-widest px-5 py-3 transition duration-150 cursor-pointer group whitespace-nowrap self-start sm:self-auto shadow-md"
          >
            <Plus size={14} strokeWidth={1.5} className="text-black" />
            <span>Create Notice</span>
          </button>
        </div>

        {/* Notices Feed Render */}
        <NoticeFeed
          notices={notices}
          currentUser={user}
          onEdit={(notice) => {
            setSelectedNotice(notice);
            setShowForm(true);
          }}
          onDelete={(id) => {
            setNotices((prev) => prev.filter((notice) => notice.id !== id));
          }}
          onTogglePin={(id) => {
            setNotices((prev) =>
              prev.map((notice) =>
                notice.id === id
                  ? {
                      ...notice,
                      is_pinned: !notice.is_pinned,
                    }
                  : notice,
              ),
            );
          }}
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
                onSubmit={async (data) => {
                  if (selectedNotice) {
                    const updatedNotice = await noticeService.updateNotice(
                      selectedNotice.id,
                      {
                        ...data,
                        image:
                          data.image instanceof File
                            ? URL.createObjectURL(data.image)
                            : data.image,
                      },
                    );

                    setNotices((prev) =>
                      prev.map((notice) =>
                        notice.id === updatedNotice.id ? updatedNotice : notice,
                      ),
                    );
                  } else {
                    // CREATE NOTICE
                    const newNotice = {
                      id: Date.now(),
                      ...data,
                      image: data.image ? URL.createObjectURL(data.image) : "",
                      posted_by: user.id,
                      created_at: new Date().toISOString(),
                    };

                    setNotices((prev) => [newNotice, ...prev]);
                  }

                  setSelectedNotice(null);
                  setShowForm(false);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default NoticeManagement;
