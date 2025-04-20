import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Package, Settings } from 'lucide-react';

const AdminSidebar: React.FC = () => {
  const navItems = [
    {
      label: 'Dashboard',
      path: '/admin/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      label: 'Orders',
      path: '/admin/orders',
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      label: 'Products',
      path: '/admin/products',
      icon: <Package className="h-5 w-5" />,
    },
    {
      label: 'Settings',
      path: '/admin/settings',
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <aside className="hidden md:block w-64 bg-white shadow-md">
      <div className="py-6">
        <div className="px-4 text-xl font-bold text-green-600 mb-6">
          HarvestHub Admin
        </div>
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-green-50 text-green-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;