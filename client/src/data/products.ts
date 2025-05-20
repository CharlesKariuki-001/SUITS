import { Product } from '../types';

export const products: Product[] = [
  // Men's Suits
  {
    id: 1,
    name: 'Classic Black Suit',
    description: 'Timeless black suit with a modern fit, perfect for any formal occasion. Made from premium wool blend for comfort and durability.',
    price: 24999,
    category: 'men',
    sizes: ['46', '48', '50', '52', '54'],
    colors: ['Black'],
    imageUrls: [
      'https://images.unsplash.com/photo-1625020458387-cf810548f60e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598808503746-f34c53b9323e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1593032465175-481ac7f401f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
    stock: 15,
  },
  {
    id: 2,
    name: 'Navy Blue Suit',
    description: 'Versatile navy blue suit with a slim fit. Made from high-quality wool with a subtle texture.',
    price: 27999,
    category: 'men',
    sizes: ['46', '48', '50', '52', '54'],
    colors: ['Navy Blue'],
    imageUrls: [
      'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
    stock: 12,
  },
  {
    id: 3,
    name: 'Grey Pinstripe Suit',
    description: 'Elegant grey pinstripe suit with a classic fit. Perfect for business meetings and formal events.',
    price: 29999,
    category: 'men',
    sizes: ['46', '48', '50', '52', '54'],
    colors: ['Grey'],
    imageUrls: [
      'https://images.unsplash.com/photo-1500643752441-4dc90cda350a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
    stock: 8,
  },
  {
    id: 4,
    name: 'Charcoal Suit',
    description: 'Sophisticated charcoal suit with a modern cut. Versatile for both business and formal occasions.',
    price: 26999,
    category: 'men',
    sizes: ['46', '48', '50', '52', '54'],
    colors: ['Charcoal'],
    imageUrls: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581442789261-27c1a8a22574?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
    stock: 10,
  },
  {
    id: 5,
    name: 'Tan Summer Suit',
    description: 'Lightweight tan suit perfect for summer events. Made from breathable linen blend.',
    price: 23999,
    category: 'men',
    sizes: ['46', '48', '50', '52', '54'],
    colors: ['Tan'],
    imageUrls: [
      'https://images.unsplash.com/photo-1593032534613-075fcf233e9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1553531384-cc64c5b0e8b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
    stock: 6,
  },
  
  // Women's Suits
  {
    id: 6,
    name: 'Classic Black Women\'s Suit',
    description: 'Timeless black women\'s suit with a fitted blazer and tailored trousers. Perfect for professional settings.',
    price: 22999,
    category: 'women',
    sizes: ['36', '38', '40', '42', '44'],
    colors: ['Black'],
    imageUrls: [
      'https://images.unsplash.com/photo-1580911315296-7cb9de8fb75f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1614251055880-ee96e4803393?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
    stock: 10,
  },
  {
    id: 7,
    name: 'Navy Women\'s Pantsuit',
    description: 'Modern navy pantsuit with a slim-fit blazer and ankle-length trousers. Stylish for any professional woman.',
    price: 25999,
    category: 'women',
    sizes: ['36', '38', '40', '42', '44'],
    colors: ['Navy Blue'],
    imageUrls: [
      'https://images.unsplash.com/photo-1552902019-ebcd97aa9aa0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1631235433575-cc0c0e11ae58?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
    stock: 8,
  },
  {
    id: 8,
    name: 'White Women\'s Suit',
    description: 'Elegant white women\'s suit with a tailored blazer and wide-leg trousers. Perfect for special occasions.',
    price: 28999,
    category: 'women',
    sizes: ['36', '38', '40', '42', '44'],
    colors: ['White'],
    imageUrls: [
      'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618554754947-e01d5ce3c549?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
    stock: 6,
  },
  {
    id: 9,
    name: 'Grey Tweed Women\'s Suit',
    description: 'Sophisticated grey tweed suit with a fitted blazer and pencil skirt. Classic and professional.',
    price: 26999,
    category: 'women',
    sizes: ['36', '38', '40', '42', '44'],
    colors: ['Grey'],
    imageUrls: [
      'https://images.unsplash.com/photo-1650381051617-f9495953945a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1629385224033-a01467ab32e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
    stock: 7,
  },
  {
    id: 10,
    name: 'Burgundy Women\'s Suit',
    description: 'Statement burgundy suit with a modern cut. Perfect for making an impression in professional settings.',
    price: 27999,
    category: 'women',
    sizes: ['36', '38', '40', '42', '44'],
    colors: ['Burgundy'],
    imageUrls: [
      'https://images.unsplash.com/photo-1558898479-33c0057a5d12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580651214613-f4692d6d138f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ],
    stock: 5,
  }
];

export const getProductById = (id: number): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category: 'men' | 'women'): Product[] => {
  return products.filter(product => product.category === category);
};