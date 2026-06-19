import { useState, useEffect } from "react";
import {
  Plus,
  Users,
  UserPlus,
} from "lucide-react";

import HODForm from "../../components/hods/HODForm";

import {
  createHOD,
  getHODs,
} from "../../services/hodService";

function HODs() {
  const [showForm, setShowForm] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [hods, setHods] = useState([]);

  useEffect(() => {
    fetchHODs();
  }, []);

  const fetchHODs = async () => {
    try {
      const data = await getHODs();

      setHods(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreate = async (
    formData
  ) => {
    setIsSubmitting(true);

    try {
      const response =
        await createHOD(formData);

      await fetchHODs();

      alert(
        response.message ||
          "HOD created successfully!"
      );

      setShowForm(false);
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Failed to create HOD"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">

        {/* Header */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 rounded-xl">
              <Users className="w-6 h-6 text-blue-600" />
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                HOD Management
              </h1>

              <p className="text-sm text-gray-500 mt-0.5">
                Manage Department Heads
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              setShowForm(true)
            }
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all"
          >
            <UserPlus className="w-4 h-4" />
            Add HOD
          </button>
        </div>

        {/* Main Card */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">

          {hods.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <Users className="w-10 h-10 text-blue-400" />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                No HODs Added Yet
              </h3>

              <p className="text-sm text-gray-500 mb-6">
                Start by adding your
                first HOD.
              </p>

              <button
                onClick={() =>
                  setShowForm(true)
                }
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-lg"
              >
                <Plus className="w-4 h-4" />
                Add Your First HOD
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">
                      Name
                    </th>

                    <th className="text-left py-3 px-4 font-semibold">
                      Email
                    </th>

                    <th className="text-left py-3 px-4 font-semibold">
                      Department
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {hods.map((hod) => (
                    <tr
                      key={hod.id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        {hod.first_name}{" "}
                        {hod.last_name}
                      </td>

                      <td className="py-3 px-4">
                        {hod.email}
                      </td>

                      <td className="py-3 px-4">
                        {hod.department}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stats */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <p className="text-sm text-gray-500">
              Total HODs
            </p>

            <p className="text-2xl font-bold text-gray-900">
              {hods.length}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <p className="text-sm text-gray-500">
              Active Departments
            </p>

            <p className="text-2xl font-bold text-gray-900">
              {hods.length}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <p className="text-sm text-gray-500">
              Pending Actions
            </p>

            <p className="text-2xl font-bold text-gray-900">
              0
            </p>
          </div>
        </div>
      </div>

      {showForm && (
        <HODForm
          onSubmit={handleCreate}
          onClose={() =>
            setShowForm(false)
          }
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}

export default HODs;