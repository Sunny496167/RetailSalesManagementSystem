import axios from 'axios';

const API_BASE_URL=import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers:{
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

apiClient.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        console.error('API Error:', error.response.data);
      } else if (error.request) {
        console.error('Network Error:', error.message);
      } else {
        console.error('Error:', error.message);
      }
      return Promise.reject(error);
    }
  );

  export const salesApi = {
    getSales: (params) => {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.pageSize) queryParams.append('pageSize', params.pageSize);
      if (params.search) queryParams.append('search', params.search);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      
      // Handle array filters
      if (params.customerRegion?.length) {
        queryParams.append('customerRegion', params.customerRegion.join(','));
      }
      if (params.gender?.length) {
        queryParams.append('gender', params.gender.join(','));
      }
      if (params.productCategory?.length) {
        queryParams.append('productCategory', params.productCategory.join(','));
      }
      if (params.tags?.length) {
        queryParams.append('tags', params.tags.join(','));
      }
      if (params.paymentMethod?.length) {
        queryParams.append('paymentMethod', params.paymentMethod.join(','));
      }
      
      // Handle range filters
      if (params.ageMin !== null && params.ageMin !== undefined) {
        queryParams.append('ageMin', params.ageMin);
      }
      if (params.ageMax !== null && params.ageMax !== undefined) {
        queryParams.append('ageMax', params.ageMax);
      }
      if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
      if (params.dateTo) queryParams.append('dateTo', params.dateTo);
      
      return apiClient.get(`/sales?${queryParams.toString()}`);
    },
    
    getFilterOptions: () => {
      return apiClient.get('/sales/filter-options');
    },
    
    getStatistics: () => {
      return apiClient.get('/sales/stats');
    },
    
    healthCheck: () => {
      return apiClient.get('/health', { baseURL: API_BASE_URL.replace('/api', '') });
    },
  };
  
  export default apiClient;