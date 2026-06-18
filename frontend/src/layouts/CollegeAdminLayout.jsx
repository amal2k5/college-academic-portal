import { Outlet, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
} from "lucide-react";

function CollegeAdminLayout() {
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
      <aside className="w-64 bg-white border-r shadow-sm">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-indigo-600">
            College Admin
          </h1>

          <p className="text-sm text-gray-500">
            Academic Management
          </p>
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
      </aside>

      <div className="flex-1">
        <header className="bg-white border-b px-6 py-4">
          <h2 className="font-semibold text-lg">
            College Administration
          </h2>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default CollegeAdminLayout;