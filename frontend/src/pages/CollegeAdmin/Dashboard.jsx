import {
  Building2,
  Users,
  GraduationCap,
  UserCog,
} from "lucide-react";

function CollegeDashboard() {
  const stats = [
    {
      title: "Departments",
      value: "8",
      icon: Building2,
    },
    {
      title: "HODs",
      value: "12",
      icon: UserCog,
    },
    {
      title: "Students",
      value: "1250",
      icon: GraduationCap,
    },
    {
      title: "Faculty",
      value: "85",
      icon: Users,
    },
  ];

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          College Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Overview of your institution
        </p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="bg-white p-6 rounded-2xl shadow-sm border"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500 text-sm">
                    {item.title}
                  </p>

                  <h2 className="text-3xl font-bold mt-2">
                    {item.value}
                  </h2>
                </div>

                <div className="p-3 bg-indigo-100 rounded-xl">
                  <Icon className="text-indigo-600" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <h2 className="font-semibold text-lg mb-4">
          Recent Activity
        </h2>

        <div className="space-y-4">
          <div>New HOD assigned to Computer Science</div>
          <div>Department of AI created</div>
          <div>120 students enrolled this week</div>
        </div>
      </div>
    </div>
  );
}

export default CollegeDashboard;