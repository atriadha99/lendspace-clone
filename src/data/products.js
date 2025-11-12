// src/data/products.js
export const productData = [
  {
    id: 1,
    name: 'Canon EOS R5',
    // ... data lama
    description: 'Kamera mirrorless full-frame profesional dengan resolusi 45MP, mampu merekam video 8K. Cocok untuk fotografi pernikahan, event besar, dan produksi video sinematik. Termasuk 1 baterai dan 1 memory card 128GB.',
    rating: 4.9,
    totalReviews: 120,
    lender: {
      name: 'Budi Kamera',
      isTrusted: true, // Badge untuk lender terpercaya
    },
    location: { lat: -6.2923, lng: 106.7185 }, // Koordinat untuk peta
    unavailableDates: [new Date(2025, 9, 20), new Date(2025, 9, 21)], // Tanggal untuk kalender (Oktober)
  },
  {
    id: 1,
    name: 'Canon EOS R5',
    category: 'Photography',
    price: 'Rp 500.000',
    priceUnit: '/hari',
    imageUrl: 'https://i.ibb.co/6yv4d66/camera.jpg', // Contoh URL gambar
  },
  {
    id: 2,
    name: 'Impact Drill Set',
    category: 'Tools',
    price: 'Rp 150.000',
    priceUnit: '/hari',
    imageUrl: 'https://i.ibb.co/P9M3r2B/drill.jpg',
  },
  {
    id: 3,
    name: 'Toyota Avanza',
    category: 'Vehicles',
    price: 'Rp 350.000',
    priceUnit: '/hari',
    imageUrl: 'https://i.ibb.co/k3b4t0P/car.jpg',
  },
  {
    id: 4,
    name: 'Lighting Godox SL60W',
    category: 'Event Gear',
    price: 'Rp 200.000',
    priceUnit: '/hari',
    imageUrl: 'https://i.ibb.co/qDkSRk5/lighting.jpg',
  },
];