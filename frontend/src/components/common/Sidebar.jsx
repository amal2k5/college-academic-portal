import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard, Building2, Users, ClipboardList, LogOut,
  AlertCircle, ChevronLeft, Menu, GraduationCap
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { ROUTES } from "../../utils/constants";

function Sidebar() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const { logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const navItems = useMemo(() => [
    { name: "Dashboard", path: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { name: "Colleges", path: ROUTES.COLLEGES, icon: Building2 },
    { name: "College Requests", path: ROUTES.COLLEGE_REQUESTS, icon: ClipboardList },
    { name: "College Admins", path: "/admin/college-admins", icon: Users },
  ], []);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* Logout Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/75"
            onClick={() => setShowConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl"
            >
              <div className="flex gap-4">
                <div className="p-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-rose-400 shrink-0">
                  <AlertCircle size={16} strokeWidth={1.6} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-[12px] font-semibold text-white uppercase tracking-[0.18em]">
                    Confirm Sign Out
                  </h3>
                  <p className="text-[12px] text-neutral-500 leading-relaxed">
                    Are you sure you want to end your active session?
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-700 hover:border-neutral-600 text-neutral-400 hover:text-neutral-200 text-[11px] font-semibold uppercase tracking-widest transition-colors duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-semibold uppercase tracking-widest transition-colors duration-200 cursor-pointer"
                >
                  Log Out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className="min-h-screen bg-neutral-900 border-r border-neutral-800 sticky top-0 z-40 flex flex-col shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out"
        style={{ width: isExpanded ? "256px" : "72px" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-neutral-800 shrink-0">
          <div className={`flex items-center gap-2.5 overflow-hidden transition-all duration-300 ${isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"}`}>
            <div className="w-7 h-7 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center shrink-0">
              <GraduationCap size={14} strokeWidth={1.6} className="text-neutral-300" />
            </div>
            <span className="text-[11px] font-semibold text-neutral-200 uppercase tracking-widest whitespace-nowrap">
              Academic Portal
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800 transition-colors duration-200 cursor-pointer shrink-0 ml-auto"
          >
            {isExpanded
              ? <ChevronLeft size={15} strokeWidth={1.6} />
              : <Menu size={15} strokeWidth={1.6} />
            }
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} end={item.path === ROUTES.DASHBOARD}>
              {({ isActive }) => (
                <div className={`flex items-center rounded-xl px-3 py-2.5 transition-colors duration-200 cursor-pointer group ${
                  isActive
                    ? "bg-neutral-800 text-white border border-neutral-700"
                    : "text-neutral-500 hover:bg-neutral-800/60 hover:text-neutral-200 border border-transparent"
                }`}>
                  <item.icon
                    size={15}
                    strokeWidth={1.6}
                    className={`shrink-0 ${isActive ? "text-white" : "text-neutral-500 group-hover:text-neutral-300"}`}
                  />
                  <span className={`ml-3 text-[11px] font-semibold uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${
                    isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"
                  }`}>
                    {item.name}
                  </span>
                  {isActive && isExpanded && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
                  )}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-neutral-800 shrink-0">
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            className="w-full flex items-center rounded-xl px-3 py-2.5 text-rose-500 hover:bg-rose-500/8 hover:text-rose-400 transition-colors duration-200 cursor-pointer group border border-transparent"
          >
            <LogOut size={15} strokeWidth={1.6} className="shrink-0" />
            <span className={`ml-3 text-[11px] font-semibold uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${
              isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"
            }`}>
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;