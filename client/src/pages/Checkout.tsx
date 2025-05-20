import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import Button from '../components/ui/Button';

const Checkout: React.FC = () => {
  const { cart, removeFromCart } = useCart();
  const navigate = useNavigate();

  // State for shipping form
  const [shippingDetails, setShippingDetails] = useState({
    name: '',
    address: '',
    phone: '',
    paymentMethod: 'Cash on Delivery',
  });

  // State for form errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Calculate totals
  const subtotal = cart.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const taxRate = 0.16; // 16% VAT in Kenya
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({ ...prev, [name]: value }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!shippingDetails.name.trim()) newErrors.name = 'Name is required';
    if (!shippingDetails.address.trim()) newErrors.address = 'Address is required';
    if (!shippingDetails.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\+?\d{10,12}$/.test(shippingDetails.phone))
      newErrors.phone = 'Please enter a valid phone number (e.g., +254123456789)';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // Prepare order data
      const orderData = {
        items: cart.items.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        shipping_details: shippingDetails,
        subtotal,
        tax,
        total,
      };

      // Make API call to create order
      await axios.post('http://127.0.0.1:8000/api/orders', orderData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      // Clear the cart
      for (const item of cart.items) {
        await removeFromCart(item.id);
      }

      // Redirect to confirmation page (we'll create this later)
      navigate('/order-confirmation', {
        state: { order: { ...orderData, created_at: new Date().toISOString() } },
      });
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  // Format currency
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="bg-gray-900 min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Checkout</h1>

        {cart.items.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-400 mb-4">Your cart is empty.</p>
            <Link to="/mens">
              <Button size="lg">Shop Men’s Suits</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-white mb-4">Order Summary</h2>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {cart.items.map(item => (
                  <div key={item.id} className="flex items-center border-b border-gray-700 pb-4">
                    <img
                      src={item.product.image_urls[0] || '/assets/images/placeholder.png'}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-md mr-4"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">{item.product.name}</h3>
                      <p className="text-gray-400">
                        {formatCurrency(item.product.price)} x {item.quantity}
                      </p>
                      <p className="text-gray-200 font-semibold">
                        Subtotal: {formatCurrency(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t border-gray-700 pt-4">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-300 mt-2">
                  <span>Tax (16% VAT)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between text-white font-semibold text-lg mt-4">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            {/* Shipping and Payment Form */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-white mb-4">Shipping & Payment</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={shippingDetails.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="address" className="block text-gray-300 mb-1">
                    Shipping Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={shippingDetails.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={shippingDetails.phone}
                    onChange={handleInputChange}
                    placeholder="+254123456789"
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label htmlFor="paymentMethod" className="block text-gray-300 mb-1">
                    Payment Method
                  </label>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={shippingDetails.paymentMethod}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                  >
                    <option value="Cash on Delivery">Cash on Delivery</option>
                    {/* Add more payment options later */}
                  </select>
                </div>
                <Button type="submit" size="lg" className="w-full mt-6">
                  Place Order
                </Button>
              </form>
              <Link to="/cart" className="block text-center text-gray-400 mt-4 hover:text-gold-500">
                Back to Cart
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;