import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Ruler, Users, Package } from 'lucide-react';
import Button from '../components/ui/Button';

// Placeholder image for missing images
const placeholderImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

interface Product {
  id: string;
  name: string;
  imageUrls: string[];
}

const HomePage: React.FC = () => {
  const [featuredMensProducts, setFeaturedMensProducts] = useState<Product[]>([]);
  const [featuredWomensProducts, setFeaturedWomensProducts] = useState<Product[]>([]);
  const [email, setEmail] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hardcodedMensProducts: Product[] = [
    { id: 'featured-men-1', name: 'Light grey pinstripe suit, tailored fit, classic-modern fusion — for men', imageUrls: ['/assets/images/FeaturedMen1.jpeg'] },
    { id: 'featured-men-2', name: 'Modern Charcoal Suit for Men', imageUrls: ['/assets/images/FeaturedMen2.jpeg'] },
    { id: 'featured-men-3', name: 'Navy blue pinstripe suit, sharp fit, bold and elegant — for men', imageUrls: ['/assets/images/FeaturedMen3.jpeg'] },
  ];

  const hardcodedWomensProducts: Product[] = [
    { id: 'featured-women-1', name: 'Navy checkered skirt suit, structured design, wool-like texture — for women.', imageUrls: ['/assets/images/FeaturedWomen1.jpeg'] },
    { id: 'featured-women-2', name: 'Charcoal grey striped suit, professional cut, smooth polyester blend — for women.', imageUrls: ['/assets/images/FeaturedWomen2.jpeg'] },
    { id: 'featured-women-3', name: 'Beige tailored suit, elegant formal design, soft wool-blend fabric — for women.', imageUrls: ['/assets/images/FeaturedWomen3.jpeg'] },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = { data: { data: [...hardcodedMensProducts, ...hardcodedWomensProducts] } };
        const transformedProducts = response.data.data.map(product => ({
          ...product,
          imageUrls: product.imageUrls.length > 0 ? product.imageUrls : [placeholderImage],
        }));

        const mensProducts = transformedProducts.filter(p => /men/i.test(p.name));
        const womensProducts = transformedProducts.filter(p => /women/i.test(p.name));

        setFeaturedMensProducts(mensProducts.slice(0, 3));
        setFeaturedWomensProducts(womensProducts.slice(0, 3));
      } catch (error) {
        console.error('Error fetching products:', error);
        setFeaturedMensProducts(hardcodedMensProducts);
        setFeaturedWomensProducts(hardcodedWomensProducts);
      }
    };

    fetchProducts();
  }, []);

  const isValidEmailFormat = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmailFormat(email)) {
      setPopupMessage('Please enter a valid email address (e.g., example@domain.com).');
      setShowPopup(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to subscribe');
      }
      setPopupMessage(data.message);
    } catch (error: any) {
      setPopupMessage(error.message || 'An error occurred while subscribing. Please try again.');
    } finally {
      setShowPopup(true);
      setEmail('');
      setIsSubmitting(false);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = placeholderImage;
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[85vh] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/images/HomeHero.jpeg"
            alt="Hero Background"
            className="h-full w-full object-cover"
            style={{ filter: 'brightness(0.6)' }}
            onError={handleImageError}
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent z-10" />
        <div className="relative z-20 h-full flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
                <span className="text-yellow-500">Don's Custom Clothiers</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-md">
                Handcrafted suits designed for the perfect fit. Experience the luxury of Kenyan craftsmanship.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/mens">
                  <Button size="lg">Shop Men's Collection</Button>
                </Link>
                <Link to="/womens">
                  <Button size="lg" variant="outline">Shop Women's Collection</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Our Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link to="/mens" className="group relative overflow-hidden rounded-lg h-[350px]">
              <div className="absolute inset-0 z-0">
                <img
                  src="/assets/images/Men.jpeg"
                  alt="Men's Collection"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={handleImageError}
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
              <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                <h3 className="text-2xl font-bold text-white mb-2">Men's Collection</h3>
                <p className="text-gray-300 mb-4">Timeless suits for the modern gentleman</p>
                <div className="flex items-center text-yellow-500 font-medium">
                  <span>Shop Now</span>
                  <ChevronRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
            <Link to="/womens" className="group relative overflow-hidden rounded-lg h-[350px]">
              <div className="absolute inset-0 z-0">
                <img
                  src="/assets/images/Women.jpeg"
                  alt="Women's Collection"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={handleImageError}
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
              <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                <h3 className="text-2xl font-bold text-white mb-2">Women's Collection</h3>
                <p className="text-gray-300 mb-4">Bold and elegant suits for the modern woman</p>
                <div className="flex items-center text-yellow-500 font-medium">
                  <span>Shop Now</span>
                  <ChevronRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-4">Featured Products</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Discover our collection of premium suits crafted with the finest materials and exceptional attention to detail.
          </p>

          {/* Men's Favorites */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Men's Favorites</h3>
              <Link to="/mens" className="text-yellow-500 hover:text-yellow-400 flex items-center">
                <span>View All</span>
                <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredMensProducts.map(product => (
                <div key={product.id} className="relative group overflow-hidden rounded-lg">
                  <img
                    src={product.imageUrls[0] || placeholderImage}
                    alt={product.name}
                    className="w-full h-64 object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    onError={handleImageError}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h4 className="text-white font-semibold">{product.name}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Women's Favorites */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Women's Favorites</h3>
              <Link to="/womens" className="text-yellow-500 hover:text-yellow-400 flex items-center">
                <span>View All</span>
                <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredWomensProducts.map(product => (
                <div key={product.id} className="relative group overflow-hidden rounded-lg">
                  <img
                    src={product.imageUrls[0] || placeholderImage}
                    alt={product.name}
                    className="w-full h-64 object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    onError={handleImageError}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h4 className="text-white font-semibold">{product.name}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Custom Tailoring Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-8 lg:mb-0 lg:pr-12">
              <h2 className="text-3xl font-bold text-white mb-4">Custom Tailored For You</h2>
              <p className="text-gray-300 mb-6">
                Experience the ultimate in personalized luxury with our bespoke tailoring service. We create suits that perfectly match your style and physique, ensuring an impeccable fit and exceptional comfort.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Ruler className="text-yellow-500 mt-1 mr-3" size={20} />
                  <div>
                    <h3 className="font-medium text-white">Perfect Measurements</h3>
                    <p className="text-gray-400 text-sm">Each suit is crafted to your exact measurements for the perfect fit.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Package className="text-yellow-500 mt-1 mr-3" size={20} />
                  <div>
                    <h3 className="font-medium text-white">Premium Materials</h3>
                    <p className="text-gray-400 text-sm">Choose from a wide range of high-quality fabrics and materials.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Users className="text-yellow-500 mt-1 mr-3" size={20} />
                  <div>
                    <h3 className="font-medium text-white">Expert Craftsmanship</h3>
                    <p className="text-gray-400 text-sm">Our skilled tailors bring decades of experience to every garment.</p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <Link to="/contact">
                  <Button>Schedule a Fitting</Button>
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="relative rounded-lg overflow-hidden shadow-2xl">
                <img
                  src="/assets/images/CustomTailor.jpeg"
                  alt="Custom Tailoring"
                  className="w-full h-auto"
                  onError={handleImageError}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <p className="text-yellow-500 font-semibold">BESPOKE SERVICE</p>
                  <h3 className="text-white text-xl font-bold">Tailored to Perfection</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="h-px flex-1 bg-yellow-500/50"></div>
                <div className="mx-2">
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </div>
                <div className="h-px flex-1 bg-yellow-500/50"></div>
              </div>
              <p className="text-gray-300 italic mb-6">"The quality and fit of my suit exceeded all expectations. I've never had a suit that fits so perfectly. The attention to detail is remarkable."</p>
              <div className="flex items-center">
                <img src="https://via.placeholder.com/40?text=DK" alt="David Kimani" className="h-10 w-10 rounded-full object-cover" />
                <div className="ml-3">
                  <h4 className="text-white font-medium">David Kimani</h4>
                  <p className="text-gray-400 text-sm">Nairobi, Kenya</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="h-px flex-1 bg-yellow-500/50"></div>
                <div className="mx-2">
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </div>
                <div className="h-px flex-1 bg-yellow-500/50"></div>
              </div>
              <p className="text-gray-300 italic mb-6">"As a woman in business, finding the perfect suit has always been a challenge. Kenya Bespoke delivered a suit that makes me feel powerful and confident."</p>
              <div className="flex items-center">
                <img src="https://via.placeholder.com/40?text=SO" alt="Sarah Odhiambo" className="h-10 w-10 rounded-full object-cover" />
                <div className="ml-3">
                  <h4 className="text-white font-medium">Sarah Odhiambo</h4>
                  <p className="text-gray-400 text-sm">Mombasa, Kenya</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="h-px flex-1 bg-yellow-500/50"></div>
                <div className="mx-2">
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </div>
                <div className="h-px flex-1 bg-yellow-500/50"></div>
              </div>
              <p className="text-gray-300 italic mb-6">"The custom tailoring experience was exceptional. The team took their time to understand exactly what I wanted, and the final result was beyond impressive."</p>
              <div className="flex items-center">
                <img src="https://via.placeholder.com/40?text=MN" alt="Michael Njoroge" className="h-10 w-10 rounded-full object-cover" />
                <div className="ml-3">
                  <h4 className="text-white font-medium">Michael Njoroge</h4>
                  <p className="text-gray-400 text-sm">Nakuru, Kenya</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="bg-gray-800 rounded-xl p-8 md:p-12 shadow-lg border border-gray-700">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-3">Subscribe to Our Newsletter</h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Stay updated with our latest collections, exclusive offers, and style tips.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 bg-gray-700 border border-gray-600 rounded-md px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
            <p className="text-gray-400 text-sm mt-4 text-center">We respect your privacy. Unsubscribe at any time.</p>
          </div>
        </div>
      </section>

      {/* Popup for Subscription Status */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-4">Subscription Status</h3>
              <p className="text-gray-300 mb-6">{popupMessage}</p>
              <Button onClick={() => setShowPopup(false)} size="sm">Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;