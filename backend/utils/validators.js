export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePassword = (password) => {
  // Min 8 chars, 1 uppercase, 1 lowercase, 1 number
  return password.length >= 8 && 
         /[A-Z]/.test(password) && 
         /[a-z]/.test(password) && 
         /[0-9]/.test(password);
};

export const validateWasteEntry = (wasteEntry) => {
  const { entry_date, waste_type_id, quantity, notes } = wasteEntry;
  
  if (!entry_date || !waste_type_id || quantity === undefined) {
    return false;
  }
  
  if (isNaN(quantity) || quantity <= 0) {
    return false;
  }
  
  return true;
};
