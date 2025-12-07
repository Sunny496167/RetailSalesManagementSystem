import { useStatistics } from '../../hooks/useStatistics';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import Loading from '../Common/Loading';

const StatisticsCards = () => {
  const { statistics, loading } = useStatistics();

  if (loading) {
    return <Loading size="sm" />;
  }

  const stats = [
    {
      title: 'Total Transactions',
      value: formatNumber(statistics.totalTransactions),
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(statistics.totalRevenue),
    },
    {
      title: 'Avg Order Value',
      value: formatCurrency(statistics.averageOrderValue),
    },
    {
      title: 'Unique Customers',
      value: formatNumber(statistics.uniqueCustomers),
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-full ${colorClasses[stat.color]} text-white`}>
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatisticsCards;