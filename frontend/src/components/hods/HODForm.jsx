import { useEffect, useState } from "react";
import { getDepartments, getMyDepartments } from "../../services/departmentService";
import { X, User, Mail, Phone, Building2, Loader2 } from "lucide-react";
import { LoadingSpinner } from "../common/loading";

function HODForm({ onSubmit, onClose }) {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    department_id: "",
  });

  useEffect(() => {
    fetchDepartments();
  }, []);
const fetchDepartments = async () => {
  try {
    const role =
      localStorage.getItem("role");

    const data =
      role === "COLLEGE_ADMIN"
        ? await getMyDepartments()
        : await getDepartments();

    setDepartments(data);
  } catch (error) {
    console.error(error);
  }
};

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await onSubmit({
        ...formData,
        department_id: Number(
          formData.department_id
        ),
      });

      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        department_id: "",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-neutral-900 rounded-2xl w-full max-w-md shadow-2xl border border-neutral-800 animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-800">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Create HOD
            </h2>
            <p className="text-sm text-neutral-400 mt-0.5">
              Add a new Head of Department
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-neutral-400" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5"
        >
          {/* First & Last Name - Grid Layout */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="w-4 h-4 text-neutral-400" />
              </div>
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2.5 bg-neutral-950 border border-neutral-800 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 text-sm placeholder:text-neutral-500"
                required
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="w-4 h-4 text-neutral-400" />
              </div>
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2.5 bg-neutral-950 border border-neutral-800 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 text-sm placeholder:text-neutral-500"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="w-4 h-4 text-neutral-400" />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-9 pr-3 py-2.5 bg-neutral-950 border border-neutral-800 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 text-sm placeholder:text-neutral-500"
              required
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="w-4 h-4 text-neutral-400" />
            </div>
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full pl-9 pr-3 py-2.5 bg-neutral-950 border border-neutral-800 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 text-sm placeholder:text-neutral-500"
              required
            />
          </div>

          {/* Department */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building2 className="w-4 h-4 text-neutral-400" />
            </div>
            <select
              name="department_id"
              value={formData.department_id}
              onChange={handleChange}
              className="w-full pl-9 pr-8 py-2.5 bg-neutral-950 border border-neutral-800 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none transition-all duration-200 text-sm"
              required
            >
              <option value="">
                Select Department
              </option>

              {departments.map((department) => (
                <option
                  key={department.id}
                  value={department.id}
                >
                  {department.name} - {department.college_name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-neutral-400 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
            >
              {loading ? (
                <>
                  <LoadingSpinner size={16} color="border-t-white border-white/30" />
                  Creating...
                </>
              ) : (
                "Create HOD"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HODForm;