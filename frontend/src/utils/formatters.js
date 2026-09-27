/**
 * Format currency to VND
 * @param {number} amount
 * @returns {string} e.g. "1.500.000 ₫"
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

/**
 * Format date to YYYY-MM-DD in Asia/Ho_Chi_Minh timezone
 * Uses 'sv-SE' locale which natively outputs YYYY-MM-DD
 * @param {string|Date} dateInput
 * @returns {string} e.g. "2026-09-27"
 */
export const formatDate = (dateInput) => {
  if (!dateInput) return '';
  try {
    return new Intl.DateTimeFormat('sv-SE', {
      timeZone: 'Asia/Ho_Chi_Minh',
    }).format(new Date(dateInput));
  } catch (error) {
    return String(dateInput);
  }
};
