import { useState } from "react";

function DepartmentForm({
  onSubmit,
  onClose,
  colleges,
  initialData = null,
}) {
  const [formData, setFormData] = useState(
    initialData || {
      name: "",
      college: "",
      is_active: true,
    }
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {initialData ? "Edit Department" : "Add Department"}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {initialData
              ? "Update department details"
              : "Create a new department"}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-6"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Department Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter department name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-slate-500"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              College
            </label>

            <select
              name="college"
              value={formData.college}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-slate-500"
              required
            >
              <option value="">Select College</option>

              {colleges.map((college) => (
                <option
                  key={college.id}
                  value={college.id}
                >
                  {college.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="is_active"
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
            />

            <label
              htmlFor="is_active"
              className="text-sm text-gray-700"
            >
              Active
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-slate-800 px-4 py-2 text-white hover:bg-slate-700 transition"
            >
              {initialData ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DepartmentForm;