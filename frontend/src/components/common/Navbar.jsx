import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, ChevronDown, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect, useContext, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logoutUser } = useContext(AuthContext);

  const displayName =
    `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || "Admin";

  const initials = displayName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const breadcrumbs = useMemo(() => {
    const paths = location.pathname.split("/").filter(Boolean);
    return paths.map((path, index) => {
      const label = path
        .replace(/-/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      const href = "/" + paths.slice(0, index + 1).join("/");
      return { label, href };
    });
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login", { replace: true });
    setIsDropdownOpen(false);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#050505]/80 backdrop-blur-xl border-b border-neutral-800/50 sticky top-0 z-50"
    >
      <div className="px-6 md:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Dynamic Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm overflow-hidden">
            <span className="text-neutral-500 shrink-0">Admin</span>
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center gap-2 min-w-0">
                <ChevronRight className="w-3 h-3 text-neutral-600 shrink-0" />
                <span
                  className={`truncate ${
                    index === breadcrumbs.length - 1
                      ? "text-neutral-200 font-medium"
                      : "text-neutral-400 hover:text-neutral-200 transition-colors"
                  }`}
                >
                  {crumb.label}
                </span>
              </div>
            ))}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative shrink-0" ref={dropdownRef}>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 pl-1 pr-3 py-1.5 rounded-full bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer select-none"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold ring-2 ring-black">
                {initials}
              </div>
              <div className="hidden sm:block text-left mr-1">
                <p className="text-xs font-semibold text-white">
                  {displayName}
                </p>
                <p className="text-[10px] text-neutral-500">{user?.email}</p>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-neutral-500 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </motion.button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute right-0 mt-3 w-56 rounded-xl bg-neutral-900 border border-neutral-800 shadow-2xl overflow-hidden z-50 p-1.5"
                >

                  <div className="my-1.5 border-t border-neutral-800 mx-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

export default Navbar;
