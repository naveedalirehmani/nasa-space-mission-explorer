module.exports = function getPagination(query) {
  const DEFAULT_PAGE_LIMIT = 0;

  const page = Math.abs(query.page) || 1;
  const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT;

  const skip = (page - 1) * limit;

  return {
    skip,
    limit,
  };
};