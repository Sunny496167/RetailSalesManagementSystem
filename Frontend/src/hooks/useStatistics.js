import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStatistics } from '../store/slices/salesSlice';

export const useStatistics = () => {
  const dispatch = useDispatch();
  const { statistics, loading } = useSelector((state) => state.sales);

  useEffect(() => {
    dispatch(fetchStatistics());
  }, [dispatch]);

  return {
    statistics,
    loading,
  };
};

