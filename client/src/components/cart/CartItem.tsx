import React from 'react';
import { Trash2 } from 'lucide-react';
import Button from '../ui/Button';
import { CartItem } from '../../context/CartContext';

interface CartItemProps {
  item: CartItem;
  updateQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
}

const placeholderImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

const CartItemComponent: React.FC<CartItemProps> = ({ item, updateQuantity, removeItem }) => {
  return (
    <div className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg w-full">
      <img
        src={item.imageUrls?.[0] || placeholderImage}
        alt={item.name}
        className="w-20 h-20 object-cover rounded-md"
        onError={(e) => { e.currentTarget.src = placeholderImage; }}
      />
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-white">{item.name}</h3>
        <p className="text-gray-400 text-sm">{item.description}</p>
        {item.fabric && <p className="text-gray-400 text-sm">Fabric: {item.fabric}</p>}
        <p className="text-gray-200 font-semibold">
          {new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
            minimumFractionDigits: 0,
          }).format(item.price)}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
          className="w-16 bg-gray-700 text-white border border-gray-600 rounded-md px-2 py-1 text-center"
        />
        <Button
          size="sm"
          variant="outline"
          onClick={() => removeItem(item.id)}
          aria-label={`Remove ${item.name}`}
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
};

export default CartItemComponent;