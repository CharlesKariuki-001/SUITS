import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from '../components/SortableItem';
import Button from '../components/ui/Button';
import axios from 'axios';
import { z } from 'zod';
import { useCart, CartItem } from '../context/CartContext';
import CartItemComponent from '../components/cart/CartItem';

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
  const { cart, updateCart, clearCart } = useCart();
  const selectedItem = location.state?.selectedItem as CartItem | undefined;
  const [localCart, setLocalCart] = useState<CartItem[]>(cart);
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
  const [processedItemIds, setProcessedItemIds] = useState<Set<number>>(new Set());

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

  useEffect(() => {
    setLocalCart(cart);
    if (selectedItem && !processedItemIds.has(selectedItem.id)) {
      const existingItemIndex = cart.findIndex(
        item => item.id === selectedItem.id && item.itemType === selectedItem.itemType
      );
      let updatedCart: CartItem[];
      if (existingItemIndex > -1) {
        updatedCart = cart.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updatedCart = [...cart, { ...selectedItem, quantity: 1 }];
      }
      setLocalCart(updatedCart);
      updateCart(updatedCart);
      setProcessedItemIds(prev => new Set(prev).add(selectedItem.id));
      toast.success(`${selectedItem.name} added to cart!`, { duration: 3000 });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [selectedItem, cart, updateCart, navigate, location.pathname, processedItemIds]);

  useEffect(() => {
    updateCart(localCart);
  }, [localCart, updateCart]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setLocalCart((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
      toast.success('Items reordered!', { duration: 2000 });
    }
  };

  const updateQuantity = useCallback((id: number, quantity: number) => {
    if (quantity < 1) return;
    setLocalCart(prev => prev.map(item => (item.id === id ? { ...item, quantity } : item)));
  }, []);

  const removeItem = useCallback((id: number) => {
    setLocalCart(prev => prev.filter(item => item.id !== id));
    setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    toast.success('Item removed', { duration: 2000 });
  }, []);

  const saveCustomDescription = useCallback((id: number, description: string) => {
    setLocalCart(prev => prev.map(item => (item.id === id ? { ...item, customDescription: description } : item)));
    setEditingItemId(null);
    setCustomDescription('');
    toast.success('Customization saved!', { duration: 2000 });
  }, []);

  const toggleItemSelection = useCallback((id: number) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  }, []);

  const handleOrderSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormErrors({});
    try {
      const validated = orderFormSchema.parse(orderForm);
      const itemsToOrder = selectedItems.length > 0 ? localCart.filter(item => selectedItems.includes(item.id)) : localCart;
      if (itemsToOrder.length === 0) {
        toast.error('Select at least one item to order', { duration: 3000 });
        return;
      }

      setIsSubmitting(true);
      const response = await axios.post<OrderResponse>(`${API_BASE_URL}/orders`, {
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

      const remainingCart = localCart.filter(item => !itemsToOrder.includes(item));
      setLocalCart(remainingCart);
      updateCart(remainingCart);
      setSelectedItems([]);
      setOrderForm({ name: '', email: '', phone: '' });
      setProcessedItemIds(new Set());
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.flatten().fieldErrors;
        setFormErrors({
          name: errors.name?.[0],
          email: errors.email?.[0],
          phone: errors.phone?.[0],
        });
      } else {
        console.error('Order submission error:', error);
        toast.error('Failed to place order. Please try again.', { duration: 3000 });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrackOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      trackingFormSchema.parse(trackingForm);
      setIsTracking(true);
      const response = await axios.get<TrackResponse>(
        `${API_BASE_URL}/orders/track`,
        {
          params: {
            order_id: trackingForm.orderId,
            email_or_phone: trackingForm.emailOrPhone,
          },
          timeout: 10000,
        }
      );
      setTrackingResult(response.data.data);
      toast.success('Order details retrieved!', { duration: 3000 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error('Invalid input. Please check your order ID and email/phone.', { duration: 3000 });
      } else {
        console.error('Tracking error:', error);
        toast.error('Failed to track order. Please verify your details.', { duration: 3000 });
      }
    } finally {
      setIsTracking(false);
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newsletterEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail)) {
      toast.error('Please enter a valid email address', { duration: 3000 });
      return;
    }
    try {
      await axios.post(`${API_BASE_URL}/newsletter`, { email: newsletterEmail }, { timeout: 5000 });
      toast.success('Subscribed to newsletter!', { duration: 3000 });
      setNewsletterEmail('');
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast.error('Failed to subscribe. Please try again.', { duration: 3000 });
    }
  };

  const totalPrice = localCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const formattedTotal = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(totalPrice);

  return (
    <div className="bg-gray-900 min-h-screen">
      <Toaster position="top-right" />
      <section className="py-16 bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
            Your Cart
          </h1>
          {localCart.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-400 mb-8">Your cart is empty.</p>
              <Link to="/mens-suits">
                <Button size="lg">Shop Men’s Suits</Button>
              </Link>
              <Link to="/womens-suits" className="ml-4">
                <Button size="lg" variant="outline">Shop Women’s Suits</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={localCart.map(item => item.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {localCart.map(item => (
                      <SortableItem key={item.id} id={item.id}>
                        <div className="flex items-center space-x-4 mb-2">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={() => toggleItemSelection(item.id)}
                            className="w-5 h-5 text-yellow-500 bg-gray-700 border-gray-600 rounded focus:ring-yellow-500"
                          />
                          <CartItemComponent
                            item={item}
                            updateQuantity={updateQuantity}
                            removeItem={removeItem}
                          />
                        </div>
                        {editingItemId === item.id ? (
                          <div className="mt-2 flex items-center space-x-2">
                            <input
                              type="text"
                              value={customDescription}
                              onChange={(e) => setCustomDescription(e.target.value)}
                              className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                              placeholder="Enter custom description"
                            />
                            <Button
                              size="sm"
                              onClick={() => saveCustomDescription(item.id, customDescription)}
                            >
                              <Save size={16} />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingItemId(null);
                                setCustomDescription('');
                              }}
                            >
                              <X size={16} />
                            </Button>
                          </div>
                        ) : (
                          item.customDescription && (
                            <p className="text-gray-400 text-sm mt-2">
                              Custom: {item.customDescription}
                            </p>
                          )
                        )}
                      </SortableItem>
                    ))}
                  </SortableContext>
                </DndContext>
                <div className="mt-8 flex justify-between">
                  <Button
                    variant="danger"
                    onClick={() => {
                      clearCart();
                      setLocalCart([]);
                      setSelectedItems([]);
                      toast.success('Cart cleared', { duration: 2000 });
                    }}
                  >
                    Clear Cart
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedItems(localCart.map(item => item.id))}
                  >
                    Select All
                  </Button>
                </div>
              </div>
              <div className="lg:col-span-1">
                <div className="bg-gray-800 p-6 rounded-lg sticky top-4">
                  <h2 className="text-xl font-semibold text-white mb-4">
                    Order Summary
                  </h2>
                  <div className="flex justify-between text-gray-300 mb-2">
                    <span>Subtotal</span>
                    <span>{formattedTotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-300 mb-4">
                    <span>Shipping</span>
                    <span>TBD</span>
                  </div>
                  <div className="flex justify-between text-white font-semibold text-lg">
                    <span>Total</span>
                    <span>{formattedTotal}</span>
                  </div>
                  <form onSubmit={handleOrderSubmit} className="mt-6 space-y-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Name</label>
                      <input
                        type="text"
                        value={orderForm.name}
                        onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        placeholder="John Doe"
                      />
                      {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Email</label>
                      <input
                        type="email"
                        value={orderForm.email}
                        onChange={(e) => setOrderForm({ ...orderForm, email: e.target.value })}
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        placeholder="john@example.com"
                      />
                      {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={orderForm.phone}
                        onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        placeholder="+254123456789"
                      />
                      {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={isSubmitting || localCart.length === 0}
                    >
                      {isSubmitting ? 'Placing Order...' : 'Place Order'}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-6">Track Your Order</h2>
          <form onSubmit={handleTrackOrder} className="max-w-md space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Order ID</label>
              <input
                type="text"
                value={trackingForm.orderId}
                onChange={(e) => setTrackingForm({ ...trackingForm, orderId: e.target.value })}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="12345"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Email or Phone</label>
              <input
                type="text"
                value={trackingForm.emailOrPhone}
                onChange={(e) => setTrackingForm({ ...trackingForm, emailOrPhone: e.target.value })}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="john@example.com or +254123456789"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={isTracking}
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
                className="mt-8 bg-gray-800 p-6 rounded-lg"
              >
                <h3 className="text-lg font-semibold text-white mb-4">
                  Order #{trackingResult.orderId}
                </h3>
                <p className="text-gray-300 mb-2">
                  <span className="font-medium">Status:</span> {trackingResult.status}
                </p>
                <p className="text-gray-300 mb-2">
                  <span className="font-medium">Ordered:</span>{' '}
                  {new Date(trackingResult.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-300 mb-4">
                  <span className="font-medium">Estimated Delivery:</span>{' '}
                  {new Date(trackingResult.estimatedDelivery).toLocaleDateString()}
                </p>
                <h4 className="text-md font-semibold text-white mb-2">Items:</h4>
                <ul className="list-disc list-inside text-gray-300">
                  {trackingResult.items.map((item, index) => (
                    <li key={index}>
                      {item.name} x{item.quantity}
                    </li>
                  ))}
                </ul>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => setTrackingResult(null)}
                >
                  Close
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <section className="py-16 bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Stay Updated with Our Newsletter
          </h2>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Subscribe to receive the latest updates on new collections and exclusive offers.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex max-w-md mx-auto">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="flex-1 bg-gray-700 text-white border border-gray-600 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Enter your email"
            />
            <Button type="submit" className="rounded-l-none">
              Subscribe
            </Button>
          </form>
        </div>
      </section>

      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Need a Custom Suit?
          </h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Design a suit tailored to your exact measurements and style preferences.
          </p>
          <Link to="/custom-tailoring">
            <Button size="lg">
              Design Your Suit <ChevronRight className="ml-2" size={16} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Cart;