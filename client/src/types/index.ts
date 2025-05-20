// Product Types
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: 'men' | 'women';
  sizes: string[];
  colors: string[];
  imageUrls: string[];
  stock: number;
}

// User Types
export interface User {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

// Cart Types
export interface CartItem {
  id: number;
  productId: number;
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

// Measurement Types
export interface CustomMeasurements {
  id?: number;
  userId?: number;
  chest: number;
  waist: number;
  armLength: number;
  shoulder: number;
  fabric: string;
  style: string;
  buttons: number;
  lapels: string;
}

// Order Types
export interface Order {
  id: number;
  userId: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    county: string;
    postalCode: string;
    phone: string;
  };
  items: {
    productId: number;
    name: string;
    quantity: number;
    price: number;
  }[];
  createdAt: string;
}