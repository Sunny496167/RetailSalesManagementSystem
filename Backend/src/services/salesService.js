// backend/src/services/salesService.js
import { 
    queryRecords, 
    getFilteredCount, 
    getFilterOptions as dbGetFilterOptions,
    getAllTags,
    getStatistics as dbGetStatistics
  } from '../utils/database.js';
  
  class SalesService {
    async getSalesData({ page, pageSize, search, sortBy, sortOrder, filters }) {
      try {
        // Get filtered and paginated data
        const data = queryRecords({
          search,
          filters,
          sortBy,
          sortOrder,
          page,
          pageSize
        });
  
        // Get total count with same filters
        const totalRecords = getFilteredCount({ search, filters });
        const totalPages = Math.ceil(totalRecords / pageSize);
  
        return {
          success: true,
          data: data,
          pagination: {
            currentPage: page,
            pageSize,
            totalRecords,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1
          },
          filters: filters,
          search: search || null,
          sort: {
            sortBy,
            sortOrder
          }
        };
      } catch (error) {
        console.error('Error in getSalesData:', error);
        throw error;
      }
    }
  
    async getFilterOptions() {
      try {
        const options = dbGetFilterOptions();
        const tags = getAllTags();
        
        return {
          customerRegions: options.customerRegions || [],
          genders: options.genders || [],
          productCategories: options.productCategories || [],
          tags: tags || [],
          paymentMethods: options.paymentMethods || [],
          ageRange: options.ageRange || { min: 0, max: 100 },
          dateRange: options.dateRange || { min: null, max: null }
        };
      } catch (error) {
        console.error('Error in getFilterOptions:', error);
        throw error;
      }
    }
  
    async getStatistics() {
      try {
        const stats = dbGetStatistics();
        
        return {
          totalTransactions: stats.totalTransactions || 0,
          totalRevenue: stats.totalRevenue || 0,
          averageOrderValue: stats.averageOrderValue || 0,
          totalQuantitySold: stats.totalQuantitySold || 0,
          uniqueCustomers: stats.uniqueCustomers || 0,
          uniqueProducts: stats.uniqueProducts || 0
        };
      } catch (error) {
        console.error('Error in getStatistics:', error);
        throw error;
      }
    }
  }
  
  export default new SalesService();