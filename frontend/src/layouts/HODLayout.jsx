import React, { useContext, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import useNotificationSocket from "../hooks/useNotificationSocket";
import AppLayout from "./AppLayout";
import { Building2, BellRing } from "lucide-react";
import { hodNavSections } from "../config/sidebarConfig";

function HODLayout() {
  const navigate = useNavigate();
  const { user, logoutUser } = useContext(AuthContext);
  const [unreadCount, setUnreadCount] = useState(0);

  const handleSocketNotification = useCallback(() => {
    setUnreadCount((prev) => prev + 1);
    toast.info("New notification received", { autoClose: 3000 });
  }, []);

  useNotificationSocket(handleSocketNotification);

  const displayName = `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || "HOD";
  const initials = displayName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const notificationBell = (
    <button
      type="button"
      onClick={() => toast.info("Notification center for HOD is coming soon!")}
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
  );

  return (
    <AppLayout
      navSections={hodNavSections}
      brandIcon={Building2}
      brandTitle="HOD Portal"
      brandSubtitle="Department Admin"
      userName={displayName}
      userInitials={initials}
      userEmail={user?.email || ""}
      onLogout={handleLogout}
      headerActions={notificationBell}
    />
  );
}

export default HODLayout;