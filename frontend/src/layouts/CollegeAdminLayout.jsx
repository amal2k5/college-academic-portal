import { useState, useContext } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, LogOut, Building2 } from "lucide-react"; // ← removed Building2

import { AuthContext } from "../context/AuthContext";

function CollegeAdminLayout() {
  const [showConfirm, setShowConfirm] = useState(false);
  const { logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login", { replace: true });
  };

  const menuItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/college-admin",
    },
    {
      label: "Departments",
      icon: Building2,
      path: "/college-admin/departments",
    },
    {
      label: "HODs",
      icon: Users,
      path: "/college-admin/hods",
    },
  ];
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* ── Logout Confirmation Popup ─────────────────────────────────────── */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-80">
            <h3 className="text-lg font-semibold text-gray-800">
              Confirm Logout
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Are you sure you want to log out?
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition text-sm font-medium"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-sm">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-indigo-600">College Admin</h1>
          <p className="text-sm text-gray-500">Academic Management</p>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/college-admin"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    isActive
                      ? "bg-indigo-100 text-indigo-700 font-semibold"
                      : "text-gray-600 hover:bg-gray-100"
                  }`
                }
              >
                <Icon size={20} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout button */}
        <div className="absolute bottom-5 left-4">
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-2 text-red-500 hover:text-red-600 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1">
        <header className="bg-white border-b px-6 py-4">
          <h2 className="font-semibold text-lg">College Administration</h2>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default CollegeAdminLayout;
