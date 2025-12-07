// frontend/src/components/Filters/AgeRangeFilter.jsx
import { useDispatch } from 'react-redux';
import { setAgeRange } from '../../store/slices/filtersSlice';
import Input from '../Common/Input';

const AgeRangeFilter = ({ min, max, range }) => {
  const dispatch = useDispatch();

  const handleMinChange = (e) => {
    const value = e.target.value ? parseInt(e.target.value) : null;
    dispatch(setAgeRange({ min: value, max }));
  };

  const handleMaxChange = (e) => {
    const value = e.target.value ? parseInt(e.target.value) : null;
    dispatch(setAgeRange({ min, max: value }));
  };

  const handleClear = () => {
    dispatch(setAgeRange({ min: null, max: null }));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">Age Range</label>
        {(min !== null || max !== null) && (
          <button
            onClick={handleClear}
            className="text-xs text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input
          type="number"
          value={min ?? ''}
          onChange={handleMinChange}
          placeholder={`Min (${range.min})`}
          min={range.min}
          max={range.max}
        />
        <Input
          type="number"
          value={max ?? ''}
          onChange={handleMaxChange}
          placeholder={`Max (${range.max})`}
          min={range.min}
          max={range.max}
        />
      </div>
      {(min !== null || max !== null) && (
        <div className="px-2 py-1 bg-primary-50 rounded text-xs text-primary-700">
          {min !== null && max !== null
            ? `Ages ${min} - ${max}`
            : min !== null
            ? `Ages ${min}+`
            : `Ages up to ${max}`}
        </div>
      )}
    </div>
  );
};

export default AgeRangeFilter;