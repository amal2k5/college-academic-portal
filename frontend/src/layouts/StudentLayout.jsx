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
  const { logoutUser } = useContext(AuthContext);
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

  const firstName = localStorage.getItem("first_name");
  const lastName = localStorage.getItem("last_name");
  const email = localStorage.getItem("email") || "";

  const studentName = `${firstName || ""} ${lastName || ""}`.trim() || "Student";
  const initials = studentName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

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
      className="relative p-2 rounded-xl text-neutral-500 hover:text-neutral-200 hover:bg-neutral-900/60 transition-all duration-150 cursor-pointer"
    >
      <BellRing size={16} strokeWidth={1.5} />
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 min-w-[16px] h-4 px-[3px] rounded-full bg-indigo-500 text-white text-[9px] font-bold flex items-center justify-center leading-none transform translate-x-1/4 -translate-y-1/4">
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