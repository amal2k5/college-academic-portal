import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AppLayout from "./AppLayout";
import { GraduationCap } from "lucide-react";
import { collegeAdminNavSections } from "../config/sidebarConfig";

function CollegeAdminLayout() {
  const navigate = useNavigate();
  const { logoutUser } = useContext(AuthContext);
  
  const firstName = localStorage.getItem("first_name");
  const lastName = localStorage.getItem("last_name");
  const email = localStorage.getItem("email") || "";

  const adminName = `${firstName || ""} ${lastName || ""}`.trim() || "College Admin";
  const initials = adminName
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
      navSections={collegeAdminNavSections}
      brandIcon={GraduationCap}
      brandTitle="College Admin"
      brandSubtitle="Academic Portal"
      userName={adminName}
      userInitials={initials}
      userEmail={email}
      onLogout={handleLogout}
    />
  );
}

export default CollegeAdminLayout;
