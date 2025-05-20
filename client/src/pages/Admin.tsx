import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';

interface Order {
  id: number;
  user_name: string;
  user_email: string;
  user_phone: string;
  items: { name: string; quantity: number }[];
  total: number;
  status: 'Received' | 'In Progress' | 'Ready' | 'Delivered';
  created_at: string;
}

interface Subscriber {
  email: string;
  created_at: string;
}

interface OrdersResponse {
  message: string;
  data: Order[];
}

interface SubscribersResponse {
  message: string;
  data: Subscriber[];
}

const Admin: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      toast.success('Access granted', { duration: 2000 });
    } else {
      toast.error('Invalid password', { duration: 2000 });
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [ordersResponse, subscribersResponse] = await Promise.all([
          axios.get<OrdersResponse>('http://127.0.0.1:8000/api/admin/orders'),
          axios.get<SubscribersResponse>('http://127.0.0.1:8000/api/admin/subscribers'),
        ]);
        setOrders(ordersResponse.data.data);
        setSubscribers(subscribersResponse.data.data);
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to fetch data', { duration: 4000 });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  const updateStatus = async (orderId: number, status: Order['status']) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/admin/orders/${orderId}`, { status });
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status } : order
      ));
      toast.success(`Order #${orderId} updated to ${status}`, { duration: 2000 });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update status', { duration: 4000 });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <Toaster position="top-right" toastOptions={{ className: 'bg-gray-800 text-white border border-yellow-500' }} />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 p-8 rounded-lg max-w-sm w-full"
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm text-gray-300 mb-1">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter admin password"
                aria-required="true"
              />
            </div>
            <Button type="submit" size="lg" className="w-full">
              Login
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen py-16">
      <Toaster position="top-right" toastOptions={{ className: 'bg-gray-800 text-white border border-yellow-500' }} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-white mb-8 text-center"
        >
          Admin Dashboard
        </motion.h1>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">Orders</h2>
          {isLoading ? (
            <p className="text-gray-300">Loading...</p>
          ) : orders.length === 0 ? (
            <p className="text-gray-300">No orders found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full bg-gray-800 rounded-lg">
                <thead>
                  <tr className="text-left text-gray-300">
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Items</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className="border-t border-gray-700">
                      <td className="p-4 text-white">{order.id}</td>
                      <td className="p-4 text-white">
                        {order.user_name}<br />
                        {order.user_email}<br />
                        {order.user_phone}
                      </td>
                      <td className="p-4 text-white">
                        {order.items.map((item, index) => (
                          <div key={index}>- {item.name} (x{item.quantity})</div>
                        ))}
                      </td>
                      <td className="p-4 text-white">
                        {new Intl.NumberFormat('en-KE', {
                          style: 'currency',
                          currency: 'KES',
                          minimumFractionDigits: 0,
                        }).format(order.total)}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded text-sm ${
                            order.status === 'Delivered' ? 'bg-green-500' : 'bg-yellow-500'
                          } text-white`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 flex space-x-2">
                        {order.status !== 'Received' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatus(order.id, 'Received')}
                            aria-label={`Set order ${order.id} to Received`}
                          >
                            Received
                          </Button>
                        )}
                        {order.status !== 'In Progress' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatus(order.id, 'In Progress')}
                            aria-label={`Set order ${order.id} to In Progress`}
                          >
                            In Progress
                          </Button>
                        )}
                        {order.status !== 'Ready' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatus(order.id, 'Ready')}
                            aria-label={`Set order ${order.id} to Ready`}
                          >
                            Ready
                          </Button>
                        )}
                        {order.status !== 'Delivered' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatus(order.id, 'Delivered')}
                            aria-label={`Set order ${order.id} to Delivered`}
                          >
                            Delivered
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">Subscribers</h2>
          {isLoading ? (
            <p className="text-gray-300">Loading...</p>
          ) : subscribers.length === 0 ? (
            <p className="text-gray-300">No subscribers found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full bg-gray-800 rounded-lg">
                <thead>
                  <tr className="text-left text-gray-300">
                    <th className="p-4">Email</th>
                    <th className="p-4">Subscribed At</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((subscriber, index) => (
                    <tr key={index} className="border-t border-gray-700">
                      <td className="p-4 text-white">{subscriber.email}</td>
                      <td className="p-4 text-white">
                        {new Date(subscriber.created_at).toLocaleDateString('en-KE')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Admin;