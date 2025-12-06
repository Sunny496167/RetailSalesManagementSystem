/**
 * Paginates records
 * @param {Array} data - Array of sales records
 * @param {Number} page - Current page number (1-indexed)
 * @param {Number} pageSize - Number of records per page
 * @returns {Array} Paginated records
 */
function paginateRecords(data, page = 1, pageSize = 10) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
  
    return data.slice(startIndex, endIndex);
  }
  
  
  export { paginateRecords };