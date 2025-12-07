import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  search: '',
  customerRegion: [],
  gender: [],
  ageMin: null,
  ageMax: null,
  productCategory: [],
  tags: [],
  paymentMethod: [],
  dateFrom: null,
  dateTo: null,
  sortBy: 'date',
  sortOrder: 'desc',
  page: 1,
  pageSize: 10,
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
      state.page = 1; // Reset to first page on search
    },
    setCustomerRegion: (state, action) => {
      state.customerRegion = action.payload;
      state.page = 1;
    },
    setGender: (state, action) => {
      state.gender = action.payload;
      state.page = 1;
    },
    setAgeRange: (state, action) => {
      state.ageMin = action.payload.min;
      state.ageMax = action.payload.max;
      state.page = 1;
    },
    setProductCategory: (state, action) => {
      state.productCategory = action.payload;
      state.page = 1;
    },
    setTags: (state, action) => {
      state.tags = action.payload;
      state.page = 1;
    },
    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      state.page = 1;
    },
    setDateRange: (state, action) => {
      state.dateFrom = action.payload.from;
      state.dateTo = action.payload.to;
      state.page = 1;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    setSort: (state, action) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
      state.page = 1;
    },
    resetFilters: (state) => {
      state.search = '';
      state.customerRegion = [];
      state.gender = [];
      state.ageMin = null;
      state.ageMax = null;
      state.productCategory = [];
      state.tags = [];
      state.paymentMethod = [];
      state.dateFrom = null;
      state.dateTo = null;
      state.page = 1;
    },
    resetAllFilters: () => initialState,
  },
});

export const {
  setSearch,
  setCustomerRegion,
  setGender,
  setAgeRange,
  setProductCategory,
  setTags,
  setPaymentMethod,
  setDateRange,
  setSortBy,
  setSortOrder,
  setSort,
  setPage,
  setPageSize,
  resetFilters,
  resetAllFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;