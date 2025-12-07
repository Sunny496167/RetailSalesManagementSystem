// frontend/src/components/Sales/SalesCard.jsx
import { formatCurrency, formatDate } from '../../utils/formatters';

const SalesCard = ({ sale }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{sale.customerName}</h3>
          <p className="text-xs text-gray-500">{sale.phoneNumber}</p>
        </div>
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            sale.orderStatus === 'Completed'
              ? 'bg-green-100 text-green-800'
              : sale.orderStatus === 'Pending'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {sale.orderStatus}
        </span>
      </div>

      <div className="space-y-2 mb-3">
        <div>
          <p className="text-sm font-medium text-gray-900">{sale.productName}</p>
          <p className="text-xs text-gray-500">{sale.brand} • {sale.productCategory}</p>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Quantity:</span>
          <span className="font-medium text-gray-900">{sale.quantity}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Price:</span>
          <span className="font-medium text-gray-900">{formatCurrency(sale.pricePerUnit)}</span>
        </div>

        {sale.discountPercentage > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Discount:</span>
            <span className="font-medium text-green-600">{sale.discountPercentage}%</span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-200">
          <span className="text-gray-600">Total:</span>
          <span className="font-bold text-gray-900">{formatCurrency(sale.finalAmount)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <span className="text-xs text-gray-500">{formatDate(sale.date)}</span>
        <span className="text-xs text-gray-500">{sale.paymentMethod}</span>
      </div>
    </div>
  );
};

export default SalesCard;