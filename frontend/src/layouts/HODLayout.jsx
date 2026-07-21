import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AppLayout from "./AppLayout";
import { Building2 } from "lucide-react";
import { hodNavSections } from "../config/sidebarConfig";

function HODLayout() {
  const navigate = useNavigate();
  const { user, logoutUser } = useContext(AuthContext);

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
    />
  );
}

export default HODLayout;