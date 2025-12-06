/**
 * Performs case-insensitive search across Customer Name and Phone Number
 * @param {Array} data - Array of sales records
 * @param {String} searchTerm - Search query
 * @returns {Array} Filtered records matching search term
 */
function searchRecords(data, searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
      return data;
    }
  
    const normalizedSearch = searchTerm.toLowerCase().trim();
  
    return data.filter(record => {
      const customerName = (record.customerName || '').toLowerCase();
      const phoneNumber = (record.phoneNumber || '').toLowerCase();
  
      return customerName.includes(normalizedSearch) || 
             phoneNumber.includes(normalizedSearch);
    });
  }
  
 
  export { searchRecords };