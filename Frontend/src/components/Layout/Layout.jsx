import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = () => {
  const { isSidebarOpen } = useSelector((state) => state.ui);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <Header />
      
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area - with proper margin/padding */}
      <main
        className={`transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'ml-64' : 'ml-0'
        }`}
        style={{ paddingTop: '80px' }} // Space for fixed header
      >
        <div className="px-6 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;