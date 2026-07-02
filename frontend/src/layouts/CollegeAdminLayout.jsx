import { useState, useContext } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  LogOut,
  Building2,
  GraduationCap,
  Bell,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";

function CollegeAdminLayout() {
  const [showConfirm, setShowConfirm] = useState(false);
  const { logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const firstName = localStorage.getItem("first_name");
  const lastName = localStorage.getItem("last_name");

  const adminName =
    `${firstName || ""} ${lastName || ""}`.trim() || "College Admin";

  const initials = adminName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login", { replace: true });
  };

  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/college-admin" },
    {
      label: "Departments",
      icon: Building2,
      path: "/college-admin/departments",
    },
    { label: "HODs", icon: Users, path: "/college-admin/hods" },
    {
      label: "Notice Management",
      icon: Bell,
      path: "/college-admin/notices",
    },
  ];

  return (
    <div className="min-h-screen flex bg-neutral-950">
      {/* Logout Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 w-80 shadow-2xl">
            <h3 className="text-[15px] font-semibold text-neutral-100 mb-1">
              Confirm Logout
            </h3>
            <p className="text-[12px] text-neutral-500 tracking-wide mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-700 text-neutral-400 hover:text-neutral-200 hover:border-neutral-600 transition-all text-[11px] font-semibold uppercase tracking-widest cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition-all text-[11px] font-semibold uppercase tracking-widest cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-60 bg-neutral-900 border-r border-neutral-800 flex flex-col shrink-0">
        {/* Brand */}
        <div className="px-6 py-6 border-b border-neutral-800">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
              <GraduationCap size={14} strokeWidth={2} className="text-white" />
            </div>
            <span className="text-[13px] font-semibold text-neutral-100 tracking-wide">
              College Admin
            </span>
          </div>
          <p className="text-[10px] text-neutral-600 uppercase tracking-[0.18em] pl-9">
            Academic Portal
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">

          {menuItems.map(({ label, icon: Icon, path }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/college-admin"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-[12px] font-medium tracking-wide ${
                  isActive
                    ? "bg-indigo-600/15 text-indigo-400 border border-indigo-600/25"
                    : "text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800 border border-transparent"
                }`
              }
            >
              <Icon size={15} strokeWidth={1.6} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-neutral-800">
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200 text-[12px] font-medium tracking-wide cursor-pointer"
          >
            <LogOut size={15} strokeWidth={1.6} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-neutral-900 border-b border-neutral-800 px-8 py-4 shrink-0 flex items-center justify-between">
          <h2 className="text-[13px] font-semibold text-neutral-300 tracking-wide uppercase">
            College Administration
          </h2>

          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-[12px] text-neutral-400 font-medium">
              {adminName}
            </span>

            <div className="h-9 w-9 rounded-xl bg-indigo-600/15 border border-indigo-600/25 text-indigo-400 flex items-center justify-center text-xs font-semibold">
              {initials}
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default CollegeAdminLayout;
