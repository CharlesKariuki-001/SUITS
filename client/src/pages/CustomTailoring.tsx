import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Scissors, Shirt, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';
import axios from 'axios';
import { useCart, CartItem } from '../context/CartContext';

interface CustomTailoringResponse {
  message: string;
  data: {
    id: number;
    name: string;
    phone: string;
    email: string;
    chest: number;
    waist: number;
    arm_length: number;
    shoulder: number;
    size: string;
    color: string;
    fit_style: string;
    bottom_style: string;
    fabric: string;
    lapels: string;
    is_womens_suit: boolean;
    additional_description?: string;
    image_url?: string;
  };
}

const CustomTailoring: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    chest: '',
    waist: '',
    armLength: '',
    shoulder: '',
    size: '',
    color: '',
    fitStyle: '',
    bottomStyle: undefined as 'trouser' | 'skirt' | undefined,
    fabric: 'Normal Quality Plain Fabric',
    lapels: 'Notch',
    additionalDescription: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [isWomensSuit, setIsWomensSuit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const fabricPrices: { [key: string]: number } = {
    'Normal Quality Plain Fabric': 12000,
    'Standard Quality Plain Fabric': 13000,
    'High Check Fabrics': 15000,
    'Super Wool Fabric': 25000,
  };

  const validateForm = () => {
    if (!form.name.trim()) return 'Name is required';
    if (!form.phone.trim()) return 'Phone number is required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Valid email is required';
    if (!form.chest || isNaN(Number(form.chest))) return 'Valid chest measurement is required';
    if (!form.waist || isNaN(Number(form.waist))) return 'Valid waist measurement is required';
    if (!form.armLength || isNaN(Number(form.armLength))) return 'Valid arm length is required';
    if (!form.shoulder || isNaN(Number(form.shoulder))) return 'Valid shoulder measurement is required';
    if (!form.size) return 'Size is required';
    if (!form.color.trim()) return 'Color is required';
    if (!form.fitStyle) return 'Fit style is required';
    if (isWomensSuit && !form.bottomStyle) return 'Bottom style is required for women’s suit';
    if (image && (image.size > 5 * 1024 * 1024 || !['image/jpeg', 'image/png'].includes(image.type))) {
      return 'Image must be JPEG/PNG and less than 5MB';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError('');
    setSuccess(false);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('phone', form.phone);
      formData.append('email', form.email);
      formData.append('chest', form.chest);
      formData.append('waist', form.waist);
      formData.append('arm_length', form.armLength);
      formData.append('shoulder', form.shoulder);
      formData.append('size', form.size);
      formData.append('color', form.color);
      formData.append('fit_style', form.fitStyle);
      formData.append('bottom_style', form.bottomStyle || 'trouser');
      formData.append('fabric', form.fabric);
      formData.append('lapels', form.lapels);
      formData.append('is_womens_suit', isWomensSuit ? '1' : '0');
      formData.append('additional_description', form.additionalDescription);
      if (image) formData.append('image', image);

      const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const response = await axios.post<CustomTailoringResponse>(
        `${apiUrl}/api/custom-tailoring`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      const responseData = response.data.data;

      if (!responseData || !('id' in responseData)) {
        throw new Error('Invalid response: Missing data or id');
      }

      const cartItem: CartItem = {
        id: responseData.id,
        name: 'Custom Tailored Suit',
        description: `Color: ${form.color}, Size: ${form.size}, Fit: ${form.fitStyle}, Fabric: ${form.fabric}, Lapels: ${form.lapels}${isWomensSuit ? `, Bottom: ${form.bottomStyle}` : ''}`,
        price: fabricPrices[form.fabric],
        itemType: 'custom',
        quantity: 1,
        fabric: form.fabric,
        customDescription: form.additionalDescription || undefined,
      };

      addToCart(cartItem);
      setForm({
        name: '',
        phone: '',
        email: '',
        chest: '',
        waist: '',
        armLength: '',
        shoulder: '',
        size: '',
        color: '',
        fitStyle: '',
        bottomStyle: undefined,
        fabric: 'Normal Quality Plain Fabric',
        lapels: 'Notch',
        additionalDescription: '',
      });
      setImage(null);
      setSuccess(true);
      navigate('/cart', { state: { selectedItem: cartItem } });
    } catch (err: any) {
      console.error('Error submitting measurements:', err);
      const errorMessage = err.response?.data?.errors
        ? Object.values(err.response.data.errors)
            .flat()
            .join(', ')
        : err.response?.data?.message || err.message || 'Failed to save measurements. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const suitVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  const fitScale = {
    Slim: 0.95,
    Regular: 1,
    Tailored: 0.98,
    Loose: 1.05,
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-[60vh] lg:h-[70vh] overflow-hidden"
      >
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/assets/images/CustomTailoring.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.6)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent z-10" />
        <div className="relative z-20 h-full flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4"
            >
              Craft Your Perfect Suit
              <br />
              <span className="text-yellow-500">Tailored Just for You</span>
            </motion.h1>
            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-200 mb-8 max-w-xl mx-auto"
            >
              Experience the luxury of bespoke tailoring with our expert craftsmen.
            </motion.p>
            <Button
              size="lg"
              onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
            >
              Start Designing <ChevronRight className="ml-2" size={16} />
            </Button>
          </div>
        </div>
      </motion.section>

      <section className="py-16 bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="max-w-xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">
                Submit Your Measurements
              </h2>
              <p className="text-gray-300 mb-8 text-center">
                Provide your details below, and watch your suit come to life!
              </p>
              {error && <p className="text-red-500 text-center mb-4">{error}</p>}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="e.g., John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="e.g., +254123456789"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="e.g., john@example.com"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Chest (cm)</label>
                    <input
                      type="number"
                      value={form.chest}
                      onChange={(e) => setForm({ ...form, chest: e.target.value })}
                      className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="e.g., 96"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Waist (cm)</label>
                    <input
                      type="number"
                      value={form.waist}
                      onChange={(e) => setForm({ ...form, waist: e.target.value })}
                      className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="e.g., 80"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Arm Length (cm)</label>
                    <input
                      type="number"
                      value={form.armLength}
                      onChange={(e) => setForm({ ...form, armLength: e.target.value })}
                      className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="e.g., 62"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Shoulder (cm)</label>
                    <input
                      type="number"
                      value={form.shoulder}
                      onChange={(e) => setForm({ ...form, shoulder: e.target.value })}
                      className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="e.g., 45"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Suit Type</label>
                  <select
                    value={isWomensSuit ? 'womens' : 'mens'}
                    onChange={(e) => setIsWomensSuit(e.target.value === 'womens')}
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="mens">Men's Suit</option>
                    <option value="womens">Women's Suit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Size</label>
                  <select
                    value={form.size}
                    onChange={(e) => setForm({ ...form, size: e.target.value })}
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                  >
                    <option value="">Select Size</option>
                    {isWomensSuit ? (
                      <>
                        <option value="XS">XS</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                      </>
                    ) : (
                      <>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                      </>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Color</label>
                  <input
                    type="text"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="e.g., Navy, Red"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Fit Style</label>
                  <select
                    value={form.fitStyle}
                    onChange={(e) => setForm({ ...form, fitStyle: e.target.value })}
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                  >
                    <option value="">Select Fit</option>
                    <option value="Slim">Slim</option>
                    <option value="Regular">Regular</option>
                    <option value="Tailored">Tailored</option>
                    <option value="Loose">Loose</option>
                  </select>
                </div>
                plantersuit && (
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Bottom Style</label>
                    <select
                      value={form.bottomStyle || ''}
                      onChange={(e) => setForm({ ...form, bottomStyle: e.target.value as 'trouser' | 'skirt' })}
                      className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      required
                    >
                      <option value="">Select Bottom Style</option>
                      <option value="trouser">Trouser</option>
                      <option value="skirt">Skirt</option>
                    </select>
                  </div>
                )
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Fabric</label>
                  <select
                    value={form.fabric}
                    onChange={(e) => setForm({ ...form, fabric: e.target.value })}
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="Normal Quality Plain Fabric">Normal Quality Plain Fabric</option>
                    <option value="Standard Quality Plain Fabric">Standard Quality Plain Fabric</option>
                    <option value="High Check Fabrics">High Check Fabrics</option>
                    <option value="Super Wool Fabric">Super Wool Fabric</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Lapels</label>
                  <select
                    value={form.lapels}
                    onChange={(e) => setForm({ ...form, lapels: e.target.value })}
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="Notch">Notch</option>
                    <option value="Peak">Peak</option>
                    <option value="Shawl">Shawl</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Additional Description (Optional)</label>
                  <textarea
                    value={form.additionalDescription}
                    onChange={(e) => setForm({ ...form, additionalDescription: e.target.value })}
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Describe any specific design details or preferences..."
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Reference Image (Optional, JPEG/PNG, max 5MB)</label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Save Measurements & Add to Cart'}
                </Button>
                <AnimatePresence>
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="text-center"
                    >
                      <p className="text-green-500">Measurements saved successfully!</p>
                      <Link to="/cart">
                        <Button size="lg" variant="outline">View Cart</Button>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
            <div className="flex justify-center items-center">
              <motion.div
                key={`${form.color}-${form.fitStyle}-${form.lapels}-${form.bottomStyle}`}
                variants={suitVariants}
                initial="initial"
                animate="animate"
                className="relative w-64 h-96"
                style={{
                  transform: `scale(${fitScale[form.fitStyle as keyof typeof fitScale] || 1})`,
                }}
              >
                <motion.div
                  className="absolute w-full h-48 rounded-t-lg"
                  style={{
                    backgroundColor: form.color || '#4B5EAA',
                    borderBottom: form.lapels === 'Notch' ? '10px solid #333' : form.lapels === 'Peak' ? '10px solid #555' : '10px solid #222',
                  }}
                />
                <motion.div
                  className="absolute top-48 w-full h-48"
                  style={{
                    backgroundColor: form.color || '#4B5EAA',
                    borderRadius: form.bottomStyle === 'skirt' ? '0 0 50% 50%' : '0',
                  }}
                />
                <motion.div
                  className="absolute inset-0 bg-yellow-500 opacity-10"
                  animate={{ opacity: [0.1, 0.3, 0.1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Why Choose Our Bespoke?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
  className="text-center"
>

              <Scissors className="text-yellow-500 mx-auto mb-4" size={40} />
              <h3 className="text-xl font-semibold text-white mb-2">Perfect Fit</h3>
              <p className="text-gray-300">
                Tailored to your exact measurements for unmatched comfort and style.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <Shirt className="text-yellow-500 mx-auto mb-4" size={40} />
              <h3 className="text-xl font-semibold text-white mb-2">Premium Fabrics</h3>
              <p className="text-gray-300">
                Choose from high-quality materials like normal quality plain, standard quality plain, high check, and super wool fabrics.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center"
            >
              <Calendar className="text-yellow-500 mx-auto mb-4" size={40} />
              <h3 className="text-xl font-semibold text-white mb-2">Easy Booking</h3>
              <p className="text-gray-300">
                Schedule a fitting at your convenience with our expert tailors.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-lg font-semibold text-white mb-2">
                How long does the tailoring process take?
              </h3>
              <p className="text-gray-300">
                Typically, it takes 2-3 weeks from measurement to delivery, depending on fabric and customization.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-white mb-2">
                Can I choose my own fabric?
              </h3>
              <p className="text-gray-300">
                Yes! Select from a range of premium fabrics like normal quality plain, standard quality plain, high check, or super wool.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold text-white mb-2">
                What if I’m not sure about my measurements?
              </h3>
              <p className="text-gray-300">
                Schedule an in-person or virtual fitting with our tailors for precise measurements.
              </p>
            </motion.div>
          </div>
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
            Ready to Look Your Best?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-300 mb-8 max-w-xl mx-auto"
          >
            Book a fitting today and let us create a suit that’s uniquely yours.
          </motion.p>
          <Link to="/contact">
            <Button size="lg">
              Book Your Fitting <ChevronRight className="ml-2" size={16} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default CustomTailoring;