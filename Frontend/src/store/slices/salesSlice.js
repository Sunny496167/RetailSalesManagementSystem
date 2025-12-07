import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { salesApi } from '../../services/api'

export const fetchSales = createAsyncThunk(
    'sales/fatchSales',
    async(params, {rejectWithValue }) => {
        try{
            const response = await salesApi.getSales(params);
            return response.data;
        }catch(error){
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchFilterOptions = createAsyncThunk(
    'sales/fetchFilterOptions',
    async (_, { rejectWithValue }) => {
      try {
        const response = await salesApi.getFilterOptions();
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );

  export const fetchStatistics = createAsyncThunk(
    'sales/fetchStatistics',
    async (_, { rejectWithValue }) => {
      try {
        const response = await salesApi.getStatistics();
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );

  const initialState = {
    data: [],
    pagination: {
      currentPage: 1,
      pageSize: 10,
      totalRecords: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },
    filterOptions: {
      customerRegions: [],
      genders: [],
      productCategories: [],
      tags: [],
      paymentMethods: [],
      ageRange: { min: 0, max: 100 },
      dateRange: { min: null, max: null },
    },
    statistics: {
      totalTransactions: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      totalQuantitySold: 0,
      uniqueCustomers: 0,
      uniqueProducts: 0,
    },
    loading: false,
    error: null,
    lastFetch: null,
  };
  
  const salesSlice = createSlice({
    name: 'sales',
    initialState,
    reducers: {
      clearError: (state) => {
        state.error = null;
      },
      resetSales: (state) => {
        state.data = [];
        state.pagination = initialState.pagination;
        state.error = null;
      },
    },
    extraReducers: (builder) => {
      builder
        // Fetch Sales
        .addCase(fetchSales.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchSales.fulfilled, (state, action) => {
          state.loading = false;
          state.data = action.payload.data;
          state.pagination = action.payload.pagination;
          state.lastFetch = new Date().toISOString();
          state.error = null;
        })
        .addCase(fetchSales.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Failed to fetch sales data';
          state.data = [];
        })
        // Fetch Filter Options
        .addCase(fetchFilterOptions.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchFilterOptions.fulfilled, (state, action) => {
          state.loading = false;
          state.filterOptions = action.payload;
        })
        .addCase(fetchFilterOptions.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Failed to fetch filter options';
        })
        // Fetch Statistics
        .addCase(fetchStatistics.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchStatistics.fulfilled, (state, action) => {
          state.loading = false;
          state.statistics = action.payload;
        })
        .addCase(fetchStatistics.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Failed to fetch statistics';
        });
    },
  });
  
  export const { clearError, resetSales } = salesSlice.actions;
  export default salesSlice.reducer;