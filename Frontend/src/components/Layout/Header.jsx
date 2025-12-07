import { useDispatch, useSelector } from 'react-redux';
import { toggleFilterPanel } from '../../store/slices/uiSlice';

const Header = () => {
  const dispatch = useDispatch();
  const { isFilterPanelOpen, isSidebarOpen } = useSelector((state) => state.ui);

  return (
    <header 
      className="bg-white border-b border-gray-200 fixed top-0 z-40 shadow-sm transition-all duration-300"
      style={{
        left: isSidebarOpen ? '256px' : '64px',
        right: 0,
        width: isSidebarOpen ? 'calc(100% - 256px)' : 'calc(100% - 64px)'
      }}
    >
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h1 className="text-lg font-bold text-gray-900 tracking-tight">
              Retail Sales Management
            </h1>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            {/* Filter Button */}
            <button
              onClick={() => dispatch(toggleFilterPanel())}
              className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 ${
                isFilterPanelOpen
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
              aria-label="Toggle filters"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
            </button>

            {/* Notifications Button */}
            <button
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-all duration-200 hover:scale-105 active:scale-95 relative"
              aria-label="Notifications"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;