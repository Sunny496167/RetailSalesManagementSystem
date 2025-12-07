// frontend/src/pages/DashboardPage.jsx
import { useSelector } from 'react-redux';
import { useSalesData } from '../hooks/useSalesData';
import { useFilters } from '../hooks/useFilters';
import FilterDropdowns from '../components/Filters/FilterDropdowns';
import SalesTable from '../components/Sales/SalesTable';
import SalesGrid from '../components/Sales/SalesGrid';
import StatisticsCards from '../components/Sales/StatisticsCards';
import Pagination from '../components/Common/Pagination';

const Dashboard = () => {
  const { sales, pagination, loading, error, refetch } = useSalesData();
  const { setPage } = useFilters();
  const { viewMode } = useSelector((state) => state.ui);

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <StatisticsCards />

      {/* Filter Dropdowns */}
      <FilterDropdowns />

      {/* Sales Table/Grid */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {viewMode === 'table' ? (
          <SalesTable data={sales} loading={loading} error={error} onRetry={refetch} />
        ) : (
          <SalesGrid data={sales} loading={loading} error={error} onRetry={refetch} />
        )}

        {/* Pagination */}
        {!loading && !error && sales.length > 0 && (
          <div className="border-t border-gray-200 px-6 py-4">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalRecords={pagination.totalRecords}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;