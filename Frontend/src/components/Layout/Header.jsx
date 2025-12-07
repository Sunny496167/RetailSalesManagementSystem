import { useDispatch, useSelector } from 'react-redux';
import { toggleFilterPanel } from '../../store/slices/uiSlice';
import SearchBar from '../Filters/SearchBar';

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
          {/* Left Section - Hamburger + Logo + Title */}
          <div className="flex items-center space-x-3">
            {/* Hamburger Button */}
            <button
              onClick={() => dispatch({ type: 'ui/toggleSidebar' })}
              className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 active:scale-95 flex items-center justify-center"
              aria-label="Toggle sidebar"
            >
              <svg
                className="w-6 h-6 text-gray-700"
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

            {/* Logo */}
            <div className="w-9 h-9 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>

            {/* Title */}
            <h1 className="text-lg font-bold text-gray-900 tracking-tight">
              Retail Sales Management
            </h1>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            <SearchBar />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;