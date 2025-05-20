import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface CartItemProps {
  item: {
    id: number;
    product: {
      id: number;
      name: string;
      price: number;
      image_urls: string[];
    };
    quantity: number;
  };
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateCartItem, removeFromCart } = useCart();

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(item.id, newQuantity);
    } catch (error) {
      alert('Failed to update quantity. Please try again.');
    }
  };

  const handleRemove = async () => {
    try {
      await removeFromCart(item.id);
    } catch (error) {
      alert('Failed to remove item. Please try again.');
    }
  };

  const formattedPrice = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(item.product.price);

  return (
    <div className="flex items-center bg-gray-800 p-4 rounded-lg">
      <img
        src={item.product.image_urls[0] || '/assets/images/placeholder.png'}
        alt={item.product.name}
        className="w-24 h-24 object-cover rounded-md mr-4"
      />
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-white">{item.product.name}</h3>
        <p className="text-gray-300">{formattedPrice}</p>
        <div className="flex items-center mt-2">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            className="text-gray-300 hover:text-white"
          >
            <Minus size={16} />
          </button>
          <span className="mx-2 text-white">{item.quantity}</span>
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            className="text-gray-300 hover:text-white"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
      <button
        onClick={handleRemove}
        className="text-red-500 hover:text-red-400"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
};

export default CartItem;