/**
 * Applies multiple filters to the dataset
 * @param {Array} data - Array of sales records
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered records
 */
function filterRecords(data, filters) {
    let filtered = [...data];
  
    // Filter by Customer Region (multi-select)
    if (filters.customerRegion && filters.customerRegion.length > 0) {
      filtered = filtered.filter(record => 
        filters.customerRegion.includes(record.customerRegion)
      );
    }
  
    // Filter by Gender (multi-select)
    if (filters.gender && filters.gender.length > 0) {
      filtered = filtered.filter(record => 
        filters.gender.includes(record.gender)
      );
    }
  
    // Filter by Age Range
    if (filters.ageMin !== null || filters.ageMax !== null) {
      filtered = filtered.filter(record => {
        const age = record.age;
        if (isNaN(age)) return false;
        
        const meetsMin = filters.ageMin === null || age >= filters.ageMin;
        const meetsMax = filters.ageMax === null || age <= filters.ageMax;
        
        return meetsMin && meetsMax;
      });
    }
  
    // Filter by Product Category (multi-select)
    if (filters.productCategory && filters.productCategory.length > 0) {
      filtered = filtered.filter(record => 
        filters.productCategory.includes(record.productCategory)
      );
    }
  
    // Filter by Tags (multi-select with OR logic)
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(record => {
        if (!record.tags) return false;
        
        const recordTags = record.tags.split(',').map(tag => tag.trim());
        return filters.tags.some(filterTag => recordTags.includes(filterTag));
      });
    }
  
    // Filter by Payment Method (multi-select)
    if (filters.paymentMethod && filters.paymentMethod.length > 0) {
      filtered = filtered.filter(record => 
        filters.paymentMethod.includes(record.paymentMethod)
      );
    }
  
    // Filter by Date Range
    if (filters.dateFrom || filters.dateTo) {
      filtered = filtered.filter(record => {
        if (!record.date) return false;
        
        const recordDate = new Date(record.date);
        const fromDate = filters.dateFrom ? new Date(filters.dateFrom) : null;
        const toDate = filters.dateTo ? new Date(filters.dateTo) : null;
  
        const meetsFrom = !fromDate || recordDate >= fromDate;
        const meetsTo = !toDate || recordDate <= toDate;
  
        return meetsFrom && meetsTo;
      });
    }
  
    return filtered;
  }
  
 
  export { filterRecords };