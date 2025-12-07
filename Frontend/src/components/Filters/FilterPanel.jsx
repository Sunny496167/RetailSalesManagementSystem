// frontend/src/components/Filters/FilterPanel.jsx
import { useSelector, useDispatch } from 'react-redux';
import { setFilterPanelOpen } from '../../store/slices/uiSlice';
import { resetFilters } from '../../store/slices/filtersSlice';
import { useFilterOptions } from '../../hooks/useFilterOptions';
import MultiSelectFilter from './MultiSelectFilter';
import DateRangeFilter from './DateRangeFilter';
import AgeRangeFilter from './AgeRangeFilter';
import Button from '../Common/Button';

const FilterPanel = () => {
  const dispatch = useDispatch();
  const { isFilterPanelOpen } = useSelector((state) => state.ui);
  const { filterOptions, loading } = useFilterOptions();
  const filters = useSelector((state) => state.filters);

  const handleClose = () => {
    dispatch(setFilterPanelOpen(false));
  };

  const handleReset = () => {
    dispatch(resetFilters());
  };

  if (!isFilterPanelOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={handleClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
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
          </div>
        </div>

        <div className="p-6 space-y-6">
          {loading ? (
            <div className="text-center py-4">
              <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin"></div>
              <p className="mt-2 text-sm text-gray-600">Loading filters...</p>
            </div>
          ) : (
            <>
              {/* Customer Region */}
              <MultiSelectFilter
                label="Customer Region"
                options={filterOptions.customerRegions}
                value={filters.customerRegion}
                filterKey="customerRegion"
              />

              {/* Gender */}
              <MultiSelectFilter
                label="Gender"
                options={filterOptions.genders}
                value={filters.gender}
                filterKey="gender"
              />

              {/* Age Range */}
              <AgeRangeFilter
                min={filters.ageMin}
                max={filters.ageMax}
                range={filterOptions.ageRange}
              />

              {/* Product Category */}
              <MultiSelectFilter
                label="Product Category"
                options={filterOptions.productCategories}
                value={filters.productCategory}
                filterKey="productCategory"
              />

              {/* Tags */}
              <MultiSelectFilter
                label="Tags"
                options={filterOptions.tags}
                value={filters.tags}
                filterKey="tags"
              />

              {/* Payment Method */}
              <MultiSelectFilter
                label="Payment Method"
                options={filterOptions.paymentMethods}
                value={filters.paymentMethod}
                filterKey="paymentMethod"
              />

              {/* Date Range */}
              <DateRangeFilter
                from={filters.dateFrom}
                to={filters.dateTo}
                range={filterOptions.dateRange}
              />
            </>
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleReset} className="flex-1">
              Reset All
            </Button>
            <Button variant="primary" onClick={handleClose} className="flex-1">
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterPanel;