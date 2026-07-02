import React, { useState, useContext } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { 
  LayoutDashboard, 
  User, 
  LogOut, 
  Menu, 
  ChevronLeft, 
  Bell,
  GraduationCap,
  AlertCircle,
  ClipboardList
} from "lucide-react";

function StudentLayout() {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const firstName = localStorage.getItem("first_name");
  const lastName = localStorage.getItem("last_name");
  const { logoutUser } = useContext(AuthContext);

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
    } finally {
      setShowLogoutModal(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navItems = [
    { path: "/student", label: "Dashboard", icon: LayoutDashboard },
    { path: "/student/profile", label: "Profile", icon: User },
    { path: "/student/notices", label: "Notices", icon: Bell },
    { path: "/student/assignments", label: "Assignments", icon: ClipboardList }
  ];

  return (
    <div className="flex h-screen bg-neutral-950 font-sans antialiased text-neutral-400 selection:bg-neutral-800 selection:text-white relative overflow-hidden">
      
      {/* ── GLOBAL LIQUID SILVER SHINING RADIANCE BACKGROUND ── */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(255,255,255,0.04),transparent_35%)] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_15%,rgba(200,200,200,0.03),transparent_40%)] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.02),transparent_50%)] pointer-events-none z-0" />

      {/* ── PREMIUM LIGHTWEIGHT LOGOUT MODAL (OLED Glassmorphic) ── */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all duration-300">
          <div className="bg-neutral-950 border border-neutral-900/80 rounded-3xl w-full max-w-sm p-6 relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.85)]">
            {/* Fine-grain background ambient ruby aura light */}
            <div className="absolute -right-12 -top-12 w-28 h-28 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex gap-4">
              <div className="p-2.5 bg-neutral-900/50 border border-neutral-800/60 rounded-2xl text-rose-400 shrink-0">
                <AlertCircle size={18} />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-medium text-white uppercase tracking-wider">Confirm Sign Out</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Are you sure you want to end your active session? Any unsaved inputs will be discarded.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-neutral-900/60">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2.5 rounded-2xl border border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white text-xs font-medium uppercase tracking-wider transition-all duration-150 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-white hover:bg-neutral-200 text-black text-xs font-medium uppercase tracking-wider transition-all duration-150 cursor-pointer"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SIDEBAR NAVIGATION PANEL ── */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-neutral-900/30 border-r border-neutral-800/40 backdrop-blur-xl transition-all duration-300 ease-in-out flex flex-col shrink-0 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.4)]`}
      >
        {/* Upper Branding Header */}
        <div className="flex items-center justify-between p-4 h-16 border-b border-neutral-800/40">
          <div className={`flex items-center gap-2.5 px-2 transition-all duration-200 ${!isSidebarOpen && "opacity-0 w-0 overflow-hidden"}`}>
            <div className="h-7 w-7 rounded-xl bg-neutral-950 border border-neutral-900 flex items-center justify-center text-neutral-300 shadow-inner">
              <GraduationCap size={15} strokeWidth={1.5} />
            </div>
            <span className="font-medium text-xs uppercase tracking-widest text-neutral-200 whitespace-nowrap">
              Student Portal
            </span>
          </div>
          
          <button
            type="button"
            onClick={toggleSidebar}
            className="p-2 rounded-xl hover:bg-neutral-900/60 text-neutral-500 hover:text-neutral-200 transition-all duration-150 cursor-pointer"
            aria-label={isSidebarOpen ? "Collapse navigation" : "Expand navigation"}
          >
            {isSidebarOpen ? <ChevronLeft size={15} strokeWidth={1.5} /> : <Menu size={15} strokeWidth={1.5} />}
          </button>
        </div>

        {/* Action Buttons Link Deck */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              location.pathname.startsWith(item.path + "/");

            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center rounded-2xl px-4 py-3 text-xs font-medium uppercase tracking-wider transition-all duration-150 group cursor-pointer ${
                  isActive
                    ? "bg-neutral-900/80 text-white border border-neutral-800/60 shadow-sm"
                    : "text-neutral-500 hover:bg-neutral-900/30 hover:text-neutral-200"
                }`}
              >
                <Icon 
                  size={15} 
                  strokeWidth={1.5}
                  className={`shrink-0 transition-colors duration-150 ${
                    isActive ? "text-neutral-200" : "text-neutral-500 group-hover:text-neutral-300"
                  }`} 
                />
                <span 
                  className={`ml-3 transition-all duration-200 whitespace-nowrap ${
                    !isSidebarOpen ? "opacity-0 w-0 overflow-hidden ml-0" : "opacity-100 w-auto"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Base Bottom Actions */}
        <div className="p-3 border-t border-neutral-800/40">
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center rounded-2xl px-4 py-3 text-xs font-medium uppercase tracking-wider text-rose-500/80 hover:bg-rose-950/10 hover:text-rose-400 transition-all duration-150 group cursor-pointer"
          >
            <LogOut size={15} strokeWidth={1.5} className="shrink-0 text-rose-500/60 group-hover:text-rose-400" />
            <span 
              className={`ml-3 transition-all duration-200 whitespace-nowrap ${
                !isSidebarOpen ? "opacity-0 w-0 overflow-hidden ml-0" : "opacity-100 w-auto"
              }`}
            >
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* ── MAIN DISPLAY CANVAS AREA ── */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        
        {/* Global Toolbar Panel Header */}
        <header className="bg-neutral-950/40 backdrop-blur-md border-b border-neutral-800/40 px-6 h-16 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xs font-medium uppercase tracking-widest text-neutral-400">
              {navItems.find(item => item.path === location.pathname || location.pathname.startsWith(item.path + "/"))?.label || "Workspace"}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">


            <div className="h-5 w-px bg-neutral-800/60" />

            {/* Custom Right Side Identity Segment */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-neutral-400 hidden sm:inline tracking-wide">{studentName}</span>
              <div className="w-8 h-8 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center justify-center font-sans font-medium text-xs shadow-inner">
                {initials}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Outlet Feed Viewport Container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-transparent scrollbar-thin scrollbar-thumb-neutral-900 scrollbar-track-transparent hover:scrollbar-thumb-neutral-800 transition-colors duration-200">
          <Outlet />
        </main>
      </div>

    </div>
  );
}

export default StudentLayout;