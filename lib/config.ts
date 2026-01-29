export const PRODUCT_CATEGORIES = [
  "Jersey",
  "Promo",
  "New Release",
  "Retro",
  "Sepatu",
  "Sepatu Futsal",
  "Windbreaker",
  "Produk Lainnya"
] as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[number];

export const SIZE_PRESETS: Record<string, { size: string; qty: number }[]> = {
  // Default/Jersey sizes
  "Jersey": [
    { size: 'S', qty: 10 },
    { size: 'M', qty: 10 },
    { size: 'L', qty: 10 },
    { size: 'XL', qty: 5 },
    { size: 'XXL', qty: 2 }
  ],
  // Shoe sizes (38-48)
  "Sepatu": [
    { size: '38', qty: 5 },
    { size: '39', qty: 5 },
    { size: '40', qty: 5 },
    { size: '41', qty: 5 },
    { size: '42', qty: 5 },
    { size: '43', qty: 5 },
    { size: '44', qty: 5 },
    { size: '45', qty: 5 },
    { size: '46', qty: 5 },
    { size: '47', qty: 5 },
    { size: '48', qty: 5 }
  ],
  "Sepatu Futsal": [
    { size: '38', qty: 5 },
    { size: '39', qty: 5 },
    { size: '40', qty: 5 },
    { size: '41', qty: 5 },
    { size: '42', qty: 5 },
    { size: '43', qty: 5 },
    { size: '44', qty: 5 },
    { size: '45', qty: 5 },
    { size: '46', qty: 5 },
    { size: '47', qty: 5 },
    { size: '48', qty: 5 }
  ]
};

export const DEFAULT_SIZE_PRESET = SIZE_PRESETS["Jersey"];
