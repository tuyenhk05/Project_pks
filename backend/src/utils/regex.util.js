/**
 * Escapes special regex characters to prevent ReDoS (Regular Expression Denial of Service)
 * @param {string} str - Raw search string input
 * @returns {string} Safe string for RegExp
 */
const escapeRegex = (str) => {
  if (typeof str !== 'string') return '';
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

module.exports = {
  escapeRegex,
};
