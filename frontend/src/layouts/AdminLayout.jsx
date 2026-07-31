import React, { useContext, useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AppLayout from "./AppLayout";
import { Shield, BellRing } from "lucide-react";
import { adminNavSections } from "../config/sidebarConfig";
import useNotificationSocket from "../hooks/useNotificationSocket";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

function AdminLayout() {
  const navigate = useNavigate();
  const { user, logoutUser } = useContext(AuthContext);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const displayName = `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || "System Admin";
  const initials = displayName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSocketNotification = useCallback((notification) => {
    setUnreadCount((prev) => prev + 1);
    setNotifications((prev) => [{...notification, id: Date.now()}, ...prev]);
    toast.info(notification.message, { autoClose: 3000 });
    window.dispatchEvent(new Event("refetchCollegeRequests"));
  }, []);

  useNotificationSocket(handleSocketNotification);

  const notificationBell = (
    <div className="relative shrink-0" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
        className="relative p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800/50 transition-all duration-200 cursor-pointer"
      >
        <BellRing size={18} strokeWidth={1.6} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-indigo-500 text-white text-[9px] font-bold flex items-center justify-center leading-none shadow-lg shadow-indigo-500/20 ring-2 ring-neutral-950">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 sm:mt-3 w-72 rounded-xl bg-neutral-900 border border-neutral-800 shadow-2xl overflow-hidden z-[999] flex flex-col max-h-[400px]"
          >
            <div className="px-4 py-3 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50">
              <h3 className="text-sm font-semibold text-white">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={() => setUnreadCount(0)}
                  className="text-[10px] text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
                >
                  Mark all as read
                </button>
              )}
            </div>
            
            <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-neutral-800">
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center text-neutral-500 text-sm">
                  No new notifications
                </div>
              ) : (
                notifications.map((notif) => (
                  <div key={notif.id} className="px-4 py-3 border-b border-neutral-800/50 hover:bg-neutral-800/20 transition-colors">
                    <p className="text-xs text-neutral-200 leading-relaxed">{notif.message}</p>
                    <p className="text-[10px] text-neutral-500 mt-1">{new Date(notif.id).toLocaleTimeString()}</p>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <AppLayout
      navSections={adminNavSections}
      brandIcon={Shield}
      brandTitle="Super Admin"
      brandSubtitle="System Management"
      userName={displayName}
      userInitials={initials}
      userEmail={user?.email || ""}
      onLogout={handleLogout}
      headerActions={notificationBell}
    />
  );
}

export default AdminLayout;