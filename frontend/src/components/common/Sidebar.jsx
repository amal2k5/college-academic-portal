import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";

import { AuthContext } from "../../context/AuthContext";
import { ROUTES } from "../../utils/constants";

function Sidebar() {
  const [showConfirm, setShowConfirm] = useState(false);
  const { logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

const navItems = [
  {
    name: "Dashboard",
    path: ROUTES.DASHBOARD,
  },
  {
    name: "Colleges",
    path: ROUTES.COLLEGES,
  },
  {
    name: "College Admins",
    path: "/admin/college-admins",
  },
];

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login", { replace: true });  // replace so back-button can't return
  };

  return (
    <>
      {/* ── Logout Confirmation Popup ──────────────────────────────────────── */}
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

      <aside className="w-64 min-h-screen bg-[#1a2a3a] text-white flex flex-col">
        {/* Header */}
        <div className="px-5 py-6 border-b border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 bg-white/10 rounded flex items-center justify-center">
              <span className="text-white text-xs font-medium">AP</span>
            </div>
            <h2 className="font-semibold text-base tracking-tight">Academic Portal</h2>
          </div>
          <p className="text-[11px] text-white/50 tracking-wide">Super Admin</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 rounded-lg mb-1.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Logout button → opens popup */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => setShowConfirm(true)}
            className="w-full px-4 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;