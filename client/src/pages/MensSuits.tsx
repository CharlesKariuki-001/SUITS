import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../components/ui/Button';

// Placeholder image for missing images
const placeholderImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  sizes: string[];
  colors: string[];
  imageUrls: string[];
  description: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrls: string[];
  description: string;
  itemType: 'standard' | 'custom';
  customDescription?: string;
  fabric?: string;
}

const MensSuits: React.FC = () => {
  const navigate = useNavigate();
  const [imageIndices, setImageIndices] = useState({
    normalPlain: 0,
    standardPlain: 0,
    highCheck: 0,
    superWool: 0,
  });

  // If images are in src/assets/images/, import them like this:
  /*
  import normalPlain1 from '../assets/images/MensSuitNormalPlain-1.png';
  import normalPlain2 from '../assets/images/MensSuitNormalPlain-2.png';
  import normalPlain3 from '../assets/images/MensSuitNormalPlain-3.png';
  import normalPlain4 from '../assets/images/MensSuitNormalPlain-4.png';
  import normalPlain5 from '../assets/images/MensSuitNormalPlain-5.png';
  import standardPlain1 from '../assets/images/MensSuitStandardPlain-1.png';
  import standardPlain2 from '../assets/images/MensSuitStandardPlain-2.png';
  import standardPlain3 from '../assets/images/MensSuitStandardPlain-3.png';
  import standardPlain4 from '../assets/images/MensSuitStandardPlain-4.png';
  import standardPlain5 from '../assets/images/MensSuitStandardPlain-5.png';
  import highCheck1 from '../assets/images/MensSuitHighCheck-1.png';
  import highCheck2 from '../assets/images/MensSuitHighCheck-2.png';
  import highCheck3 from '../assets/images/MensSuitHighCheck-3.png';
  import highCheck4 from '../assets/images/MensSuitHighCheck-4.png';
  import highCheck5 from '../assets/images/MensSuitHighCheck-5.png';
  import superWool1 from '../assets/images/MensSuitSuperWool-1.png';
  import superWool2 from '../assets/images/MensSuitSuperWool-2.png';
  import superWool3 from '../assets/images/MensSuitSuperWool-3.png';
  import superWool4 from '../assets/images/MensSuitSuperWool-4.png';
  import superWool5 from '../assets/images/MensSuitSuperWool-5.png';
  import menHero from '../assets/images/Men.jpg';
  */

  const products: Product[] = [
    {
      id: 1,
      name: 'Normal Quality Plain Fabric Suit',
      price: 12000,
      category: 'Men',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'Navy', 'Grey', 'White'],
      imageUrls: [
        '/assets/images/MensSuitNormalPlain-1.png',
        '/assets/images/MensSuitNormalPlain-2.png',
        '/assets/images/MensSuitNormalPlain-3.png',
        '/assets/images/MensSuitNormalPlain-4.png',
        '/assets/images/MensSuitNormalPlain-5.png',
        // If using src, replace with: [normalPlain1, normalPlain2, normalPlain3, normalPlain4, normalPlain5],
      ],
      description: 'A versatile and affordable suit crafted from normal quality plain fabric. Ideal for everyday elegance with a clean, classic design. Available in all colors, negotiable price starting at 12,000 KES.',
    },
    {
      id: 2,
      name: 'Standard Quality Plain Fabric Suit',
      price: 13000,
      category: 'Men',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'Navy', 'Grey', 'White'],
      imageUrls: [
        '/assets/images/MensSuitStandardPlain-1.png',
        '/assets/images/MensSuitStandardPlain-2.png',
        '/assets/images/MensSuitStandardPlain-3.png',
        '/assets/images/MensSuitStandardPlain-4.png',
        '/assets/images/MensSuitStandardPlain-5.png',
        // If using src, replace with: [standardPlain1, standardPlain2, standardPlain3, standardPlain4, standardPlain5],
      ],
      description: 'A reliable suit crafted from standard quality plain fabric, offering a balance of durability and style. Perfect for versatile wear. Available in all colors, negotiable price starting at 13,000 KES.',
    },
    {
      id: 3,
      name: 'High Check Fabrics Suit',
      price: 15000,
      category: 'Men',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'Navy', 'Grey', 'White'],
      imageUrls: [
        '/assets/images/MensSuitHighCheck-1.png',
        '/assets/images/MensSuitHighCheck-2.png',
        '/assets/images/MensSuitHighCheck-3.png',
        '/assets/images/MensSuitHighCheck-4.png',
        '/assets/images/MensSuitHighCheck-5.png',
        // If using src, replace with: [highCheck1, highCheck2, highCheck3, highCheck4, highCheck5],
      ],
      description: 'A stylish suit with a high check pattern, blending modern design with classic tailoring. Ideal for making a statement. Available in all colors, negotiable price starting at 15,000 KES.',
    },
    {
      id: 4,
      name: 'Super Wool Fabric Suit',
      price: 25000,
      category: 'Men',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'Navy', 'Grey', 'White'],
      imageUrls: [
        '/assets/images/MensSuitSuperWool-1.png',
        '/assets/images/MensSuitSuperWool-2.png',
        '/assets/images/MensSuitSuperWool-3.png',
        '/assets/images/MensSuitSuperWool-4.png',
        '/assets/images/MensSuitSuperWool-5.png',
        // If using src, replace with: [superWool1, superWool2, superWool3, superWool4, superWool5],
      ],
      description: 'A luxurious suit made from premium super wool fabric, offering unmatched softness and durability. Perfect for formal occasions. Available in all colors, negotiable price starting at 25,000 KES.',
    },
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleImageChange = (fabric: string, direction: 'next' | 'prev') => {
    setImageIndices((prev) => {
      const currentIndex = prev[fabric as keyof typeof prev];
      const totalImages = 5;
      const newIndex =
        direction === 'next'
          ? (currentIndex + 1) % totalImages
          : (currentIndex - 1 + totalImages) % totalImages;
      return { ...prev, [fabric]: newIndex };
    });
  };

  const handleAddToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]') as CartItem[];
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrls: product.imageUrls,
      description: product.description,
      itemType: 'standard',
      customDescription: '',
      fabric: product.name, // Pass fabric name for delivery estimation
    };
    const existingItemIndex = cart.findIndex(
      (item) => item.id === product.id && item.itemType === 'standard'
    );
    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push(cartItem);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    navigate('/cart', { state: { selectedItem: cartItem } });
  };

  const renderProductCard = (product: Product, fabricKey: string) => {
    const currentIndex = imageIndices[fabricKey as keyof typeof imageIndices];
    const price = `${product.price} KES`;

    return (
      <div key={product.id} className="bg-gradient-to-r from-gray-700 to-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-bold text-white mb-4">{product.name}</h3>
        <div className="relative w-full max-w-4xl mx-auto">
          <div className="relative w-full h-96 sm:h-[28rem] lg:h-[32rem] overflow-hidden rounded-lg">
            <img
              src={product.imageUrls[currentIndex] || placeholderImage}
              alt={`${product.name} Image ${currentIndex + 1}`}
              className="w-full h-full object-cover transition-opacity duration-300"
              loading="lazy"
              onError={(e) => { e.currentTarget.src = placeholderImage; }}
            />
            <button
              onClick={() => handleImageChange(fabricKey, 'prev')}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition"
              aria-label="Previous Image"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => handleImageChange(fabricKey, 'next')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition"
              aria-label="Next Image"
            >
              <ChevronRight size={24} />
            </button>
          </div>
          <p className="text-gray-300 mt-4">{product.description}</p>
          <div className="mt-4 text-gray-400">Available Sizes: {product.sizes.join(', ')}</div>
          <div className="mt-2 text-gray-400">Available Colors: {product.colors.join(', ')}</div>
          <div className="mt-2 text-gray-200 font-semibold">Price: {price}</div>
          <Button className="mt-4" size="lg" onClick={() => handleAddToCart(product)}>
            Add to Cart
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      <section className="relative h-[60vh] lg:h-[70vh] overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${placeholderImage})`, // Replace with menHero if in src
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.6)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent z-10" />
        <div className="relative z-20 h-full flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              Men’s Bespoke Suits
              <br />
              <span className="text-yellow-500">Timeless Elegance</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-md">
              Discover our curated collection of men’s suits, tailored to perfection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/custom-tailoring">
                <Button size="lg">Design Your Custom Suit</Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
              >
                Browse Collection
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Men’s Collection</h2>
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.map((product) => {
                const fabricKey = product.name.toLowerCase().includes('normal quality plain fabric')
                  ? 'normalPlain'
                  : product.name.toLowerCase().includes('standard quality plain fabric')
                  ? 'standardPlain'
                  : product.name.toLowerCase().includes('high check fabrics')
                  ? 'highCheck'
                  : 'superWool';
                return renderProductCard(product, fabricKey);
              })}
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg opacity-70">
              <h3 className="text-2xl font-bold text-gray-400 mb-4">Coming Soon: New Collection</h3>
              <div className="relative w-full max-w-4xl mx-auto">
                <div className="relative w-full h-64 sm:h-72 lg:h-80 bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-xl">Stay Tuned!</span>
                </div>
                <p className="text-gray-400 mt-4">
                  We’re working on bringing you a new collection of suits. Check back soon for updates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Complete Your Look</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Coming soon: Accessories to elevate your suit to the perfect outfit.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-800 p-6 rounded-lg shadow-md opacity-70">
                <div className="w-full h-48 bg-gray-700 rounded-md flex items-center justify-center">
                  <span className="text-gray-400">Coming Soon</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-400 mt-4">Section {i + 1}</h3>
                <p className="text-gray-500">More details coming soon.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-wide">
            Craft Your Perfect Suit
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg">
            Experience the luxury of a suit tailored just for you by our expert craftsmen.
          </p>
          <Link to="/custom-tailoring">
            <Button
              size="lg"
              className="bg-yellow-500 hover:bg-yellow-600 transition-transform transform hover:scale-105"
            >
              Schedule a Fitting
              <ChevronRight className="ml-2" size={16} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default MensSuits;