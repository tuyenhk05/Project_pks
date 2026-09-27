const ROLES = {
  STUDENT: 'student',
  ADMIN: 'admin',
  STAFF: 'staff'
};

const COURSE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  HIDDEN: 'hidden'
};

const ENROLLMENT_STATUS = {
  ENROLLED: 'enrolled',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
};

const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 50
};

module.exports = {
  ROLES,
  COURSE_STATUS,
  ENROLLMENT_STATUS,
  PAGINATION
};
