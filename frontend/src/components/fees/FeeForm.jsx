import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LoadingButton } from "../common/loading";

export default function FeeForm({ initialData, onSubmit, onCancel, isSubmitting }) {
  const [formData, setFormData] = useState({
    title: "",
    fee_type: "TUITION",
    amount: "",
    semester: "1",
    due_date: "",
    late_fee_enabled: false,
    late_fee_amount: "",
    description: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        category: initialData.category || "TUITION",
        amount: initialData.amount || "",
        semester: initialData.semester || "1",
        due_date: initialData.due_date || "",
        has_late_fee: initialData.has_late_fee || false,
        late_fee_amount: initialData.late_fee_amount || "",
        late_fee_days: initialData.late_fee_days || "",
        description: initialData.description || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...formData,
      late_fee_amount: formData.late_fee_enabled
        ? Number(formData.late_fee_amount)
        : 0,
    });
  };

  const categories = [
    { value: "TUITION", label: "Tuition Fee" },
    { value: "EXAM", label: "Exam Fee" },
    { value: "LAB", label: "Lab Fee" },
    { value: "HOSTEL", label: "Hostel Fee" },
    { value: "TRANSPORT", label: "Transport Fee" },
    { value: "OTHER", label: "Other Fee" },
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full relative">
      <div className="space-y-4 pb-16">
        <div className="space-y-1">
          <label className="text-xs font-medium text-neutral-400">
            Fee Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-emerald-500/50"
            placeholder="e.g., Semester 1 Tuition Fee"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-400">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="fee_type"
              value={formData.fee_type}
              onChange={handleChange}
              required
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 appearance-none"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-400">
              Amount (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-emerald-500/50"
              placeholder="0.00"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-400">
              Semester <span className="text-red-500">*</span>
            </label>
            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              required
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 appearance-none"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s.toString()}>
                  Semester {s}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-400">
              Due Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              required
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-emerald-500/50"
              style={{ colorScheme: "dark" }}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-neutral-400">
            Description (Optional)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={2}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 resize-none"
            placeholder="Provide any additional details about this fee..."
          />
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800 space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                name="late_fee_enabled"
                checked={formData.late_fee_enabled}
                onChange={handleChange}
                className="peer sr-only"
              />
              <div className="w-8 h-4 bg-neutral-700 rounded-full peer-checked:bg-emerald-500 transition-colors"></div>
              <div className="absolute left-1 top-0.5 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
            </div>
            <span className="text-xs font-medium text-white">Apply Late Fee</span>
          </label>

          {formData.late_fee_enabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1"
            >
              <div className="space-y-1">
                <label className="text-[10px] font-medium text-neutral-500 uppercase">
                  Late Fee Amount (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="late_fee_amount"
                  value={formData.late_fee_amount}
                  onChange={handleChange}
                  required={formData.late_fee_enabled}
                  min="0"
                  step="0.01"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-1.5 px-3 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                  placeholder="e.g., 500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-medium text-neutral-500 uppercase">
                  Grace Period (Days) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="late_fee_days"
                  value={formData.late_fee_days}
                  onChange={handleChange}
                  required={formData.late_fee_enabled}
                  min="0"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-1.5 px-3 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                  placeholder="e.g., 7"
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 pt-4 bg-neutral-950 flex items-center justify-end gap-3 border-t border-neutral-800">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="h-9 px-4 rounded-lg text-sm font-medium text-white bg-neutral-800 hover:bg-neutral-700 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <LoadingButton
          type="submit"
          loading={isSubmitting}
          spinnerSize={14}
          className="h-9 px-4 rounded-lg text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {initialData ? "Update Fee" : "Create Fee"}
        </LoadingButton>
      </div>
    </form>
  );
}
