import React, { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import notificationService from "../services/notificationService";
import useNotificationSocket from "../hooks/useNotificationSocket";
import AppLayout from "./AppLayout";
import { BellRing, GraduationCap } from "lucide-react";
import { studentNavSections } from "../config/sidebarConfig";

function StudentLayout() {
  const navigate = useNavigate();
  const { user, logoutUser } = useContext(AuthContext);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    notificationService
      .getUnreadCount()
      .then((count) => {
        if (!cancelled) setUnreadCount(count);
      })
      .catch((err) => {
        console.error("Failed to fetch notification count:", err);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSocketNotification = useCallback(() => {
    setUnreadCount((prev) => prev + 1);
    toast.info("New notification received", { autoClose: 3000 });
  }, []);

  useNotificationSocket(handleSocketNotification);

  const studentName = `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || "Student";
  const initials = studentName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
  const email = user?.email || "";

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  const notificationBell = (
    <button
      type="button"
      onClick={() => navigate("/student/notifications")}
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
      navSections={studentNavSections}
      brandIcon={GraduationCap}
      brandTitle="Student Portal"
      brandSubtitle="College Access"
      userName={studentName}
      userInitials={initials}
      userEmail={email}
      onLogout={handleLogout}
      headerActions={notificationBell}
    />
  );
}

export default StudentLayout;