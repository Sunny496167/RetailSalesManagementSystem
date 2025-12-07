// frontend/src/pages/DashboardPage.jsx
import { useSelector } from 'react-redux';
import { useSalesData } from '../hooks/useSalesData';
import { useFilters } from '../hooks/useFilters';
import SearchBar from '../components/Filters/SearchBar';
import FilterPanel from '../components/Filters/FilterPanel';
import SortDropdown from '../components/Sales/SortDropdown';
import SalesTable from '../components/Sales/SalesTable';
import SalesGrid from '../components/Sales/SalesGrid';
import StatisticsCards from '../components/Sales/StatisticsCards';
import Pagination from '../components/Common/Pagination';
import Button from '../components/Common/Button';
import Card from '../components/Common/Card';

const Dashboard = () => {
  const { sales, pagination, loading, error, refetch } = useSalesData();
  const { filters, setPage, resetFilters } = useFilters();
  const { viewMode } = useSelector((state) => state.ui);

  const hasActiveFilters = 
    filters.search ||
    filters.customerRegion.length > 0 ||
    filters.gender.length > 0 ||
    filters.ageMin !== null ||
    filters.ageMax !== null ||
    filters.productCategory.length > 0 ||
    filters.tags.length > 0 ||
    filters.paymentMethod.length > 0 ||
    filters.dateFrom ||
    filters.dateTo;

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
    <div className="space-y-6">
      {/* Statistics Cards */}
      <StatisticsCards />

      {/* Main Content Card */}
      <Card
        title="Sales Transactions"
        actions={
          <div className="flex items-center space-x-3">
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                Clear All Filters
                {activeFiltersCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-primary-100 text-primary-600 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            )}
          </div>
        }
      >
        {/* Search and Sort Controls */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <SearchBar value={filters.search} />
          </div>
          <div>
            <SortDropdown sortBy={filters.sortBy} sortOrder={filters.sortOrder} />
          </div>
        </div>

        {/* Sales Table/Grid */}
        {viewMode === 'table' ? (
          <SalesTable data={sales} loading={loading} error={error} onRetry={refetch} />
        ) : (
          <SalesGrid data={sales} loading={loading} error={error} onRetry={refetch} />
        )}

        {/* Pagination */}
        {!loading && !error && sales.length > 0 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalRecords={pagination.totalRecords}
            onPageChange={setPage}
          />
        )}
      </Card>

      {/* Filter Panel */}
      <FilterPanel />
    </div>
  );
};

export default Dashboard;



