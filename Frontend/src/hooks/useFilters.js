import { useDispatch, useSelector } from 'react-redux';
import {
  setSearch,
  setCustomerRegion,
  setGender,
  setAgeRange,
  setProductCategory,
  setTags,
  setPaymentMethod,
  setDateRange,
  setSort,
  setPage,
  setPageSize,
  resetFilters,
} from '../store/slices/filtersSlice';

export const useFilters = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.filters);

  return {
    filters,
    setSearch: (value) => dispatch(setSearch(value)),
    setCustomerRegion: (value) => dispatch(setCustomerRegion(value)),
    setGender: (value) => dispatch(setGender(value)),
    setAgeRange: (value) => dispatch(setAgeRange(value)),
    setProductCategory: (value) => dispatch(setProductCategory(value)),
    setTags: (value) => dispatch(setTags(value)),
    setPaymentMethod: (value) => dispatch(setPaymentMethod(value)),
    setDateRange: (value) => dispatch(setDateRange(value)),
    setSort: (value) => dispatch(setSort(value)),
    setPage: (value) => dispatch(setPage(value)),
    setPageSize: (value) => dispatch(setPageSize(value)),
    resetFilters: () => dispatch(resetFilters()),
  };
};

