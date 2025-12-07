// frontend/src/components/Filters/MultiSelectFilter.jsx
import { useDispatch } from 'react-redux';
import {
  setCustomerRegion,
  setGender,
  setProductCategory,
  setTags,
  setPaymentMethod,
} from '../../store/slices/filtersSlice';

const MultiSelectFilter = ({ label, options, value, filterKey }) => {
  const dispatch = useDispatch();

  const actionMap = {
    customerRegion: setCustomerRegion,
    gender: setGender,
    productCategory: setProductCategory,
    tags: setTags,
    paymentMethod: setPaymentMethod,
  };

  const handleToggle = (option) => {
    const newValue = value.includes(option)
      ? value.filter((v) => v !== option)
      : [...value, option];
    dispatch(actionMap[filterKey](newValue));
  };

  const handleSelectAll = () => {
    if (value.length === options.length) {
      dispatch(actionMap[filterKey]([]));
    } else {
      dispatch(actionMap[filterKey](options));
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {options.length > 0 && (
          <button
            onClick={handleSelectAll}
            className="text-xs text-primary-600 hover:text-primary-700 font-medium"
          >
            {value.length === options.length ? 'Deselect All' : 'Select All'}
          </button>
        )}
      </div>
      <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-1">
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center px-3 py-2 hover:bg-gray-50 rounded cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              checked={value.includes(option)}
              onChange={() => handleToggle(option)}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="ml-3 text-sm text-gray-700">{option}</span>
          </label>
        ))}
        {options.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">No options available</p>
        )}
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {value.map((item) => (
            <span
              key={item}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
            >
              {item}
              <button
                onClick={() => handleToggle(item)}
                className="ml-1 hover:text-primary-600"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectFilter;