export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrls: string[];
  stock: number;
}

export const products: Product[] = [
  {
    id: 1,
    name: 'Classic Navy Suit',
    description: 'Men, Color: Navy, Size: M, Material: Wool',
    price: 25000,
    imageUrls: ['/assets/images/navy-suit.jpg'],
    stock: 15,
  },
  {
    id: 2,
    name: 'Charcoal Slim Fit Suit',
    description: 'Men, Color: Charcoal, Size: L, Material: Wool Blend',
    price: 28000,
    imageUrls: ['/assets/images/charcoal-suit.jpg'],
    stock: 12,
  },
  {
    id: 3,
    name: 'Women’s Black Tailored Suit',
    description: 'Women, Color: Black, Size: S, Material: Wool',
    price: 30000,
    imageUrls: ['/assets/images/womens-black-suit.jpg'],
    stock: 8,
  },
  {
    id: 4,
    name: 'Grey Pinstripe Suit',
    description: 'Men, Color: Grey, Size: XL, Material: Wool',
    price: 27000,
    imageUrls: ['/assets/images/grey-pinstripe.jpg'],
    stock: 10,
  },
  {
    id: 5,
    name: 'Women’s Navy Blazer Set',
    description: 'Women, Color: Navy, Size: M, Material: Polyester Blend',
    price: 32000,
    imageUrls: ['/assets/images/womens-navy-set.jpg'],
    stock: 6,
  },
  {
    id: 6,
    name: 'Blue Check Suit',
    description: 'Men, Color: Blue, Size: M, Material: Wool Blend',
    price: 26000,
    imageUrls: ['/assets/images/blue-check.jpg'],
    stock: 10,
  },
  {
    id: 7,
    name: 'Women’s Grey Skirt Suit',
    description: 'Women, Color: Grey, Size: L, Material: Wool',
    price: 31000,
    imageUrls: ['/assets/images/womens-grey-skirt.jpg'],
    stock: 8,
  },
  {
    id: 8,
    name: 'Black Tuxedo',
    description: 'Men, Color: Black, Size: L, Material: Wool',
    price: 35000,
    imageUrls: ['/assets/images/black-tuxedo.jpg'],
    stock: 6,
  },
  {
    id: 9,
    name: 'Women’s White Trouser Suit',
    description: 'Women, Color: White, Size: S, Material: Cotton Blend',
    price: 29000,
    imageUrls: ['/assets/images/womens-white-trouser.jpg'],
    stock: 7,
  },
  {
    id: 10,
    name: 'Brown Casual Suit',
    description: 'Men, Color: Brown, Size: M, Material: Cotton',
    price: 24000,
    imageUrls: ['/assets/images/brown-suit.jpg'],
    stock: 5,
  },
];