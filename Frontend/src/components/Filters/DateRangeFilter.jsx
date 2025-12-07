// frontend/src/components/Filters/DateRangeFilter.jsx
import { useDispatch } from 'react-redux';
import { setDateRange } from '../../store/slices/filtersSlice';
import Input from '../Common/Input';

const DateRangeFilter = ({ from, to, range }) => {
  const dispatch = useDispatch();

  const handleFromChange = (e) => {
    dispatch(setDateRange({ from: e.target.value || null, to }));
  };

  const handleToChange = (e) => {
    dispatch(setDateRange({ from, to: e.target.value || null }));
  };

  const handleClear = () => {
    dispatch(setDateRange({ from: null, to: null }));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">Date Range</label>
        {(from || to) && (
          <button
            onClick={handleClear}
            className="text-xs text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear
          </button>
        )}
      </div>
      <div className="space-y-3">
        <Input
          type="date"
          value={from || ''}
          onChange={handleFromChange}
          label="From"
          max={to || range.max}
        />
        <Input
          type="date"
          value={to || ''}
          onChange={handleToChange}
          label="To"
          min={from || range.min}
        />
      </div>
      {(from || to) && (
        <div className="px-2 py-1 bg-primary-50 rounded text-xs text-primary-700">
          {from && to
            ? `${new Date(from).toLocaleDateString()} - ${new Date(to).toLocaleDateString()}`
            : from
            ? `From ${new Date(from).toLocaleDateString()}`
            : `Until ${new Date(to).toLocaleDateString()}`}
        </div>
      )}
    </div>
  );
};

export default DateRangeFilter;