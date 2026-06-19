import { useEffect, useState } from "react";

import PageHeader from "../../components/common/PageHeader";
import CollegeAdminForm from "../../components/collegeAdmins/CollegeAdminForm";

import {
  createCollegeAdmin,
  getCollegeAdmins,
} from "../../services/collegeAdminService";

function CollegeAdmins() {
  const [showForm, setShowForm] =
    useState(false);

  const [collegeAdmins, setCollegeAdmins] =
    useState([]);

  useEffect(() => {
    fetchCollegeAdmins();
  }, []);

  const fetchCollegeAdmins =
    async () => {
      try {
        const data =
          await getCollegeAdmins();

        setCollegeAdmins(data);
      } catch (error) {
        console.error(error);
      }
    };

  const handleCreate = async (
    formData
  ) => {
    try {
      const response =
        await createCollegeAdmin(
          formData
        );

      await fetchCollegeAdmins();

      alert(response.message);

      setShowForm(false);
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data
          ?.message ||
          error?.response?.data
            ?.email?.[0] ||
          "Failed to create College Admin"
      );
    }
  };

  return (
    <div>
      <PageHeader
        title="College Admins"
        buttonText="Add College Admin"
        onButtonClick={() =>
          setShowForm(true)
        }
      />

      <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
        <h2 className="text-lg font-semibold mb-4">
          College Admin List
        </h2>

        {collegeAdmins.length === 0 ? (
          <p className="text-gray-500">
            No College Admins Found
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">
                    Name
                  </th>

                  <th className="text-left py-3">
                    Email
                  </th>

                  <th className="text-left py-3">
                    College
                  </th>

                  <th className="text-left py-3">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {collegeAdmins.map(
                  (admin) => (
                    <tr
                      key={admin.id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="py-3">
                        {
                          admin.first_name
                        }{" "}
                        {
                          admin.last_name
                        }
                      </td>

                      <td className="py-3">
                        {admin.email}
                      </td>

                      <td className="py-3">
                        {admin.college}
                      </td>

                      <td className="py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            admin.is_active
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {admin.is_active
                            ? "Active"
                            : "Pending Setup"}
                        </span>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <CollegeAdminForm
          onSubmit={
            handleCreate
          }
          onClose={() =>
            setShowForm(false)
          }
        />
      )}
    </div>
  );
}

export default CollegeAdmins;