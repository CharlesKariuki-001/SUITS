import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, X, Edit, Trash2, Save, Clock, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from '../components/SortableItem';
import Button from '../components/ui/Button';
import axios from 'axios';
import { z } from 'zod';
import { useCart } from '../context/CartContext';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  description: string;
  itemType: 'standard' | 'custom';
  imageUrls?: string[];
  customDescription?: string;
  fabric?: string;
}

interface OrderForm {
  name: string;
  email: string;
  phone: string;
}

interface TrackingForm {
  orderId: string;
  emailOrPhone: string;
}

interface OrderResponse {
  message: string;
  data: {
    orderId: number;
    status: string;
  };
}

interface TrackResponse {
  message: string;
  data: {
    orderId: number;
    status: 'Received' | 'In Progress' | 'Ready' | 'Delivered';
    items: { name: string; quantity: number }[];
    createdAt: string;
    estimatedDelivery: string;
  };
}

const orderFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  email: z.string().email('Invalid email address').max(255),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').regex(/^\+?[0-9]+$/, 'Invalid phone number').max(20),
});

const trackingFormSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  emailOrPhone: z.string().min(1, 'Email or phone is required'),
});

const Cart: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart: contextCart, updateCart, clearCart } = useCart();
  const selectedItem = location.state?.selectedItem as CartItem | undefined;
  const [cart, setCart] = useState<CartItem[]>([]);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [customDescription, setCustomDescription] = useState('');
  const [orderForm, setOrderForm] = useState<OrderForm>({ name: '', email: '', phone: '' });
  const [formErrors, setFormErrors] = useState<Partial<OrderForm>>({});
  const [trackingForm, setTrackingForm] = useState<TrackingForm>({ orderId: '', emailOrPhone: '' });
  const [trackingResult, setTrackingResult] = useState<TrackResponse['data'] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]') as CartItem[];
    setCart(savedCart);
    updateCart(savedCart);
    if (selectedItem) {
      const existingItemIndex = savedCart.findIndex(
        item => item.id === selectedItem.id && item.itemType === selectedItem.itemType
      );
      let updatedCart: CartItem[];
      if (existingItemIndex > -1) {
        updatedCart = savedCart.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updatedCart = [...savedCart, { ...selectedItem, quantity: 1, customDescription: '' }];
      }
      setCart(updatedCart);
      updateCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      toast.success(`${selectedItem.name} added to cart!`, { duration: 3000 });
    }
  }, [selectedItem, updateCart]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart(cart);
  }, [cart, updateCart]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setCart((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
      toast.success('Items reordered!', { duration: 2000 });
    }
  };

  const updateQuantity = useCallback((id: number, quantity: number) => {
    if (quantity < 1) return;
    setCart(prev => prev.map(item => (item.id === id ? { ...item, quantity } : item)));
    toast.success('Quantity updated!', { duration: 2000 });
  }, []);

  const removeItem = useCallback((id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
    setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    toast.success('Item removed', { duration: 2000 });
  }, []);

  const saveCustomDescription = useCallback((id: number, description: string) => {
    setCart(prev => prev.map(item => (item.id === id ? { ...item, customDescription: description } : item)));
    setEditingItemId(null);
    setCustomDescription('');
    toast.success('Customization saved!', { duration: 2000 });
  }, []);

  const toggleItemSelection = useCallback((id: number) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  }, []);

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    try {
      const validated = orderFormSchema.parse(orderForm);
      const itemsToOrder = selectedItems.length > 0 ? cart.filter(item => selectedItems.includes(item.id)) : cart;
      if (itemsToOrder.length === 0) {
        toast.error('Select at least one item to order', { duration: 3000 });
        return;
      }

      setIsSubmitting(true);
      const response = await axios.post<OrderResponse>('http://127.0.0.1:8000/api/orders', {
        user_name: validated.name,
        user_email: validated.email,
        user_phone: validated.phone,
        items: itemsToOrder.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          description: item.description,
          itemType: item.itemType,
          customDescription: item.customDescription,
          fabric: item.fabric,
        })),
        total: itemsToOrder.reduce((sum, item) => sum + item.price * item.quantity, 0),
      }, { timeout: 10000 });

      const orderId = response.data.data.orderId;
      toast.success(`Order #${orderId} placed! We'll contact you soon.`, { duration: 5000 });

      const remainingCart = cart.filter(item => !itemsToOrder.includes(item));
      setCart(remainingCart);
      setSelectedItems([]);
      setOrderForm({ name: '', email: '', phone: '' });
      localStorage.setItem('cart', JSON.stringify(remainingCart));
      clearCart();

      navigate('/order-confirmation', { state: { orderId } });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        const errors = err.errors.reduce((acc, e) => ({ ...acc, [e.path[0]]: e.message }), {});
        setFormErrors(errors);
      } else {
        toast.error(err.response?.data?.message || 'Failed to place order', { duration: 4000 });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveCartForLater = async () => {
    try {
      const email = prompt('Enter your email to save your cart:');
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        toast.error('Please enter a valid email', { duration: 3000 });
        return;
      }
      toast.success(`Cart saved! Check ${email} for a link.`, { duration: 4000 });
    } catch {
      toast.error('Failed to save cart', { duration: 3000 });
    }
  };

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTracking(true);
    try {
      const validated = trackingFormSchema.parse(trackingForm);
      const response = await axios.get<TrackResponse>('http://127.0.0.1:8000/api/orders/track', {
        params: { orderId: validated.orderId, emailOrPhone: validated.emailOrPhone },
        timeout: 10000,
      });
      setTrackingResult(response.data.data);
      toast.success('Order found!', { duration: 3000 });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Order not found', { duration: 4000 });
    } finally {
      setIsTracking(false);
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail)) {
      toast.error('Please enter a valid email', { duration: 3000 });
      return;
    }
    try {
      await axios.post('http://127.0.0.1:8000/api/subscribers', { email: newsletterEmail }, { timeout: 5000 });
      toast.success('Subscribed to our newsletter!', { duration: 4000 });
      setNewsletterEmail('');
    } catch {
      toast.error('Failed to subscribe', { duration: 3000 });
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const formattedTotal = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(total);

  const getEstimatedDelivery = useCallback((fabric?: string) => {
    const baseDays = 14;
    const fabricDays: { [key: string]: number } = {
      'Normal Quality Plain Fabric': 0,
      'Standard Quality Plain Fabric': 2,
      'High Check Fabrics': 4,
      'Super Wool Fabric': 7,
    };
    const totalDays = baseDays + (fabric ? fabricDays[fabric] || 0 : 0);
    const date = new Date();
    date.setDate(date.getDate() + totalDays);
    return date.toLocaleDateString('en-KE', { month: 'long', day: 'numeric', year: 'numeric' });
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen">
      <Toaster position="top-right" toastOptions={{ className: 'bg-gray-800 text-white border border-yellow-500' }} />
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-[40vh] overflow-hidden"
      >
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/assets/images/HomeHero.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.6)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent z-10" />
        <div className="relative z-20 h-full flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h1
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4"
            >
              Your Bespoke Cart
              <br />
              <span className="text-yellow-500">Crafted for You</span>
            </motion.h1>
            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg sm:text-xl text-gray-200 max-w-xl"
            >
              Review, customize, and order your perfect suit.
            </motion.p>
          </div>
        </div>
      </motion.section>
      <section className="py-16 bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {cart.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h2 className="text-2xl font-semibold text-white mb-4">Your Cart is Empty</h2>
              <p className="text-gray-300 mb-8">Discover our collections or design a custom suit.</p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/mens">
                  <Button size="lg">Men’s Suits</Button>
                </Link>
                <Link to="/womens">
                  <Button size="lg" variant="outline">Women’s Suits</Button>
                </Link>
                <Link to="/custom-tailoring">
                  <Button size="lg" variant="outline">Custom Design</Button>
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Your Items ({cart.length})</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCart([]);
                      setSelectedItems([]);
                      localStorage.setItem('cart', '[]');
                      clearCart();
                      toast.success('Cart cleared', { duration: 2000 });
                    }}
                  >
                    Clear Cart
                  </Button>
                </div>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={cart.map(item => item.id)} strategy={verticalListSortingStrategy}>
                    <AnimatePresence>
                      {cart.map(item => (
                        <SortableItem key={item.id} id={item.id}>
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-gray-800 p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 hover:bg-gray-700 transition-colors"
                            role="listitem"
                            aria-label={`Cart item: ${item.name}`}
                          >
                            <div className="flex items-center space-x-4 w-full">
                              <input
                                type="checkbox"
                                checked={selectedItems.includes(item.id)}
                                onChange={() => toggleItemSelection(item.id)}
                                className="h-5 w-5 text-yellow-500 rounded focus:ring-yellow-500"
                                aria-label={`Select ${item.name}`}
                              />
                              {item.imageUrls?.[0] ? (
                                <img
                                  src={item.imageUrls[0]}
                                  alt={item.name}
                                  className="w-16 h-16 object-cover rounded"
                                  loading="lazy"
                                />
                              ) : (
                                <div
                                  className="w-16 h-16 rounded"
                                  style={{
                                    backgroundColor: item.description.includes('Color:')
                                      ? item.description.split('Color: ')[1].split(',')[0]
                                      : '#4B5EAA',
                                  }}
                                  aria-hidden="true"
                                />
                              )}
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                                <p className="text-gray-400 text-sm">{item.description}</p>
                                {item.customDescription && (
                                  <p className="text-gray-300 text-sm mt-1">Custom: {item.customDescription}</p>
                                )}
                                {item.fabric && (
                                  <p className="text-gray-300 text-sm mt-1">
                                    <Clock className="inline mr-1 h-4 w-4" />
                                    Delivery by {getEstimatedDelivery(item.fabric)}
                                  </p>
                                )}
                                <p className="text-yellow-500 font-medium mt-1">
                                  {new Intl.NumberFormat('en-KE', {
                                    style: 'currency',
                                    currency: 'KES',
                                    minimumFractionDigits: 0,
                                  }).format(item.price * item.quantity)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                              <div className="flex items-center border border-gray-600 rounded">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  className="px-2 py-1 text-white disabled:opacity-50 hover:bg-gray-600"
                                  aria-label={`Decrease quantity of ${item.name}`}
                                >
                                  -
                                </button>
                                <span className="px-3 py-1 text-white">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="px-2 py-1 text-white hover:bg-gray-600"
                                  aria-label={`Increase quantity of ${item.name}`}
                                >
                                  +
                                </button>
                              </div>
                              <button
                                onClick={() => {
                                  setEditingItemId(item.id);
                                  setCustomDescription(item.customDescription || '');
                                }}
                                className="text-yellow-500 hover:text-yellow-400"
                                aria-label={`Edit ${item.name}`}
                              >
                                <Edit size={20} />
                              </button>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-red-500 hover:text-red-400"
                                aria-label={`Remove ${item.name}`}
                              >
                                <Trash2 size={20} />
                              </button>
                            </div>
                          </motion.div>
                        </SortableItem>
                      ))}
                    </AnimatePresence>
                  </SortableContext>
                </DndContext>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-6">
                  <Button
                    variant="outline"
                    onClick={saveCartForLater}
                    aria-label="Save cart for later"
                  >
                    Save Cart for Later
                    <Save className="ml-2" size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedItems(cart.map(item => item.id))}
                    aria-label="Select all items"
                  >
                    Select All
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedItems([])}
                    aria-label="Deselect all items"
                  >
                    Deselect All
                  </Button>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Place Your Order</h2>
                <div className="bg-gray-800 p-6 rounded-lg">
                  <div className="flex justify-between mb-4">
                    <span className="text-gray-300">Total ({cart.length} items)</span>
                    <span className="text-yellow-500 font-semibold">{formattedTotal}</span>
                  </div>
                  <form onSubmit={handleOrderSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-1" htmlFor="name">Name</label>
                      <input
                        id="name"
                        type="text"
                        value={orderForm.name}
                        onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        placeholder="e.g., John Doe"
                        aria-invalid={!!formErrors.name}
                        aria-describedby={formErrors.name ? 'name-error' : undefined}
                      />
                      {formErrors.name && (
                        <p id="name-error" className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-1" htmlFor="email">Email</label>
                      <input
                        id="email"
                        type="email"
                        value={orderForm.email}
                        onChange={(e) => setOrderForm({ ...orderForm, email: e.target.value })}
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        placeholder="e.g., john@example.com"
                        aria-invalid={!!formErrors.email}
                        aria-describedby={formErrors.email ? 'email-error' : undefined}
                      />
                      {formErrors.email && (
                        <p id="email-error" className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-1" htmlFor="phone">Phone</label>
                      <input
                        id="phone"
                        type="tel"
                        value={orderForm.phone}
                        onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        placeholder="e.g., +254123456789"
                        aria-invalid={!!formErrors.phone}
                        aria-describedby={formErrors.phone ? 'phone-error' : undefined}
                      />
                      {formErrors.phone && (
                        <p id="phone-error" className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-1" htmlFor="promo">Promo Code (Optional)</label>
                      <input
                        id="promo"
                        type="text"
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        placeholder="Enter promo code"
                        disabled
                        aria-disabled="true"
                      />
                      <p className="text-gray-400 text-sm mt-1">Promo codes coming soon!</p>
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={isSubmitting}
                      aria-label={selectedItems.length > 0 ? 'Order selected items' : 'Order all items'}
                    >
                      {isSubmitting
                        ? 'Placing Order...'
                        : selectedItems.length > 0
                        ? `Order ${selectedItems.length} Item${selectedItems.length > 1 ? 's' : ''}`
                        : 'Order All Items'}
                      <ChevronRight className="ml-2" size={16} />
                    </Button>
                  </form>
                  <p className="text-gray-400 text-sm mt-4">
                    <Mail className="inline mr-1 h-4 w-4" />
                    We’ll contact you to confirm details and arrange payment (in-office or cash on delivery).
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Track Your Order</h2>
          <p className="text-gray-300 mb-8 text-center max-w-xl mx-auto">
            Check the status of your bespoke suit with your order ID and email or phone number.
          </p>
          <form
            onSubmit={handleTrackOrder}
            className="max-w-md mx-auto space-y-4"
            aria-label="Track order form"
          >
            <div>
              <label className="block text-sm text-gray-300 mb-1" htmlFor="orderId">Order ID</label>
              <input
                id="orderId"
                type="text"
                value={trackingForm.orderId}
                onChange={(e) => setTrackingForm({ ...trackingForm, orderId: e.target.value })}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="e.g., 12345"
                aria-required="true"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1" htmlFor="emailOrPhone">Email or Phone</label>
              <input
                id="emailOrPhone"
                type="text"
                value={trackingForm.emailOrPhone}
                onChange={(e) => setTrackingForm({ ...trackingForm, emailOrPhone: e.target.value })}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="e.g., john@example.com or +254123456789"
                aria-required="true"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isTracking}
              aria-label="Track order"
            >
              {isTracking ? 'Tracking...' : 'Track Order'}
            </Button>
          </form>
          <AnimatePresence>
            {trackingResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
                className="mt-8 bg-gray-800 p-6 rounded-lg max-w-md mx-auto"
                role="region"
                aria-label="Order tracking result"
              >
                <h3 className="text-xl font-semibold text-white mb-4">Order #{trackingResult.orderId}</h3>
                <p className="text-gray-300 mb-2">
                  <span className="font-medium">Status:</span>{' '}
                  <span
                    className={`inline-block px-2 py-1 rounded text-sm ${
                      trackingResult.status === 'Delivered' ? 'bg-green-500' : 'bg-yellow-500'
                    } text-white`}
                  >
                    {trackingResult.status}
                  </span>
                </p>
                <p className="text-gray-300 mb-2">
                  <span className="font-medium">Ordered:</span>{' '}
                  {new Date(trackingResult.createdAt).toLocaleDateString('en-KE')}
                </p>
                {trackingResult.estimatedDelivery && (
                  <p className="text-gray-300 mb-2">
                    <span className="font-medium">Estimated Delivery:</span> {trackingResult.estimatedDelivery}
                  </p>
                )}
                <p className="text-gray-300 mb-2">
                  <span className="font-medium">Items:</span>
                </p>
                <ul className="text-gray-300 text-sm">
                  {trackingResult.items.map((item, index) => (
                    <li key={index}>
                      - {item.name} (x{item.quantity})
                    </li>
                  ))}
                </ul>
                <div className="mt-4">
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-yellow-500 h-2.5 rounded-full transition-all duration-500"
                      style={{
                        width: {
                          Received: '25%',
                          'In Progress': '50%',
                          Ready: '75%',
                          Delivered: '100%',
                        }[trackingResult.status],
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>Received</span>
                    <span>In Progress</span>
                    <span>Ready</span>
                    <span>Delivered</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
      <section className="py-16 bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Join Our Style Community</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Subscribe for exclusive offers, tailoring tips, and new collection updates.
          </p>
          <form
            onSubmit={handleNewsletterSubmit}
            className="max-w-md mx-auto flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
            aria-label="Newsletter subscription form"
          >
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="flex-1 bg-gray-700 text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Enter your email"
              aria-label="Email for newsletter"
              aria-required="true"
            />
            <Button type="submit" size="lg" aria-label="Subscribe to newsletter">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-white mb-4"
          >
            Elevate Your Style
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-300 mb-8 max-w-xl mx-auto"
          >
            Design another suit or contact us to finalize your order.
          </motion.p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/custom-tailoring">
              <Button size="lg">Design Custom Suit</Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline">
                Contact Us <ChevronRight className="ml-2" size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <AnimatePresence>
        {editingItemId !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            role="dialog"
            aria-modal="true"
            aria-label="Customize item"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800 p-6 rounded-lg max-w-md w-full"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">
                  Customize {cart.find(item => item.id === editingItemId)?.name}
                </h3>
                <button
                  onClick={() => setEditingItemId(null)}
                  className="text-gray-400 hover:text-white"
                  aria-label="Close customization modal"
                >
                  <X size={24} />
                </button>
              </div>
              <textarea
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                placeholder="Describe your customizations (e.g., specific fit, color adjustments, trouser/skirt)"
                className="w-full p-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                rows={4}
                aria-label="Customization details"
              />
              <Button
                className="mt-4 w-full"
                onClick={() => saveCustomDescription(editingItemId, customDescription)}
                aria-label="Save customization"
              >
                Save Customization
                <Save className="ml-2" size={16} />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cart;