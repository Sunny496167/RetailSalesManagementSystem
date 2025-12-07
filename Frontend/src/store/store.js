import { configureStore } from '@reduxjs/toolkit';
import salesReducer from './slices/salesSlice';
import filtersReducer from './slices/filtersSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    sales: salesReducer,
    filters: filtersReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['sales/fetchSales/pending'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;