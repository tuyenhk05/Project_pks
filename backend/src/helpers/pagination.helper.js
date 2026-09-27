/**
 * Calculate pagination metadata & Mongo skip/limit
 */
const getPagination = (pageInput, limitInput, totalItems) => {
  const page = Math.max(1, parseInt(pageInput, 10) || 1);
  const limit = Math.max(1, parseInt(limitInput, 10) || 10);
  const totalPages = Math.ceil(totalItems / limit) || 1;
  const skip = (page - 1) * limit;

  return {
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      limit,
    },
    skip,
    limit,
  };
};

module.exports = {
  getPagination,
};
