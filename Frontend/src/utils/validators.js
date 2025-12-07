 export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  export const isValidPhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  };
  
  export const isValidDateRange = (from, to) => {
    if (!from || !to) return true;
    return new Date(from) <= new Date(to);
  };
  
  export const isValidAgeRange = (min, max) => {
    if (min === null || max === null) return true;
    return min >= 0 && max >= 0 && min <= max;
  };
  
 