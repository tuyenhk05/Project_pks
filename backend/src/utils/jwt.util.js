const jwt = require('jsonwebtoken');

/**
 * Sign JWT Token
 * @param {object} payload - Token payload (e.g. { id, email, role })
 * @returns {string} Signed JWT Token
 */
const signToken = (payload) => {
  const secret = process.env.JWT_SECRET || 'pks_jwt_secret_key_2026_super_secure';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Verify JWT Token
 * @param {string} token - JWT Token to verify
 * @returns {object} Decoded token payload
 */
const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET || 'pks_jwt_secret_key_2026_super_secure';
  return jwt.verify(token, secret);
};

module.exports = {
  signToken,
  verifyToken,
};
