export interface GalleryImage {
  id: number;
  category: 'factory' | 'museum' | 'archive' | 'history';
  imageUrl: string;
}

const galleryImages: GalleryImage[] = [
  // Factory Images
  {
    id: 1,
    category: 'factory',
    imageUrl: '/src/images/f1.jpg',
  },
  {
    id: 2,
    category: 'factory',
    imageUrl: '/src/images/f2.jpg',
  },
  {
    id: 3,
    category: 'factory',
    imageUrl: '/src/images/f3.png',
  },
  {
    id: 4,
    category: 'factory',
    imageUrl: '/src/images/f4.jpg',
  },
  {
    id: 5,
    category: 'factory',
    imageUrl: '/src/images/f5.jpg',
  },
  {
    id: 6,
    category: 'factory',
    imageUrl: '/src/images/f6.jpg',
  },
  {
    id: 7,
    category: 'factory',
    imageUrl: '/src/images/f7.jpg',
  },
  // Museum Images
  {
    id: 8,
    category: 'museum',
    imageUrl: '/src/images/m1.jpg',
  },
  {
    id: 9,
    category: 'museum',
    imageUrl: '/src/images/m2.jpg',
  },
  {
    id: 10,
    category: 'museum',
    imageUrl: '/src/images/m3.jpg',
  },
  {
    id: 11,
    category: 'museum',
    imageUrl: '/src/images/m4.jpg',
  },
  {
    id: 12,
    category: 'museum',
    imageUrl: '/src/images/m5.jpg',
  },
  {
    id: 13,
    category: 'museum',
    imageUrl: '/src/images/m6.jpg',
  },
  {
    id: 14,
    category: 'museum',
    imageUrl: '/src/images/m7.jpg',
  },
  // Archive Images
  {
    id: 15,
    category: 'archive',
    imageUrl: '/src/images/ar1.jpg',
  },
  {
    id: 16,
    category: 'archive',
    imageUrl: '/src/images/ar2.jpg',
  },
  {
    id: 17,
    category: 'archive',
    imageUrl: '/src/images/ar3.jpg',
  },
  {
    id: 18,
    category: 'archive',
    imageUrl: '/src/images/ar4.jpg',
  },
  {
    id: 19,
    category: 'archive',
    imageUrl: '/src/images/ar5.jpg',
  },
  {
    id: 20,
    category: 'archive',
    imageUrl: '/src/images/ar6.jpg',
  },
  {
    id: 21,
    category: 'archive',
    imageUrl: '/src/images/ar7.jpg',
  },
  {
    id: 22,
    category: 'archive',
    imageUrl: '/src/images/ar8.jpg',
  },
  {
    id: 23,
    category: 'archive',
    imageUrl: '/src/images/ar9.jpg',
  },
  {
    id: 24,
    category: 'archive',
    imageUrl: '/src/images/ar10.jpg',
  },
  {
    id: 25,
    category: 'archive',
    imageUrl: '/src/images/ar11.jpg',
  },
  {
    id: 26,
    category: 'archive',
    imageUrl: '/src/images/ar12.jpg',
  },
  {
    id: 27,
    category: 'archive',
    imageUrl: '/src/images/ar13.jpg',
  },
  {
    id: 28,
    category: 'archive',
    imageUrl: '/src/images/ar14.jpg',
  },
  {
    id: 29,
    category: 'archive',
    imageUrl: '/src/images/ar15.jpg',
  },
   // History Images
  {
    id: 30,
    category: 'history',
    imageUrl: '/src/images/h1.jpg',
  },
  {
    id: 31,
    category: 'history',
    imageUrl: '/src/images/h2.jpg',
  },
  {
    id: 32,
    category: 'history',
    imageUrl: '/src/images/h3.jpg',
  },
  {
    id: 33,
    category: 'history',
    imageUrl: '/src/images/h4.jpg',
  },
  {
    id: 34,
    category: 'history',
    imageUrl: '/src/images/h5.jpg',
  },
  {
    id: 35,
    category: 'history',
    imageUrl: '/src/images/h6.jpg',
  },
  {
    id: 36,
    category: 'history',
    imageUrl: '/src/images/h7.jpg',
  },
  {
    id: 37,
    category: 'history',
    imageUrl: '/src/images/h8.jpg',
  },
  {
    id: 38,
    category: 'history',
    imageUrl: '/src/images/h9.jpg',
  },
  {
    id: 39,
    category: 'history',
    imageUrl: '/src/images/h10.jpg',
  },
  {
    id: 40,
    category: 'history',
    imageUrl: '/src/images/h11.jpg',
  },
  {
    id: 41,
    category: 'history',
    imageUrl: '/src/images/h12.jpg',
  },
  {
    id: 42,
    category: 'history',
    imageUrl: '/src/images/h13.jpg',
  },
  {
    id: 43,
    category: 'history',
    imageUrl: '/src/images/h14.jpg',
  },
  {
    id: 44,
    category: 'history',
    imageUrl: '/src/images/h15.jpg',
  },
  {
    id: 45,
    category: 'history',
    imageUrl: '/src/images/h16.jpg',
  },
  {
    id: 46,
    category: 'history',
    imageUrl: '/src/images/h17.jpg',
  },
  {
    id: 47,
    category: 'history',
    imageUrl: '/src/images/h18.jpg',
  },
  {
    id: 48,
    category: 'history',
    imageUrl: '/src/images/h19.jpg',
  },
  {
    id: 49,
    category: 'history',
    imageUrl: '/src/images/h20.jpg',
  },
  {
    id: 50,
    category: 'history',
    imageUrl: '/src/images/h21.jpg',
  },
  {
    id: 51,
    category: 'history',
    imageUrl: '/src/images/h22.jpg',
  },
  {
    id: 52,
    category: 'history',
    imageUrl: '/src/images/h23.jpg',
  },
  {
    id: 53,
    category: 'history',
    imageUrl: '/src/images/h24.jpg',
  },
  {
    id: 54,
    category: 'history',
    imageUrl: '/src/images/h25.jpg',
  },
  {
    id: 55,
    category: 'history',
    imageUrl: '/src/images/h26.jpg',
  },
  {
    id: 56,
    category: 'history',
    imageUrl: '/src/images/h27.jpg',
  },
  {
    id: 57,
    category: 'history',
    imageUrl: '/src/images/h28.jpg',
  },
  {
    id: 58,
    category: 'history',
    imageUrl: '/src/images/h29.jpg',
  },
  {
    id: 59,
    category: 'history',
    imageUrl: '/src/images/h30.jpg',
  },
  {
    id: 60,
    category: 'history',
    imageUrl: '/src/images/h31.jpg',
  },
  {
    id: 61,
    category: 'history',
    imageUrl: '/src/images/h32.jpg',
  },
  {
    id: 62,
    category: 'history',
    imageUrl: '/src/images/h33.jpg',
  },
  {
    id: 63,
    category: 'history',
    imageUrl: '/src/images/h34.jpg',
  },
  {
    id: 64,
    category: 'history',
    imageUrl: '/src/images/h35.jpg',
  },
  {
    id: 65,
    category: 'history',
    imageUrl: '/src/images/h36.jpg',
  },
  {
    id: 66,
    category: 'history',
    imageUrl: '/src/images/h37.jpg',
  },
  {
    id: 67,
    category: 'history',
    imageUrl: '/src/images/h38.jpg',
  },
  {
    id: 68,
    category: 'history',
    imageUrl: '/src/images/h39.jpg',
  },
  {
    id: 69,
    category: 'history',
    imageUrl: '/src/images/h40.jpg',
  },
  {
    id: 70,
    category: 'history',
    imageUrl: '/src/images/h41.jpg',
  }
];

export default galleryImages;