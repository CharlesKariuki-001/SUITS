import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  itemType: 'standard' | 'custom';
  imageUrls?: string[];
  description?: string;
  customDescription?: string;
  fabric?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateCart: (items: CartItem[]) => void;
  clearCart: () => void;
  updateCartItem: (id: number, newQuantity: number) => void;
  removeFromCart: (id: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (cartItem) =>
          cartItem.id === item.id && cartItem.itemType === item.itemType
      );
      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity:
            updatedCart[existingItemIndex].quantity + (item.quantity || 1),
        };
        return updatedCart;
      }
      return [...prevCart, { ...item, quantity: item.quantity || 1 }];
    });
  };

  const updateCart = (items: CartItem[]) => {
    setCart(items);
  };

  const clearCart = () => {
    setCart([]);
  };

  const updateCartItem = (id: number, newQuantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateCart,
        clearCart,
        updateCartItem,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
