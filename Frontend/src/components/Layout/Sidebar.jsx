
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';

// Sidebar Component
const Sidebar = () => {
  const { isSidebarOpen } = useSelector((state) => state.ui);
  const [servicesExpanded, setServicesExpanded] = React.useState(false);
  const [invoicesExpanded, setInvoicesExpanded] = React.useState(false);

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: 'Nexus',
      path: '/nexus',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      name: 'Intake',
      path: '/intake',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ];

  const serviceItems = [
    { name: 'Pre-active', path: '/services/pre-active' },
    { name: 'Active', path: '/services/active' },
    { name: 'Blocked', path: '/services/blocked' },
    { name: 'Closed', path: '/services/closed' },
  ];

  const invoiceItems = [
    { name: 'Proforma Invoices', path: '/invoices/proforma' },
    { name: 'Final Invoices', path: '/invoices/final' },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-50 shadow-lg ${
        isSidebarOpen ? 'w-64' : 'w-16'
      }`}
    >
      <div className="h-full flex flex-col">
        {/* User Profile Section - Only show when expanded */}
        {isSidebarOpen && (
          <div className="flex-shrink-0 px-4 pt-4 pb-3 border-b border-gray-200">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-200 cursor-pointer border border-gray-200 shadow-sm">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                V
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-900 truncate">Vault</div>
                <div className="text-xs text-gray-600 truncate">Anurag Yadav</div>
              </div>
            </div>
          </div>
        )}

        {/* Empty space when collapsed to align with header */}
        {!isSidebarOpen && (
          <div className="flex-shrink-0 h-16 border-b border-gray-200"></div>
        )}

        {/* Navigation - Scrollable */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center ${isSidebarOpen ? 'gap-3 px-4' : 'justify-center px-2'} py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-md scale-[1.02]'
                        : 'text-gray-700 hover:bg-gray-100 hover:scale-[1.01]'
                    }`
                  }
                  title={!isSidebarOpen ? item.name : ''}
                >
                  {item.icon}
                  {isSidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
                </NavLink>
              </li>
            ))}

            {/* Services Section - Only expandable when sidebar is open */}
            {isSidebarOpen && (
              <li className="pt-2">
                <button
                  onClick={() => setServicesExpanded(!servicesExpanded)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-200 hover:scale-[1.01]"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium">Services</span>
                  </div>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${servicesExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {servicesExpanded && (
                  <ul className="mt-2 space-y-1 ml-4 pl-4 border-l-2 border-gray-200">
                    {serviceItems.map((item) => (
                      <li key={item.path}>
                        <NavLink
                          to={item.path}
                          className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                              isActive
                                ? 'bg-gray-900 text-white shadow-sm font-medium'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`
                          }
                        >
                          <span>{item.name}</span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )}

            {/* Services Icon Only - Show when sidebar is collapsed */}
            {!isSidebarOpen && (
              <li className="pt-2">
                <NavLink
                  to="/services/active"
                  className={({ isActive }) =>
                    `flex items-center justify-center px-2 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                  title="Services"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </NavLink>
              </li>
            )}

            {/* Invoices Section - Only expandable when sidebar is open */}
            {isSidebarOpen && (
              <li className="pt-2">
                <button
                  onClick={() => setInvoicesExpanded(!invoicesExpanded)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-200 hover:scale-[1.01]"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm font-medium">Invoices</span>
                  </div>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${invoicesExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {invoicesExpanded && (
                  <ul className="mt-2 space-y-1 ml-4 pl-4 border-l-2 border-gray-200">
                    {invoiceItems.map((item) => (
                      <li key={item.path}>
                        <NavLink
                          to={item.path}
                          className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                              isActive
                                ? 'bg-gray-900 text-white shadow-sm font-medium'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`
                          }
                        >
                          <span>{item.name}</span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )}

            {/* Invoices Icon Only - Show when sidebar is collapsed */}
            {!isSidebarOpen && (
              <li className="pt-2">
                <NavLink
                  to="/invoices/proforma"
                  className={({ isActive }) =>
                    `flex items-center justify-center px-2 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                  title="Invoices"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;