import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFilterOptions } from '../store/slices/salesSlice';

export const useFilterOptions = () => {
  const dispatch = useDispatch();
  const { filterOptions, loading } = useSelector((state) => state.sales);

  useEffect(() => {
    if (filterOptions.customerRegions.length === 0) {
      dispatch(fetchFilterOptions());
    }
  }, [dispatch, filterOptions.customerRegions.length]);

  return {
    filterOptions,
    loading,
  };
};

