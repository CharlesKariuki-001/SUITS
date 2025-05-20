import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <span className="text-gold-500 font-bold text-xl">KENYA BESPOKE</span>
            </Link>
            <p className="text-sm mb-4">
              Premium bespoke suits made to order. Experience the perfect fit and exceptional quality with Kenya's finest suit makers.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gold-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gold-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gold-500 transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-white font-medium text-base mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/mens" className="text-gray-400 hover:text-gold-500 transition-colors text-sm">
                  Men's Suits
                </Link>
              </li>
              <li>
                <Link to="/womens" className="text-gray-400 hover:text-gold-500 transition-colors text-sm">
                  Women's Suits
                </Link>
              </li>
              <li>
                <Link to="/custom-tailoring" className="text-gray-400 hover:text-gold-500 transition-colors text-sm">
                  Custom Tailoring
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-gold-500 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-gold-500 transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Support */}
          <div className="col-span-1">
            <h3 className="text-white font-medium text-base mb-4">Help & Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-gold-500 transition-colors text-sm">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-400 hover:text-gold-500 transition-colors text-sm">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-400 hover:text-gold-500 transition-colors text-sm">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/size-guide" className="text-gray-400 hover:text-gold-500 transition-colors text-sm">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-gold-500 transition-colors text-sm">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="col-span-1">
            <h3 className="text-white font-medium text-base mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-0.5 text-gold-500" />
                <div>
                  <p className="text-sm">84 Kimathi Street</p>
                  <p className="text-sm">Nairobi, Kenya</p>
                </div>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-gold-500" />
                <p className="text-sm">+254 712 345 678</p>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-gold-500" />
                <p className="text-sm">info@kenyabespoke.com</p>
              </li>
            </ul>

            <div className="mt-6">
              <h4 className="text-white font-medium text-sm mb-2">Working Hours</h4>
              <p className="text-sm">Monday - Friday: 9am - 6pm</p>
              <p className="text-sm">Saturday: 10am - 4pm</p>
              <p className="text-sm">Sunday: Closed</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Kenya Bespoke Suits. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <Link to="/privacy" className="text-sm text-gray-400 hover:text-gold-500 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-gray-400 hover:text-gold-500 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;