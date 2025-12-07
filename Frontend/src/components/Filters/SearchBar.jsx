// frontend/src/components/Filters/SearchBar.jsx
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setSearch } from '../../store/slices/filtersSlice';
import { useDebounce } from '../../hooks/useDebounce';
import Input from '../Common/Input';

const SearchBar = ({ value }) => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState(value);
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    dispatch(setSearch(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  const handleClear = () => {
    setSearchTerm('');
    dispatch(setSearch(''));
  };

  return (
    <div className="relative">
      <Input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by name or phone..."
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        }
      />
      {searchTerm && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SearchBar;