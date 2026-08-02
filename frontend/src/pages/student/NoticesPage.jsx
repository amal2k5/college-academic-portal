import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import NoticeFeed from "../../components/notices/NoticeFeed";
import NoticeDetailModal from "../../components/notices/NoticeDetailModal";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import PageHeader from "../../components/common/PageHeader";
import noticeService from "../../services/noticeService";
import { LoadingSkeleton } from "../../components/common/loading";

const pageVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// Skeleton component for premium loading state
function NoticeSkeleton() {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#0F172A] p-5 space-y-4 shadow-xl">
      <div className="flex items-center gap-2">
        <LoadingSkeleton width="w-16" height="h-5" rounded="rounded-full" />
        <LoadingSkeleton width="w-24" height="h-5" rounded="rounded-full" />
      </div>
      <div className="space-y-2">
        <LoadingSkeleton width="w-3/4" height="h-6" rounded="rounded-lg" />
        <LoadingSkeleton width="w-full" height="h-4" rounded="rounded-lg" />
        <LoadingSkeleton width="w-2/3" height="h-4" rounded="rounded-lg" />
      </div>
      <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LoadingSkeleton width="w-7" height="h-7" rounded="rounded-lg" />
          <LoadingSkeleton width="w-20" height="h-4" rounded="rounded" />
        </div>
        <LoadingSkeleton width="w-16" height="h-4" rounded="rounded" />
      </div>
    </div>
  );
}

function NoticesPage() {
  const { user } = useContext(AuthContext);
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
    if (user) {
      loadNotices();
    }
  }, [user]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="max-w-7xl mx-auto py-8 px-4 md:px-8 min-h-screen text-neutral-400 space-y-8"
    >
      <PageHeader
        title="Notice Board"
        subtitle="Stay updated with department and college announcements."
      />

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

      <NoticeDetailModal
        notice={selectedNotice}
        onClose={() => setSelectedNotice(null)}
      />
    </motion.div>
  );
}

export default NoticesPage;