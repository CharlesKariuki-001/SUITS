import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { cart } = useCart();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // Safely calculate cart item count
  const cartItemCount = cart ? cart.reduce((count, item) => count + (item.quantity || 1), 0) : 0;

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img
                src="/assets/images/logo.jpeg"
                alt="SSS Gustom Logo"
                className="h-8 md:h-10 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`text-sm ${
                isActive('/') ? 'text-gold-500' : 'text-gray-200 hover:text-gold-500'
              } transition-colors`}
            >
              Home
            </Link>
            <Link
              to="/mens"
              className={`text-sm ${
                isActive('/mens') ? 'text-gold-500' : 'text-gray-200 hover:text-gold-500'
              } transition-colors`}
            >
              Men's Suits
            </Link>
            <Link
              to="/womens"
              className={`text-sm ${
                isActive('/womens') ? 'text-gold-500' : 'text-gray-200 hover:text-gold-500'
              } transition-colors`}
            >
              Women's Suits
            </Link>
            <Link
              to="/custom-tailoring"
              className={`text-sm ${
                isActive('/custom-tailoring') ? 'text-gold-500' : 'text-gray-200 hover:text-gold-500'
              } transition-colors`}
            >
              Custom Tailoring
            </Link>
            <Link
              to="/about"
              className={`text-sm ${
                isActive('/about') ? 'text-gold-500' : 'text-gray-200 hover:text-gold-500'
              } transition-colors`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`text-sm ${
                isActive('/contact') ? 'text-gold-500' : 'text-gray-200 hover:text-gold-500'
              } transition-colors`}
            >
              Contact
            </Link>

            <div className="relative">
              <Link to="/cart" className="text-gray-200 hover:text-gold-500">
                <ShoppingBag size={20} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gold-500 text-gray-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-4">
            <Link to="/cart" className="text-gray-200 hover:text-gold-500 relative">
              <ShoppingBag size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold-500 text-gray-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <button
              className="text-gray-200 hover:text-gold-500"
              onClick={toggleMenu}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 py-2">
          <div className="px-4 space-y-3">
            <Link
              to="/"
              className={`block py-2 ${
                isActive('/') ? 'text-gold-500' : 'text-gray-200'
              }`}
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link
              to="/mens"
              className={`block py-2 ${
                isActive('/mens') ? 'text-gold-500' : 'text-gray-200'
              }`}
              onClick={closeMenu}
            >
              Men's Suits
            </Link>
            <Link
              to="/womens"
              className={`block py-2 ${
                isActive('/womens') ? 'text-gold-500' : 'text-gray-200'
              }`}
              onClick={closeMenu}
            >
              Women's Suits
            </Link>
            <Link
              to="/custom-tailoring"
              className={`block py-2 ${
                isActive('/custom-tailoring') ? 'text-gold-500' : 'text-gray-200'
              }`}
              onClick={closeMenu}
            >
              Custom Tailoring
            </Link>
            <Link
              to="/about"
              className={`block py-2 ${
                isActive('/about') ? 'text-gold-500' : 'text-gray-200'
              }`}
              onClick={closeMenu}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`block py-2 ${
                isActive('/contact') ? 'text-gold-500' : 'text-gray-200'
              }`}
              onClick={closeMenu}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;