import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Truck, Search } from "lucide-react";
import { useCart } from "../contexts/CartContext";

const Header: React.FC = () => {
  const location = useLocation();
  const { totalItems } = useCart();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <Truck className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                HarvestHub
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden sm:flex space-x-8">
            <Link
              to="/"
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                isActive("/")
                  ? "border-green-500 text-gray-900"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              Products
            </Link>
            <Link
              to="/tracking"
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                isActive("/tracking")
                  ? "border-green-500 text-gray-900"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              Track Order
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Link
              to="/tracking"
              className="sm:hidden p-2 rounded-full hover:bg-gray-100"
            >
              <Search className="h-5 w-5 text-gray-500" />
            </Link>
            <Link
              to="/order"
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ShoppingCart className="h-5 w-5 text-gray-500" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-green-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="sm:hidden border-t border-gray-200">
        <div className="px-2 py-3 space-y-1">
          <Link
            to="/"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive("/")
                ? "bg-green-50 text-green-700"
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            Products
          </Link>
          <Link
            to="/tracking"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive("/tracking")
                ? "bg-green-50 text-green-700"
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            Track Order
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
