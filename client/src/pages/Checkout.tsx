import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { useCart, CartItem } from '../context/CartContext';

const Checkout: React.FC = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.address) {
      setError('Please fill in all fields.');
      return;
    }
    // Simulate order placement
    console.log('Order placed:', { ...form, cart });
    clearCart();
    navigate('/order-confirmation');
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const formattedTotal = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(total);

  return (
    <div className="bg-gray-900 min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-white mb-4">Order Summary</h2>
            {cart.length === 0 ? (
              <p className="text-gray-400">Your cart is empty.</p>
            ) : (
              <>
                {cart.map((item: CartItem) => (
                  <div key={item.id} className="flex justify-between mb-4">
                    <div>
                      <p className="text-white">{item.name}</p>
                      <p className="text-gray-400 text-sm">
                        Quantity: {item.quantity} | {item.fabric || 'Standard'}
                      </p>
                    </div>
                    <p className="text-yellow-500">
                      {new Intl.NumberFormat('en-KE', {
                        style: 'currency',
                        currency: 'KES',
                        minimumFractionDigits: 0,
                      }).format(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
                <hr className="border-gray-700 my-4" />
                <div className="flex justify-between">
                  <p className="text-white font-semibold">Total</p>
                  <p className="text-yellow-500 font-semibold">{formattedTotal}</p>
                </div>
              </>
            )}
            <Link to="/cart">
              <Button variant="outline" className="mt-4">
                Back to Cart
              </Button>
            </Link>
          </div>
          {/* Checkout Form */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-white mb-4">Billing Details</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Delivery Address</label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  rows={4}
                  required
                />
              </div>
              <Button type="submit" size="lg" className="w-full">
                Place Order
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;