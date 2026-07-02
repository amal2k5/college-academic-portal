import { useState } from "react";
import { motion } from "framer-motion";
import NoticeFeed from "../../components/notices/NoticeFeed";
import { mockNotices } from "../../mocks/notices";

const pageVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function NoticesPage() {
  // Read-only state: no setter needed since students never modify notices
  const [notices] = useState(mockNotices);

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
        {/* Header - No Create Button */}
        <div className="border-b border-neutral-800/40 pb-6">
          <h1 className="text-2xl font-semibold text-white">Notice Board</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Stay updated with department and college announcements.
          </p>
        </div>

        {/* Pinned Section Label */}
        {notices.some((n) => n.is_pinned) && (
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            Pinned Notices
          </div>
        )}

        {/* Read-Only Feed: NO onEdit, onDelete, or onTogglePin passed */}
        <NoticeFeed notices={notices} />
      </div>
    </motion.div>
  );
}

export default NoticesPage;