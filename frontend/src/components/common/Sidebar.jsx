import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";

import { AuthContext } from "../../context/AuthContext";
import { ROUTES } from "../../utils/constants";

function Sidebar() {
  const { logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navItems = [
    { name: "Dashboard", path: ROUTES.DASHBOARD },
    { name: "Colleges", path: ROUTES.COLLEGES },
    { name: "Departments", path: ROUTES.DEPARTMENTS },
    { name: "HODs", path: ROUTES.HODS },
    { name: "Students", path: ROUTES.STUDENTS },
  ];

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-[#1a2a3a] text-white flex flex-col">
      {/* Header */}
      <div className="px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 bg-white/10 rounded flex items-center justify-center">
            <span className="text-white text-xs font-medium">
              AP
            </span>
          </div>

          <h2 className="font-semibold text-base tracking-tight">
            Academic Portal
          </h2>
        </div>

        <p className="text-[11px] text-white/50 tracking-wide">
          Super Admin
        </p>
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

      {/* Logout Button */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full px-4 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors duration-200"
        >
          Logout
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-semibold text-gray-800">
              Confirm Logout
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Are you sure you want to logout?
            </p>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;