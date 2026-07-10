import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/common/Sidebar";

function AppLayout({
  navSections,
  brandIcon,
  brandTitle,
  brandSubtitle,
  userName,
  userInitials,
  userEmail,
  onLogout,
  headerActions // custom elements for header (like notification bell)
}) {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // Persist sidebar state
  const [isExpanded, setIsExpanded] = useState(() => {
    const saved = localStorage.getItem("sidebar_expanded");
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem("sidebar_expanded", JSON.stringify(isExpanded));
  }, [isExpanded]);

  // Current active page title for mobile header
  const getPageTitle = () => {
    for (const section of navSections) {
      for (const item of section.items) {
        if (location.pathname === item.path || (location.pathname.startsWith(item.path + "/") && item.path !== "/")) {
          return item.label;
        }
      }
    }
    return brandTitle || "Portal";
  };

  const handleLogoutConfirm = async () => {
    setShowLogoutModal(false);
    if (onLogout) await onLogout();
  };

  return (
    <div className="flex h-screen bg-neutral-950 font-sans antialiased text-neutral-400 selection:bg-neutral-800 selection:text-white relative overflow-hidden">
      {/* Global Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(255,255,255,0.04),transparent_35%)] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_18%,rgba(200,200,200,0.03),transparent_40%)] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_85%,rgba(255,255,255,0.02),transparent_50%)] pointer-events-none z-0" />

      {/* Logout Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all duration-300">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-neutral-950 border border-neutral-900/80 rounded-3xl w-full max-w-sm p-6 relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.85)]"
            >
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
                  onClick={handleLogoutConfirm}
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-white hover:bg-neutral-200 text-black text-xs font-medium uppercase tracking-wider transition-all duration-150 cursor-pointer"
                >
                  Log Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sidebar Component */}
      <Sidebar
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        navSections={navSections}
        brandIcon={brandIcon}
        brandTitle={brandTitle}
        brandSubtitle={brandSubtitle}
        onLogout={() => setShowLogoutModal(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        
        {/* Global Header */}
        <header className="bg-neutral-950/40 backdrop-blur-md border-b border-neutral-800/40 px-6 h-16 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-xs font-medium uppercase tracking-widest text-neutral-400 hidden sm:block">
              {getPageTitle()}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            {headerActions && (
              <>
                {headerActions}
                <div className="h-5 w-px bg-neutral-800/60 hidden sm:block" />
              </>
            )}

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-medium text-neutral-300 tracking-wide">{userName}</span>
                {userEmail && <span className="text-[10px] text-neutral-500">{userEmail}</span>}
              </div>
              <div className="w-8 h-8 rounded-xl bg-indigo-600/15 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-sans font-semibold text-xs shadow-inner">
                {userInitials}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-transparent scrollbar-thin scrollbar-thumb-neutral-900 scrollbar-track-transparent hover:scrollbar-thumb-neutral-800 transition-colors duration-200">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-7xl mx-auto h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
