import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = () => {
  const { isSidebarOpen } = useSelector((state) => state.ui);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - Fixed position, full height */}
      <Sidebar />
      
      {/* Main wrapper - shifts with sidebar */}
      <div
        className={`min-h-screen transition-all duration-300 ${
          isSidebarOpen ? 'ml-64' : 'ml-16'
        }`}
      >
        {/* Header - Fixed at top */}
        <Header />
        
        {/* Main Content - Proper top padding to account for header */}
        <main className="pt-16 px-6 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;