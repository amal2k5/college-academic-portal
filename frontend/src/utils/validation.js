export const validateEmail = (email) => {
  return /\S+@\S+\.\S+/.test(email);
};

export const validatePhone = (phone) => {
  return /^[0-9]{10}$/.test(phone);
};

export const validateRequired = (value) => {
  return value.trim() !== "";
};