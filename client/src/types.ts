interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  sizes: string[];
  colors: string[];
  imageUrls: string[];
  description?: string;
}

interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export type { Product, User };