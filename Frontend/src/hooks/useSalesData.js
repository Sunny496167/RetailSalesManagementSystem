import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSales } from '../store/slices/salesSlice';

export const useSalesData = () => {
  const dispatch = useDispatch();
  const { data, pagination, loading, error } = useSelector((state) => state.sales);
  const filters = useSelector((state) => state.filters);

  const loadSales = useCallback(() => {
    dispatch(fetchSales(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    loadSales();
  }, [loadSales]);

  return {
    sales: data,
    pagination,
    loading,
    error,
    refetch: loadSales,
  };
};

