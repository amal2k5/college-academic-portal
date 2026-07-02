import React, { useState, useContext } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, LogOut, ShieldAlert, Bell, ClipboardList } from "lucide-react";

import { AuthContext } from "../context/AuthContext";

function HODLayout() {
  const [showConfirm, setShowConfirm] = useState(false);
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const displayName =
    `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || "HOD";

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
    <div className="min-h-screen flex bg-neutral-950 font-sans antialiased text-neutral-400 selection:bg-neutral-800 selection:text-white relative overflow-hidden">
      {/* ── GLOBAL LIQUID SILVER SHINING RADIANCE BACKGROUND ── */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(255,255,255,0.04),transparent_35%)] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_18%,rgba(200,200,200,0.03),transparent_40%)] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_85%,rgba(255,255,255,0.02),transparent_50%)] pointer-events-none z-0" />

      {/* ── LOGOUT CONFIRMATION MODAL ── */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all duration-300">
          <div className="bg-neutral-950 border border-neutral-900/80 rounded-3xl w-full max-w-sm p-6 relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.85)]">
            {/* Soft background attention indicator flare */}
            <div className="absolute -right-12 -top-12 w-28 h-28 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex gap-4">
              <div className="p-2.5 bg-neutral-900/50 border border-neutral-800/60 rounded-2xl text-rose-400 shrink-0">
                <ShieldAlert className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-medium text-white uppercase tracking-wider">
                  Confirm Logout
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Are you sure you want to log out of your session? Any unsaved
                  administrative changes may be lost.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-neutral-800/40">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2.5 rounded-2xl border border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white text-xs font-medium uppercase tracking-wider transition-all duration-150 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-white hover:bg-neutral-200 text-black text-xs font-medium uppercase tracking-wider transition-all duration-150 cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SIDEBAR NAVIGATION PANEL ── */}
      <aside className="w-64 bg-neutral-900/30 border-r border-neutral-800/40 backdrop-blur-xl flex flex-col justify-between shrink-0 sticky top-0 h-screen z-20 shadow-[4px_0_24px_rgba(0,0,0,0.4)]">
        <div>
          {/* Sidebar Header Brand Block */}
          <div className="p-6 border-b border-neutral-800/40">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-neutral-200 shadow-inner font-sans text-base font-medium">
                Ω
              </div>
              <div className="space-y-0.5">
                <h1 className="text-xs font-medium text-neutral-200 uppercase tracking-widest leading-none">
                  HOD Portal
                </h1>
                <p className="text-[9px] font-medium text-neutral-500 uppercase tracking-wider block">
                  Department Admin
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links Block */}
          <nav className="p-4 space-y-1">
            <NavLink
              to="/hod"
              end
              className={({ isActive }) =>
                `w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-xs font-medium uppercase tracking-wider transition-all duration-150 group cursor-pointer ${
                  isActive
                    ? "bg-neutral-900/80 text-white border border-neutral-800/60 shadow-sm"
                    : "text-neutral-500 hover:bg-neutral-900/30 hover:text-neutral-200"
                }`
              }
            >
              <LayoutDashboard
                size={15}
                strokeWidth={1.5}
                className="shrink-0"
              />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/hod/students"
              className={({ isActive }) =>
                `w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-xs font-medium uppercase tracking-wider transition-all duration-150 group cursor-pointer ${
                  isActive
                    ? "bg-neutral-900/80 text-white border border-neutral-800/60 shadow-sm"
                    : "text-neutral-500 hover:bg-neutral-900/30 hover:text-neutral-200"
                }`
              }
            >
              <Users size={15} strokeWidth={1.5} className="shrink-0" />
              <span>Students</span>
            </NavLink>

            <NavLink
              to="/hod/notices"
              className={({ isActive }) =>
                `w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-xs font-medium uppercase tracking-wider transition-all duration-150 group cursor-pointer ${
                  isActive
                    ? "bg-neutral-900/80 text-white border border-neutral-800/60 shadow-sm"
                    : "text-neutral-500 hover:bg-neutral-900/30 hover:text-neutral-200"
                }`
              }
            >
              <Bell size={15} strokeWidth={1.5} className="shrink-0" />
              <span>Notice Management</span>
            </NavLink>

            <NavLink
              to="/hod/assignments"
              className={({ isActive }) =>
                `w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-xs font-medium uppercase tracking-wider transition-all duration-150 group cursor-pointer ${
                  isActive
                    ? "bg-neutral-900/80 text-white border border-neutral-800/60 shadow-sm"
                    : "text-neutral-500 hover:bg-neutral-900/30 hover:text-neutral-200"
                }`
              }
            >
              <ClipboardList size={15} strokeWidth={1.5} className="shrink-0" />
              <span>Assignment Management</span>
            </NavLink>
          </nav>
        </div>

        {/* Sidebar Bottom Footer Section */}
        <div className="p-4 border-t border-neutral-800/40">
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-medium uppercase tracking-wider text-rose-500/80 hover:bg-rose-950/10 hover:text-rose-400 transition-all duration-150 group cursor-pointer"
          >
            <LogOut
              size={15}
              strokeWidth={1.5}
              className="text-rose-500/60 group-hover:text-rose-400 transition-colors shrink-0"
            />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN CANVAS AREA ── */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        {/* Global Toolbar Header */}
        <header className="bg-neutral-950/40 backdrop-blur-md border-b border-neutral-800/40 px-8 h-16 flex justify-between items-center sticky top-0 z-40 shrink-0">
          <div>
            <h2 className="text-sm font-semibold text-neutral-100">
              {displayName}
            </h2>

            <p className="text-xs text-neutral-500">{user?.email}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center font-medium text-xs shadow-inner">
              {initials}
            </div>
          </div>
        </header>

        {/* Main Content Output Container */}
        <main className="flex-1 overflow-y-auto bg-transparent scrollbar-thin scrollbar-thumb-neutral-900 scrollbar-track-transparent hover:scrollbar-thumb-neutral-800 transition-colors duration-200">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default HODLayout;
