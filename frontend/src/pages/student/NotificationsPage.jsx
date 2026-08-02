import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Bell, FileText, RefreshCw, CheckCheck } from "lucide-react";
import notificationService from "../../services/notificationService";
import PageHeader from "../../components/common/PageHeader";
import useNotificationSocket from "../../hooks/useNotificationSocket";
import { LoadingSkeleton, LoadingSpinner } from "../../components/common/loading";

// ── animation config (matches other student pages) ─────────────────────────
const pageVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// ── helpers ─────────────────────────────────────────────────────────────────

/**
 * Returns a human-friendly relative time string.
 * e.g. "just now", "5 minutes ago", "Yesterday", "3 Jul 2026"
 */
function formatRelativeTime(isoString) {
  const now = new Date();
  const date = new Date(isoString);
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? "s" : ""} ago`;
  if (diffHr < 24) return `${diffHr} hour${diffHr !== 1 ? "s" : ""} ago`;
  if (diffDay === 1) return "Yesterday";
  if (diffDay < 7) return `${diffDay} days ago`;

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Picks an icon based on the notification message content.
 * Defaults to Bell for generic notifications.
 */
function NotificationIcon({ message }) {
  const lower = message?.toLowerCase() ?? "";
  if (lower.includes("assignment")) {
    return <FileText size={15} strokeWidth={1.5} className="text-indigo-400" />;
  }
  return <Bell size={15} strokeWidth={1.5} className="text-neutral-400" />;
}

// ── skeleton card (matches NoticesPage skeleton style) ──────────────────────
function NotificationSkeleton() {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#0F172A] p-4 flex items-start gap-4 shadow-xl">
      <LoadingSkeleton width="w-8" height="h-8" rounded="rounded-xl" className="shrink-0" />
      <div className="flex-1 space-y-2">
        <LoadingSkeleton width="w-3/4" height="h-4" rounded="rounded-lg" />
        <LoadingSkeleton width="w-1/3" height="h-3" rounded="rounded-lg" />
      </div>
      <LoadingSkeleton width="w-14" height="h-5" rounded="rounded-full" className="shrink-0" />
    </div>
  );
}

// ── single notification row ──────────────────────────────────────────────────
function NotificationItem({ notification, index }) {
  const { message, is_read, created_at } = notification;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      className={`flex items-start gap-4 rounded-2xl border p-4 transition-colors duration-150 ${
        is_read
          ? "border-white/5 bg-white/[0.02] hover:bg-white/[0.035]"
          : "border-indigo-500/20 bg-indigo-500/[0.04] hover:bg-indigo-500/[0.07]"
      }`}
    >
      {/* Icon */}
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
          is_read ? "bg-neutral-900/60" : "bg-indigo-500/10"
        }`}
      >
        <NotificationIcon message={message} />
      </div>

      {/* Message + timestamp */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm leading-snug ${
            is_read ? "text-neutral-400" : "text-white font-medium"
          }`}
        >
          {message}
        </p>
        <p className="text-xs text-neutral-600 mt-1">{formatRelativeTime(created_at)}</p>
      </div>

      {/* Read / Unread badge */}
      <span
        className={`shrink-0 self-start mt-0.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
          is_read
            ? "bg-neutral-900/60 text-neutral-600"
            : "bg-indigo-500/15 text-indigo-400"
        }`}
      >
        {is_read ? "Read" : "Unread"}
      </span>
    </motion.div>
  );
}

// ── error state ──────────────────────────────────────────────────────────────
function ErrorState({ onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="w-10 h-10 rounded-2xl bg-rose-500/10 flex items-center justify-center">
        <Bell size={18} strokeWidth={1.5} className="text-rose-400" />
      </div>
      <p className="text-sm text-neutral-400">
        Unable to load notifications. Please try again.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-800 bg-neutral-900/60 text-xs font-medium text-neutral-300 hover:text-white hover:border-neutral-700 transition-all duration-150 cursor-pointer"
      >
        <RefreshCw size={13} strokeWidth={1.5} />
        Retry
      </button>
    </div>
  );
}

// ── empty state ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
      <div className="w-10 h-10 rounded-2xl bg-neutral-900/60 flex items-center justify-center">
        <Bell size={18} strokeWidth={1.5} className="text-neutral-600" />
      </div>
      <p className="text-sm text-neutral-500">No notifications available.</p>
    </div>
  );
}

// ── page ─────────────────────────────────────────────────────────────────────
function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [markingRead, setMarkingRead] = useState(false);

  const loadNotifications = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await notificationService.getNotifications();
      // API returns newest first but sort defensively by created_at descending
      const sorted = Array.isArray(data)
        ? [...data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        : [];
      setNotifications(sorted);
    } catch (err) {
      console.error("Failed to load notifications:", err);
      setError(true);
      toast.error("Failed to load notifications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    setMarkingRead(true);
    try {
      await notificationService.markAllAsRead();
      // Refresh the list and let the badge update via a re-fetch
      await loadNotifications();
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
      toast.error("Failed to mark all as read. Please try again.");
    } finally {
      setMarkingRead(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  // ── Phase 4: prepend incoming WS notifications to the live list ─────────
  const handleSocketNotification = useCallback((notification) => {
    setNotifications((prev) => [notification, ...prev]);
  }, []);

  useNotificationSocket(handleSocketNotification);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="max-w-7xl mx-auto py-8 px-4 md:px-8 min-h-screen text-neutral-400 space-y-8"
    >
      <PageHeader
        title="Notifications"
        subtitle="Your latest alerts, notices, and assignment updates."
        actions={
          !loading && !error && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              disabled={markingRead || !notifications.some((n) => !n.is_read)}
              className="flex items-center gap-2 shrink-0 px-3.5 py-2 rounded-lg border border-neutral-700 bg-neutral-900 text-xs font-semibold text-neutral-300 hover:text-white hover:border-neutral-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 cursor-pointer"
            >
              {markingRead ? (
                <LoadingSpinner size={13} color="border-t-white border-white/30" />
              ) : (
                <CheckCheck size={13} strokeWidth={2} />
              )}
              {markingRead ? "Marking..." : "Mark all as read"}
            </button>
          )
        }
      />

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <NotificationSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <ErrorState onRetry={loadNotifications} />
      ) : notifications.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {notifications.map((notification, index) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              index={index}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default NotificationsPage;
