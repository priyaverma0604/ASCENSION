// Diwali Duo Offer Configuration for Small Floral Candles
export const DIWALI_DUO_CANDLES = [
  {
    id: '6ae593c6028bd9f5be1c26da',
    name: 'Rosewater Charm',
    fullName: 'Ascension Rosewater Charm Candle',
    colorName: 'Blush Pink',
    colorHex: '#F4A5AE',
    bgClass: 'bg-rose-100 text-rose-800 border-rose-300',
    image: '/uploads/catalogue_2026/rosewater_charm_photo.png'
  },
  {
    id: '6ae593c6028bd9f5be1c26db',
    name: 'Sapphire Serenity',
    fullName: 'Ascension Sapphire Serenity Candle',
    colorName: 'Royal Blue',
    colorHex: '#3B82F6',
    bgClass: 'bg-blue-100 text-blue-800 border-blue-300',
    image: '/uploads/catalogue_2026/sapphire_serenity_photo.png'
  },
  {
    id: '6ae593c6028bd9f5be1c26dc',
    name: 'Ruby Elegance',
    fullName: 'Ascension Ruby Elegance Candle',
    colorName: 'Ruby Crimson',
    colorHex: '#DC2626',
    bgClass: 'bg-red-100 text-red-800 border-red-300',
    image: '/uploads/catalogue_2026/ruby_elegance_photo.png'
  },
  {
    id: '6ae593c6028bd9f5be1c26dd',
    name: 'Lavender Peacock Elegance',
    fullName: 'Ascension Lavender Peacock Elegance Candle',
    colorName: 'Royal Lavender',
    colorHex: '#9333EA',
    bgClass: 'bg-purple-100 text-purple-800 border-purple-300',
    image: '/uploads/catalogue_2026/lavender_peacock_elegance_photo.png'
  },
  {
    id: '6ae593c6028bd9f5be1c26de',
    name: 'Amber Grace',
    fullName: 'Ascension Amber Grace Candle',
    colorName: 'Warm Amber',
    colorHex: '#F59E0B',
    bgClass: 'bg-amber-100 text-amber-800 border-amber-300',
    image: '/uploads/catalogue_2026/amber_grace_photo.png'
  },
  {
    id: '6ae593c6028bd9f5be1c26df',
    name: 'Golden Grace',
    fullName: 'Ascension Golden Grace Candle',
    colorName: 'Imperial Gold',
    colorHex: '#EAB308',
    bgClass: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    image: '/uploads/catalogue_2026/golden_grace_photo.png'
  }
];

export const isDiwaliOfferCandle = (name = '') => {
  if (!name) return false;
  return DIWALI_DUO_CANDLES.some(c => name.toLowerCase().includes(c.name.toLowerCase()));
};

export const getDiwaliCandleInfo = (name = '') => {
  if (!name) return null;
  return DIWALI_DUO_CANDLES.find(c => name.toLowerCase().includes(c.name.toLowerCase())) || null;
};
