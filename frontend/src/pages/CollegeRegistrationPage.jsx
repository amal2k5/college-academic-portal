import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Landmark,
  Navigation,
  FileText,
  Send,
} from "lucide-react";
import { submitCollegeRequest } from "../services/collegeRequestService";
import StatusModal from "../components/college-registration/StatusModal";
import { validateCollegeRegistration } from "../utils/validation";
import { LoadingButton } from "../components/common/loading";

const initialFormData = {
  college_name: "",
  contact_person: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  notes: "",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

const FormField = ({
  label,
  name,
  error,
  required,
  disabled,
  value,
  onChange,
  placeholder,
  type = "text",
  rows,
  icon: Icon,
  className = "",
}) => {
  const isTextarea = type === "textarea";

  return (
    <motion.div
      variants={itemVariants}
      className={`relative group ${className}`}
    >
      <label className="mb-1.5 sm:mb-2 block text-[11px] sm:text-xs font-semibold text-neutral-400 uppercase tracking-wider">
        {label} {required && <span className="text-indigo-400">*</span>}
      </label>

      <div className="relative">
        {/* Icon */}
        {Icon && (
          <div
            className={`absolute left-3 sm:left-3.5 text-neutral-500 transition-colors duration-200 pointer-events-none ${
              isTextarea ? "top-3 sm:top-3.5" : "top-1/2 -translate-y-1/2"
            } group-focus-within:text-indigo-400`}
          >
            <Icon size={14} strokeWidth={1.5} className="sm:size-[16px]" />
          </div>
        )}

        {/* Input / Textarea */}
        {isTextarea ? (
          <textarea
            rows={rows || 3}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            className={`w-full rounded-xl border bg-neutral-900/50 px-3 sm:px-4 py-3 sm:py-3.5 pl-9 sm:pl-11 outline-none transition-all duration-200 text-[13px] sm:text-sm text-white placeholder:text-neutral-600 resize-none
              ${
                error
                  ? "border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
                  : "border-neutral-800 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 hover:border-neutral-700"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            className={`w-full rounded-xl border bg-neutral-900/50 px-3 sm:px-4 py-3 sm:py-3.5 pl-9 sm:pl-11 outline-none transition-all duration-200 text-[13px] sm:text-sm text-white placeholder:text-neutral-600
              ${
                error
                  ? "border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
                  : "border-neutral-800 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 hover:border-neutral-700"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          />
        )}
      </div>

      {/* Error Message with Slide Animation */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1.5 text-[11px] sm:text-xs text-red-400 flex items-center gap-1"
          >
            <span className="inline-block w-1 h-1 rounded-full bg-red-400" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const CollegeRegistrationForm = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  const closeModal = () => setModal((prev) => ({ ...prev, isOpen: false }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateCollegeRegistration(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      toast.error("Please correct the highlighted fields.", { theme: "dark" });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const payload = Object.keys(initialFormData).reduce(
        (acc, key) => ({
          ...acc,
          [key]: formData[key].trim(),
        }),
        {},
      );

      await submitCollegeRequest(payload);

      setModal({
        isOpen: true,
        type: "success",
        title: "Registration Submitted",
        message:
          "Your college registration request has been submitted successfully. Our team will review your application and contact you via email shortly.",
      });
      setFormData(initialFormData);
    } catch (error) {
      console.log(error.response.data);
      console.log(error.response.data.errors);
      console.log(error.response.data.errors.email);
      console.log(error.response.data.errors.email[0]);
      console.log("Registration Error:", error.response?.data);

      const response = error?.response?.data;

      let message =
        response?.message ||
        response?.detail ||
        "Unable to submit request. Please try again later.";

      if (response?.errors) {
        const firstField = Object.keys(response.errors)[0];

        if (firstField && Array.isArray(response.errors[firstField])) {
          message = response.errors[firstField][0];
        }
      }

      setModal({
        isOpen: true,
        type: "error",
        title: "Submission Failed",
        message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Field Configuration with Icons
  const fields = [
    {
      name: "college_name",
      label: "College Name",
      required: true,
      placeholder: "Enter college name",
      icon: Building2,
    },
    {
      name: "contact_person",
      label: "Contact Person",
      required: true,
      placeholder: "Enter contact person name",
      icon: User,
    },
    {
      name: "email",
      label: "Official Email",
      required: true,
      type: "email",
      placeholder: "Enter official email address",
      icon: Mail,
    },
    {
      name: "phone",
      label: "Phone Number",
      required: true,
      type: "tel",
      placeholder: "Enter phone number",
      icon: Phone,
    },
    {
      name: "address",
      label: "College Address",
      required: true,
      type: "textarea",
      rows: 3,
      placeholder: "Enter complete street address",
      icon: MapPin,
      className: "md:col-span-2",
    },
    {
      name: "city",
      label: "City",
      required: true,
      placeholder: "Enter city name",
      icon: Landmark,
    },
    {
      name: "state",
      label: "State",
      required: true,
      placeholder: "Enter state name",
      icon: Navigation,
    },
    {
      name: "notes",
      label: "Additional Notes",
      required: false,
      type: "textarea",
      rows: 3,
      placeholder: "Enter any additional information",
      icon: FileText,
      className: "md:col-span-2",
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-neutral-950 py-12 sm:py-16 px-3 sm:px-4 relative overflow-hidden flex items-center justify-center">
        {/* Ambient Background Glows - RESPONSIVE */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[400px] sm:w-[600px] lg:w-[800px] h-[300px] sm:h-[400px] lg:h-[500px] bg-indigo-600/10 rounded-full blur-[80px] sm:blur-[100px] lg:blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[300px] sm:w-[500px] lg:w-[600px] h-[300px] sm:h-[500px] lg:h-[600px] bg-violet-600/5 rounded-full blur-[70px] sm:blur-[80px] lg:blur-[100px] pointer-events-none" />

        <motion.form
          onSubmit={handleSubmit}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative w-full max-w-4xl bg-neutral-900/40 backdrop-blur-xl border border-white/5 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 shadow-2xl shadow-black/50"
        >
          {/* Top Gradient Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />

          {/* Header Section */}
          <motion.div variants={itemVariants} className="text-center mb-6 sm:mb-8 md:mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4 sm:mb-5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-indigo-300 uppercase tracking-widest">
                Institutional Access
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight mb-2 sm:mb-3">
              Request College Portal Access
            </h2>
            <p className="text-[13px] sm:text-sm text-neutral-400 max-w-lg mx-auto leading-relaxed px-2">
              Fill out the details below to onboard your institution.
              Verification typically takes 24-48 hours.
            </p>
          </motion.div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-4 sm:gap-y-6">
            {fields.map((field) => (
              <FormField
                key={field.name}
                {...field}
                value={formData[field.name]}
                onChange={handleChange}
                error={errors[field.name]}
                disabled={loading}
              />
            ))}
          </div>

          {/* Submit Button Area */}
          <motion.div
            variants={itemVariants}
            className="mt-8 sm:mt-10 pt-5 sm:pt-6 border-t border-white/5"
          >
            <LoadingButton
              type="submit"
              loading={loading}
              loadingText="Processing Request..."
              spinnerSize={16}
              className="w-full rounded-xl bg-indigo-600 py-3.5 sm:py-4 text-[13px] sm:text-sm font-semibold text-white transition-all duration-200 hover:bg-indigo-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-gray-600 disabled:opacity-70"
            >
              Submit Application
            </LoadingButton>

            <p className="mt-4 text-center text-[10px] sm:text-[11px] text-neutral-600">
              By submitting, you agree to our{" "}
              <span className="text-neutral-400 hover:text-indigo-400 cursor-pointer transition-colors">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-neutral-400 hover:text-indigo-400 cursor-pointer transition-colors">
                Privacy Policy
              </span>
              .
            </p>
          </motion.div>
        </motion.form>
      </div>

      <StatusModal
        isOpen={modal.isOpen}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={closeModal}
      />
    </>
  );
};

export default CollegeRegistrationForm;