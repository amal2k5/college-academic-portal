import {
  Users,
  ClipboardCheck,
  BookOpen,
  CalendarCheck,
  Bell,
} from "lucide-react";

function HODDashboard() {
  const stats = [
    {
      title: "Students",
      value: "120",
      icon: Users,
    },
    {
      title: "Attendance",
      value: "92%",
      icon: ClipboardCheck,
    },
    {
      title: "Assignments",
      value: "18",
      icon: BookOpen,
    },
    {
      title: "Pending Leaves",
      value: "5",
      icon: CalendarCheck,
    },
  ];

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome Back 👋
        </h1>

        <p className="text-gray-500 mt-1">
          Computer Science Department
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">
                    {item.title}
                  </p>

                  <h2 className="text-3xl font-bold mt-2">
                    {item.value}
                  </h2>
                </div>

                <div className="p-3 rounded-xl bg-indigo-100">
                  <Icon className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-lg mb-4">
            Recent Activities
          </h2>

          <div className="space-y-4">
            <div className="border-b pb-3">
              John submitted Assignment 3
            </div>

            <div className="border-b pb-3">
              Anna requested leave
            </div>

            <div className="border-b pb-3">
              Attendance updated for S6 CS
            </div>

            <div>
              Internal marks uploaded
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-indigo-600" />

            <h2 className="font-semibold text-lg">
              Department Notices
            </h2>
          </div>

          <div className="space-y-4">
            <div className="border-b pb-3">
              Semester Exam starts next week.
            </div>

            <div className="border-b pb-3">
              Project submission deadline extended.
            </div>

            <div>
              Department meeting on Friday.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default HODDashboard;