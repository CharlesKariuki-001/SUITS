import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import Button from '../ui/Button';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  // Format price (e.g., 24999 -> 24,999)
  const formattedPrice = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(product.price);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id);
  };

  // Fallback for missing image or description
  const imageUrl = product.imageUrls && product.imageUrls[0] 
    ? product.imageUrls[0] 
    : 'https://via.placeholder.com/300?text=No+Image';
  const description = product.description || 'Classic suit crafted for elegance and comfort.';

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block bg-gray-800 rounded-lg overflow-hidden shadow-md transition transform hover:-translate-y-1 hover:shadow-xl"
      aria-label={`View details for ${product.name}`}
    >
      <div className="relative pb-[125%] overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/80 to-transparent">
          <p className="text-gold-500 font-semibold text-lg">{formattedPrice}</p>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-white font-medium truncate text-lg mb-2 group-hover:text-gold-500 transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-400 text-sm line-clamp-2 mb-4">
          {description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {product.sizes.slice(0, 3).map((size) => (
            <span
              key={size}
              className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300"
              aria-label={`Size ${size}`}
            >
              {size}
            </span>
          ))}
          {product.sizes.length > 3 && (
            <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">
              +{product.sizes.length - 3}
            </span>
          )}
        </div>
        <Button
          variant="primary"
          fullWidth
          onClick={handleAddToCart}
          aria-label={`Add ${product.name} to cart`}
        >
          Add to Cart
        </Button>
      </div>
    </Link>
  );
};

export default ProductCard;