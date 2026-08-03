// StudentForm.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, Calendar, Hash,
  BookOpen, Users, Shield, GraduationCap,
  Award, MapPin, Briefcase
} from 'lucide-react';
import { LoadingButton } from '../common/loading';

// Field configuration with icons and sections
const FIELD_SECTIONS = {
  personal: {
    title: 'Personal Information',
    icon: User,
    fields: ['first_name', 'last_name', 'date_of_birth', 'gender']
  },
  contact: {
    title: 'Contact Details',
    icon: Mail,
    fields: ['email', 'phone', 'parent_name', 'parent_phone']
  },
  academic: {
    title: 'Academic Information',
    icon: GraduationCap,
    fields: [
      'roll_number',
      'admission_number',
      'year',
      'semester',
      'academic_year'
    ]
  }
};

const FIELD_CONFIGS = {
  first_name: {
    label: 'First Name',
    required: true,
    protected: true,
    type: 'text',
    placeholder: '',
    icon: User
  },
  last_name: {
    label: 'Last Name',
    required: true,
    protected: true,
    type: 'text',
    placeholder: '',
    icon: User
  },
  email: {
    label: 'Email Address',
    required: true,
    protected: false,
    type: 'email',
    placeholder: '',
    icon: Mail
  },
  phone: {
    label: 'Phone Number',
    required: false,
    protected: false,
    type: 'tel',
    placeholder: '',
    icon: Phone
  },
  roll_number: {
    label: 'Roll Number',
    required: true,
    protected: true,
    type: 'text',
    placeholder: '',
    icon: Hash
  },
  admission_number: {
    label: 'Admission Number',
    required: true,
    protected: true,
    type: 'text',
    placeholder: '',
    icon: Award
  },
  year: {
    label: 'Year',
    required: true,
    protected: false,
    type: 'select',
    placeholder: 'Select year',
    options: [
      { label: 'First Year', value: 1 },
      { label: 'Second Year', value: 2 },
      { label: 'Third Year', value: 3 },
      { label: 'Fourth Year', value: 4 },
    ],
    icon: GraduationCap,
  },
  semester: {
    label: 'Semester',
    required: true,
    protected: false,
    type: 'number',
    min: 1,
    max: 8,
    placeholder: '',
    icon: BookOpen
  },
  academic_year: {
    label: 'Academic Year',
    required: true,
    protected: false,
    type: 'text',
    placeholder: '2024-2025',
    icon: Calendar
  },
  date_of_birth: {
    label: 'Date of Birth',
    required: false,
    protected: false,
    type: 'date',
    placeholder: 'Select date',
    icon: Calendar
  },
  gender: {
    label: 'Gender',
    required: false,
    protected: false,
    type: 'select',
    options: ['Male', 'Female', 'Other'],
    placeholder: 'Select gender',
    icon: Users
  },
  parent_name: {
    label: 'Parent/Guardian',
    required: false,
    protected: false,
    type: 'text',
    placeholder: '',
    icon: Users
  },
  parent_phone: {
    label: 'Parent Contact',
    required: false,
    protected: false,
    type: 'tel',
    placeholder: '',
    icon: Phone
  },
};

// Individual Form Field
const FormField = ({ field, value, onChange, disabled, isEditMode, index }) => {
  const [isFocused, setIsFocused] = useState(false);
  const config = FIELD_CONFIGS[field];
  const isProtected = config.protected && isEditMode;
  const hasValue = value && value.toString().length > 0;
  const Icon = config.icon;

  const fieldVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.03,
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const inputBaseClasses = `
    w-full h-[48px] text-sm px-3 pl-10
    rounded-lg border
    bg-neutral-900
    text-white
    placeholder:text-neutral-500
    transition-colors duration-150
    focus:outline-none
    appearance-none
  `;

  const getInputClasses = () => {
    if (isProtected) {
      return `${inputBaseClasses} text-neutral-400 cursor-not-allowed border-neutral-700/40 bg-neutral-800/50`;
    }
    return `${inputBaseClasses} border-neutral-700 hover:border-neutral-600 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-700/50`;
  };

  const renderInput = () => {
    const commonProps = {
      id: field,
      name: field,
      value: value || '',
      onChange,
      disabled: isProtected,
      required: config.required,
      onFocus: () => setIsFocused(true),
      onBlur: () => setIsFocused(false),
      placeholder: config.placeholder || '',
      className: getInputClasses(),
    };

    if (config.type === 'select') {
      return (
        <select {...commonProps} className={`${getInputClasses()} pr-10`}>
          <option value="" className="bg-neutral-900 text-neutral-500">
            {config.placeholder}
          </option>
          {config.options.map((opt) => {
            const isObject = typeof opt === "object";
            return (
              <option
                key={isObject ? opt.value : opt}
                value={isObject ? opt.value : opt.toUpperCase()}
                className="bg-neutral-900 text-white"
              >
                {isObject ? opt.label : opt}
              </option>
            );
          })}
        </select>
      );
    }

    return <input type={config.type} {...commonProps} />;
  };

  return (
    <motion.div
      variants={fieldVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-1.5"
    >
      {/* Label — always above input, never floating */}
      <label
        htmlFor={field}
        className="flex items-center gap-1.5 text-sm font-medium text-neutral-300 select-none"
      >
        {config.label}
        {config.required && <span className="text-neutral-400 text-xs">*</span>}
        {isProtected && (
          <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-neutral-500 font-normal">
            <Shield className="h-3 w-3" />
            Protected
          </span>
        )}
      </label>

      {/* Input wrapper */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Icon
            className={`h-4 w-4 ${isProtected
              ? 'text-neutral-600'
              : isFocused
                ? 'text-neutral-300'
                : 'text-neutral-500'
              }`}
          />
        </div>

        {renderInput()}

        {/* Select dropdown arrow */}
        {config.type === 'select' && !isProtected && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Section Component
const FormSection = ({ title, icon: Icon, fields, formData, handleChange, isEditMode, startIndex }) => {
  const requiredCount = fields.filter(f => FIELD_CONFIGS[f].required).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="bg-neutral-900 border border-neutral-800 rounded-xl p-6"
    >
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-neutral-800">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-800 border border-neutral-700/60">
          <Icon className="h-4 w-4 text-neutral-300" />
        </div>
        <h3 className="text-sm font-semibold text-neutral-100 tracking-tight">{title}</h3>

      </div>

      {/* Fields */}
      <div className="space-y-5">
        {fields.map((field, idx) => (
          <FormField
            key={field}
            field={field}
            value={formData[field]}
            onChange={handleChange}
            disabled={isEditMode && FIELD_CONFIGS[field].protected}
            isEditMode={isEditMode}
            index={startIndex + idx}
          />
        ))}
      </div>
    </motion.div>
  );
};

// Main StudentForm
function StudentForm({
  formData = {},
  handleChange,
  handleSubmit,
  submitLabel = "Save Student",
  loading = false,
  isEditMode = false,
}) {

  const allFields = Object.values(FIELD_SECTIONS).flatMap(s => s.fields);

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      onSubmit={handleSubmit}
      className="w-full"
    >
      {/* Form Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold text-neutral-100 tracking-tight">
            {isEditMode ? 'Edit Student Profile' : 'Student Profile Information'}
          </h2>
          <p className="text-sm text-neutral-500 mt-0.5">
            {isEditMode
              ? 'Update editable fields while core identifiers remain protected'
              : 'Complete all required fields marked with an asterisk (*)'}
          </p>
        </div>

        {isEditMode && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-[11px] text-amber-400 font-medium">Edit Mode</span>
          </motion.div>
        )}
      </div>

      {/* Protected Notice */}
      <AnimatePresence>
        {isEditMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="mb-6 overflow-hidden"
          >
            <div className="p-4 bg-amber-500/5 border border-amber-500/15 rounded-xl flex items-start gap-3">
              <Shield className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-400/90 leading-relaxed">
                <span className="font-medium text-amber-300">Protected Fields:</span>{' '}
                First Name, Last Name, Roll Number, and Admission Number cannot be modified
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Sections — Two columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column — Personal + Contact */}
        <div className="flex flex-col gap-6">
          {Object.entries(FIELD_SECTIONS).map(([key, section]) => {
            if (key === 'personal' || key === 'contact') {
              const startIndex = allFields.indexOf(section.fields[0]);
              return (
                <FormSection
                  key={key}
                  title={section.title}
                  icon={section.icon}
                  fields={section.fields}
                  formData={formData}
                  handleChange={handleChange}
                  isEditMode={isEditMode}
                  startIndex={startIndex}
                />
              );
            }
            return null;
          })}
        </div>

        {/* Right Column — Academic */}
        <div className="flex flex-col gap-6">
          {Object.entries(FIELD_SECTIONS).map(([key, section]) => {
            if (key === 'academic') {
              const startIndex = allFields.indexOf(section.fields[0]);
              return (
                <FormSection
                  key={key}
                  title={section.title}
                  icon={section.icon}
                  fields={section.fields}
                  formData={formData}
                  handleChange={handleChange}
                  isEditMode={isEditMode}
                  startIndex={startIndex}
                />
              );
            }
            return null;
          })}
        </div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.3, ease: 'easeOut' }}
        className="mt-8 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4"
      >


        <LoadingButton
          type="submit"
          loading={loading}
          spinnerSize={16}
          className="w-full sm:w-auto h-[44px] px-8 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[160px]"
        >
          {submitLabel}
        </LoadingButton>
      </motion.div>
    </motion.form>
  );
}

export default StudentForm;
