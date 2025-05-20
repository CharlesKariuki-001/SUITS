import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';

const OrderConfirmation: React.FC = () => {
  const location = useLocation();
  const { orderId } = location.state || { orderId: null };

  return (
    <div className="bg-gray-900 min-h-screen py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" aria-hidden="true" />
          <h1 className="text-4xl font-bold text-white mb-4">
            Order Confirmed!
          </h1>
          {orderId ? (
            <p className="text-xl text-gray-300 mb-6">
              Thank you for your order! Your order number is <span className="text-yellow-500 font-semibold">#{orderId}</span>.
              We'll contact you soon to confirm details and arrange payment.
            </p>
          ) : (
            <p className="text-xl text-gray-300 mb-6">
              Thank you for your order! We'll contact you soon to confirm details and arrange payment.
            </p>
          )}
          <p className="text-gray-400 mb-8">
            You can track your order status using your order number and email or phone number on the cart page.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/">
              <Button size="lg">
                Return to Home
              </Button>
            </Link>
            <Link to="/mens">
              <Button size="lg" variant="outline">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmation;