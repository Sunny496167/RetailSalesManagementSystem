/**
 * Sorts records based on specified criteria
 * @param {Array} data - Array of sales records
 * @param {String} sortBy - Field to sort by (date, quantity, customerName)
 * @param {String} sortOrder - Sort order (asc, desc)
 * @returns {Array} Sorted records
 */
function sortRecords(data, sortBy = 'date', sortOrder = 'desc') {
    const sorted = [...data];
  
    const comparators = {
      date: (a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      },
      
      quantity: (a, b) => {
        const qtyA = a.quantity || 0;
        const qtyB = b.quantity || 0;
        return sortOrder === 'desc' ? qtyB - qtyA : qtyA - qtyB;
      },
      
      customerName: (a, b) => {
        const nameA = (a.customerName || '').toLowerCase();
        const nameB = (b.customerName || '').toLowerCase();
        
        if (sortOrder === 'desc') {
          return nameB.localeCompare(nameA);
        }
        return nameA.localeCompare(nameB);
      }
    };
  
    const comparator = comparators[sortBy] || comparators.date;
    sorted.sort(comparator);
  
    return sorted;
  }
  
 
  export { sortRecords };