export const validateEmail = (email) => {
  return /\S+@\S+\.\S+/.test(email);
};

export const validatePhone = (phone) => {
  return /^[0-9]{10}$/.test(phone);
};

export const validateRequired = (value) => {
  return value.trim() !== "";
};

export const validateCollegeRegistration = (formData) => {
  const errors = {};

  const data = {
    college_name: formData.college_name.trim(),
    contact_person: formData.contact_person.trim(),
    email: formData.email.trim(),
    phone: formData.phone.trim(),
    address: formData.address.trim(),
    city: formData.city.trim(),
    state: formData.state.trim(),
    notes: formData.notes.trim(),
  };

  // College Name
  if (!validateRequired(data.college_name)) {
    errors.college_name = "College name is required.";
  } else if (data.college_name.length < 3) {
    errors.college_name =
      "College name must be at least 3 characters.";
  }

  // Contact Person
  if (!validateRequired(data.contact_person)) {
    errors.contact_person = "Contact person is required.";
  } else if (data.contact_person.length < 3) {
    errors.contact_person =
      "Contact person must be at least 3 characters.";
  }

  // Email
  if (!validateRequired(data.email)) {
    errors.email = "Official email is required.";
  } else if (!validateEmail(data.email)) {
    errors.email = "Enter a valid email address.";
  }

  // Phone
  if (!validateRequired(data.phone)) {
    errors.phone = "Phone number is required.";
  } else if (!validatePhone(data.phone)) {
    errors.phone = "Phone number must contain exactly 10 digits.";
  }

  // Address
  if (!validateRequired(data.address)) {
    errors.address = "College address is required.";
  } else if (data.address.length < 10) {
    errors.address =
      "Please enter a complete college address.";
  }

  // City
  if (!validateRequired(data.city)) {
    errors.city = "City is required.";
  }

  // State
  if (!validateRequired(data.state)) {
    errors.state = "State is required.";
  }

  // Notes (Optional)
  if (data.notes.length > 500) {
    errors.notes =
      "Additional notes cannot exceed 500 characters.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};