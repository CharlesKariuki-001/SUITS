import { createContext, useContext, useState, useEffect } from 'react';

/**
 * Interface for items in the cart, supporting both standard and custom products.
 */
interface CartItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  quantity?: number;
  itemType: 'standard' | 'custom';
  image?: string;
  customizations?: {
    size?: string;
    color?: string;
    fitStyle?: string;
    bottomStyle?: 'trouser' | 'skirt';
    additionalNotes?: string;
    measurements?: {
      chest: string;
      waist: string;
      inseam?: string; // Optional, not used in CustomTailoring.tsx
      shoulder: string;
    };
  };
  product?: {
    id: number;
    name: string;
    price: number;
    category: string;
    sizes: string[];
    colors: string[];
    imageUrls: string[];
    description?: string;
  };
}

/**
 * Interface for the cart context, defining available methods and state.
 */
interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateCart: (cart: CartItem[]) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * Provides cart context to the application, managing cart state with localStorage.
 * @param children - React components to be wrapped by the provider.
 */
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        return Array.isArray(parsedCart) ? parsedCart : [];
      }
    } catch (error) {
      console.error('Failed to parse cart from localStorage:', error);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [cart]);

  /**
   * Adds an item to the cart, incrementing quantity if it already exists.
   * @param item - The item to add to the cart.
   */
  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) => cartItem.id === item.id && cartItem.itemType === item.itemType
      );
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id && cartItem.itemType === item.itemType
            ? { ...cartItem, quantity: (cartItem.quantity || 1) + (item.quantity || 1) }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: item.quantity || 1 }];
    });
  };

  /**
   * Updates the entire cart with a new array of items.
   * @param cart - The new cart items to set.
   */
  const updateCart = (cart: CartItem[]) => {
    setCart(cart);
  };

  /**
   * Removes an item from the cart by ID.
   * @param id - The ID of the item to remove.
   */
  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  /**
   * Clears all items from the cart.
   */
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

/**
 * Hook to access the cart context.
 * @returns The cart context with cart state and methods.
 * @throws Error if used outside a CartProvider.
 */
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};