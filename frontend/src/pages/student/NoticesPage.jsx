import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import NoticeFeed from "../../components/notices/NoticeFeed";
import noticeService from "../../services/noticeService";
import NoticeDetailModal from "../../components/notices/NoticeDetailModal";

const pageVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// Skeleton component for premium loading state
function NoticeSkeleton() {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 space-y-4 animate-pulse">
      <div className="flex items-center gap-2">
        <div className="h-5 w-16 rounded-full bg-white/5" />
        <div className="h-5 w-24 rounded-full bg-white/5" />
      </div>
      <div className="space-y-2">
        <div className="h-6 w-3/4 rounded-lg bg-white/5" />
        <div className="h-4 w-full rounded-lg bg-white/5" />
        <div className="h-4 w-2/3 rounded-lg bg-white/5" />
      </div>
      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-white/5" />
          <div className="h-4 w-20 rounded bg-white/5" />
        </div>
        <div className="h-4 w-16 rounded bg-white/5" />
      </div>
    </div>
  );
}

function NoticesPage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState(null);

  const loadNotices = async () => {
    setLoading(true);
    try {
      const data = await noticeService.getNotices();
      setNotices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load notices:", error);
      toast.error("Failed to load notices. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, []);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="max-w-7xl mx-auto p-4 md:p-8 min-h-screen relative text-neutral-400"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.04),transparent_35%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_75%,rgba(200,200,200,0.03),transparent_40%)] pointer-events-none" />

      <div className="relative z-10 space-y-8">
        {/* Header */}
        <div className="border-b border-neutral-800/40 pb-6">
          <h1 className="text-2xl font-semibold text-white">Notice Board</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Stay updated with department and college announcements.
          </p>
        </div>

        {/* Pinned Indicator */}
        {!loading && notices.some((n) => n.is_pinned) && (
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            Pinned Notices
          </div>
        )}

        {/* Content Area */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <NoticeSkeleton key={i} />)}
          </div>
        ) : (
          <NoticeFeed
  notices={notices}
  onView={setSelectedNotice}
/>
        )}
      </div>

      <NoticeDetailModal
  notice={selectedNotice}
  onClose={() => setSelectedNotice(null)}
/>
    </motion.div>
  );
}

export default NoticesPage;