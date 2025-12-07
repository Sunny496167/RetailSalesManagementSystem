// frontend/src/components/Filters/FilterDropdowns.jsx
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFilterOptions } from '../../hooks/useFilterOptions';
import {
  setCustomerRegion,
  setGender,
  setAgeRange,
  setProductCategory,
  setTags,
  setPaymentMethod,
  setDateRange,
  setSort,
  resetFilters,
} from '../../store/slices/filtersSlice';
import { SORT_OPTIONS } from '../../utils/constants';

const FilterDropdowns = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.filters);
  const { filterOptions } = useFilterOptions();
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const closeDropdown = () => {
    setOpenDropdown(null);
  };

  const FilterDropdown = ({ label, value, options, filterKey, isMulti = true }) => {
    const isOpen = openDropdown === filterKey;
    const selectedCount = Array.isArray(value) ? value.length : value ? 1 : 0;

    const handleToggle = (option) => {
      const actions = {
        customerRegion: setCustomerRegion,
        gender: setGender,
        productCategory: setProductCategory,
        tags: setTags,
        paymentMethod: setPaymentMethod,
      };

      if (isMulti) {
        const newValue = value.includes(option)
          ? value.filter((v) => v !== option)
          : [...value, option];
        dispatch(actions[filterKey](newValue));
      }
    };

    return (
      <div className="relative">
        <button
          onClick={() => toggleDropdown(filterKey)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
        >
          {label}
          {selectedCount > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-primary-100 text-primary-700 rounded-full font-semibold">
              {selectedCount}
            </span>
          )}
          <svg
            className={`ml-2 w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={closeDropdown} />
            <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20 max-h-80 overflow-y-auto">
              <div className="p-2">
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
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const AgeRangeDropdown = () => {
    const isOpen = openDropdown === 'age';
    const hasValue = filters.ageMin !== null || filters.ageMax !== null;

    return (
      <div className="relative">
        <button
          onClick={() => toggleDropdown('age')}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
        >
          Age Range
          {hasValue && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-primary-100 text-primary-700 rounded-full font-semibold">
              1
            </span>
          )}
          <svg
            className={`ml-2 w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={closeDropdown} />
            <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20 p-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Min Age</label>
                  <input
                    type="number"
                    value={filters.ageMin ?? ''}
                    onChange={(e) =>
                      dispatch(
                        setAgeRange({
                          min: e.target.value ? parseInt(e.target.value) : null,
                          max: filters.ageMax,
                        })
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Min"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Max Age</label>
                  <input
                    type="number"
                    value={filters.ageMax ?? ''}
                    onChange={(e) =>
                      dispatch(
                        setAgeRange({
                          min: filters.ageMin,
                          max: e.target.value ? parseInt(e.target.value) : null,
                        })
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const DateRangeDropdown = () => {
    const isOpen = openDropdown === 'date';
    const hasValue = filters.dateFrom || filters.dateTo;

    return (
      <div className="relative">
        <button
          onClick={() => toggleDropdown('date')}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
        >
          Date
          {hasValue && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-primary-100 text-primary-700 rounded-full font-semibold">
              1
            </span>
          )}
          <svg
            className={`ml-2 w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={closeDropdown} />
            <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20 p-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">From</label>
                  <input
                    type="date"
                    value={filters.dateFrom || ''}
                    onChange={(e) =>
                      dispatch(
                        setDateRange({
                          from: e.target.value || null,
                          to: filters.dateTo,
                        })
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">To</label>
                  <input
                    type="date"
                    value={filters.dateTo || ''}
                    onChange={(e) =>
                      dispatch(
                        setDateRange({
                          from: filters.dateFrom,
                          to: e.target.value || null,
                        })
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const SortDropdown = () => {
    const isOpen = openDropdown === 'sort';
    const currentSort = SORT_OPTIONS.find(
      (opt) => opt.sortBy === filters.sortBy && opt.sortOrder === filters.sortOrder
    );

    return (
      <div className="relative">
        <button
          onClick={() => toggleDropdown('sort')}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
        >
          Sort by: {currentSort?.label || 'Date (Newest First)'}
          <svg
            className={`ml-2 w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={closeDropdown} />
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
              <div className="p-2">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      dispatch(setSort({ sortBy: option.sortBy, sortOrder: option.sortOrder }));
                      closeDropdown();
                    }}
                    className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-50 transition-colors ${
                      currentSort?.value === option.value
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
    closeDropdown();
  };

  const activeFiltersCount = [
    filters.customerRegion.length,
    filters.gender.length,
    filters.productCategory.length,
    filters.tags.length,
    filters.paymentMethod.length,
    filters.ageMin !== null || filters.ageMax !== null ? 1 : 0,
    filters.dateFrom || filters.dateTo ? 1 : 0,
  ].reduce((sum, count) => sum + count, 0);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center space-x-3 flex-wrap gap-2">
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Reset
            {activeFiltersCount > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full font-semibold">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <FilterDropdown
            label="Customer Region"
            value={filters.customerRegion}
            options={filterOptions.customerRegions}
            filterKey="customerRegion"
          />

          <FilterDropdown
            label="Gender"
            value={filters.gender}
            options={filterOptions.genders}
            filterKey="gender"
          />

          <AgeRangeDropdown />

          <FilterDropdown
            label="Product Category"
            value={filters.productCategory}
            options={filterOptions.productCategories}
            filterKey="productCategory"
          />

          <FilterDropdown
            label="Tags"
            value={filters.tags}
            options={filterOptions.tags}
            filterKey="tags"
          />

          <FilterDropdown
            label="Payment Method"
            value={filters.paymentMethod}
            options={filterOptions.paymentMethods}
            filterKey="paymentMethod"
          />

          <DateRangeDropdown />
        </div>

        <SortDropdown />
      </div>
    </div>
  );
};

export default FilterDropdowns;