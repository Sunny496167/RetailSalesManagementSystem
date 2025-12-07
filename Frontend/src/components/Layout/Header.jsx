import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar, toggleFilterPanel } from '../../store/slices/uiSlice';

const Header = () => {
  const dispatch = useDispatch();
  const { isFilterPanelOpen } = useSelector((state) => state.ui);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle sidebar"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-gray-900">
              Retail Sales Management
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => dispatch(toggleFilterPanel())}
              className={`p-2 rounded-lg transition-colors ${
                isFilterPanelOpen
                  ? 'bg-primary-100 text-primary-600'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              aria-label="Toggle filters"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;