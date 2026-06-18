import { Outlet, NavLink } from "react-router-dom";
import { LayoutDashboard, Users, LogOut } from "lucide-react";

function HODLayout() {
  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-sm">

        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-indigo-600">
            HOD Portal
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Department Dashboard
          </p>
        </div>

        <nav className="p-4 space-y-2">

          <NavLink
            to="/hod"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                isActive
                  ? "bg-indigo-100 text-indigo-700 font-semibold"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>

          <NavLink
            to="/hod/students"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                isActive
                  ? "bg-indigo-100 text-indigo-700 font-semibold"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <Users size={20} />
            Students
          </NavLink>

        </nav>

        <div className="absolute bottom-5 left-4">
          <button className="flex items-center gap-2 text-red-500 hover:text-red-600">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">

        {/* Topbar */}
        <header className="bg-white border-b px-6 py-4 flex justify-between items-center">

          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Head of Department
            </h2>

            <p className="text-sm text-gray-500">
              Manage students and academics
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
              H
            </div>
          </div>

        </header>

        <main className="p-6">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default HODLayout;