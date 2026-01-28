// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation (min 6 characters)
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// Phone number validation
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\d\s\-+()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

// Required field validation
export const isRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== '';
};

// Number validation
export const isValidNumber = (value) => {
  return !isNaN(value) && isFinite(value) && value >= 0;
};

// Form validation helper
export const validateForm = (fields, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const fieldRules = rules[field];
    const value = fields[field];
    
    fieldRules.forEach(rule => {
      if (rule.required && !isRequired(value)) {
        errors[field] = rule.message || `${field} is required`;
      } else if (rule.validator && !rule.validator(value)) {
        errors[field] = rule.message || `${field} is invalid`;
      }
    });
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
