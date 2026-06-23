import React, { useState, useContext } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, LogOut, ShieldAlert } from "lucide-react";

import { AuthContext } from "../context/AuthContext";

function HODLayout() {
  const [showConfirm, setShowConfirm] = useState(false);
  const { logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-gray-50/50 font-sans antialiased text-gray-900">

      {/* ── Logout Confirmation Popup Modal ─────────────────────────────────────── */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 w-full max-w-sm transform transition-all scale-100">
            <div className="flex items-center gap-3 mb-3 text-red-600">
              <div className="p-2 bg-red-50 rounded-lg">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Confirm Logout
              </h3>
            </div>

            <p className="text-sm text-gray-500 leading-relaxed">
              Are you sure you want to log out of your session? Any unsaved administrative changes may be lost.
            </p>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 text-sm font-medium transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-sm font-medium transition shadow-sm shadow-red-600/10 cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Sidebar Component ────────────────────────────────────────────────── */}
      <aside className="w-64 bg-white border-r border-gray-200/80 flex flex-col justify-between shrink-0 sticky top-0 h-screen">
        <div>
          {/* Sidebar Header Brand block */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm shadow-indigo-600/20">
                Ω
              </div>
              <div>
                <h1 className="text-base font-bold text-gray-900 tracking-tight leading-none">HOD Portal</h1>
                <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mt-1">Department Admin</p>
              </div>
            </div>
          </div>

          {/* Navigation Links Block */}
          <nav className="p-4 space-y-1">
            <NavLink
              to="/hod"
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700 font-semibold shadow-sm border border-indigo-100/40"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <LayoutDashboard size={18} className="shrink-0" />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/hod/students"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700 font-semibold shadow-sm border border-indigo-100/40"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <Users size={18} className="shrink-0" />
              <span>Students</span>
            </NavLink>
          </nav>
        </div>

        {/* Dynamic Static-Safe Sidebar Bottom Section */}
        <div className="p-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50/60 transition duration-150 group cursor-pointer"
          >
            <LogOut size={18} className="text-red-400 group-hover:text-red-600 transition-colors shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Main Canvas Area ──────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Global Dashboard View Header */}
        <header className="bg-white border-b border-gray-200/80 px-8 py-4 flex justify-between items-center sticky top-0 z-40">
          <div>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">Head of Department</h2>
            <p className="text-xs text-gray-400 mt-0.5 font-medium">Academic Roster & Systems Controller</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-600/10 border border-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shadow-sm">
              H
            </div>
          </div>
        </header>

        {/* Route Render Space */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>

    </div>
  );
}

export default HODLayout;