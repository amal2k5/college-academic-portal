import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AppLayout from "./AppLayout";
import { Shield } from "lucide-react";
import { adminNavSections } from "../config/sidebarConfig";

function AdminLayout() {
  const navigate = useNavigate();
  const { user, logoutUser } = useContext(AuthContext);

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
    />
  );
}

export default AdminLayout;