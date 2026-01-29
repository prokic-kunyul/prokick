/**
 * Promo & Pricing Configuration
 * Modular config untuk harga dan promo
 */

// Base Prices
export const PRICES = {
  // Kustomisasi
  nameset: 45000,      // Full Nameset (Nama & Nomor)
  patch: 17000,        // Patch Lengan (Kiri + Kanan)
  
  // Ongkir default (akan di-override oleh promo)
  shippingDefault: 25000,
}

// Patch Type Options - CLUB
export const PATCH_TYPES_CLUB = [
  { id: 'domestic', label: 'Liga Domestik (EPL, La Liga, Serie A, dll)' },
  { id: 'ucl', label: 'UEFA Champions League' },
  { id: 'uel', label: 'UEFA Europa League' },
  { id: 'uecl', label: 'UEFA Conference League' },
  { id: 'cwc', label: 'FIFA Club World Cup' },
] as const

// Patch Type Options - NATIONAL TEAM
export const PATCH_TYPES_NATIONAL = [
  { id: 'wc', label: 'FIFA World Cup' },
  { id: 'euro', label: 'UEFA Euro' },
  { id: 'copa', label: 'Copa America' },
  { id: 'afcon', label: 'Africa Cup of Nations' },
  { id: 'asian', label: 'AFC Asian Cup' },
  { id: 'gold', label: 'CONCACAF Gold Cup' },
  { id: 'nation_league', label: 'UEFA Nations League' },
  { id: 'wc_qualifier', label: 'World Cup Qualifier' },
] as const

export type PatchTypeClub = typeof PATCH_TYPES_CLUB[number]['id']
export type PatchTypeNational = typeof PATCH_TYPES_NATIONAL[number]['id']
export type PatchType = PatchTypeClub | PatchTypeNational

// Jersey Categories
export const JERSEY_CATEGORIES = {
  CLUB: 'club',
  NATIONAL: 'national',
} as const

export type JerseyCategory = typeof JERSEY_CATEGORIES[keyof typeof JERSEY_CATEGORIES]

// Get patch types based on jersey category
export function getPatchTypes(category: JerseyCategory) {
  return category === 'national' ? PATCH_TYPES_NATIONAL : PATCH_TYPES_CLUB
}

// Shipping Zones (for Bank Transfer method)
export const SHIPPING_ZONES = [
  { id: 'jabodetabek', label: 'Jabodetabek', price: 15000 },
  { id: 'jawa', label: 'Jawa (Non-Jabodetabek)', price: 20000 },
  { id: 'sumatera', label: 'Sumatera', price: 28000 },
  { id: 'kalimantan', label: 'Kalimantan', price: 32000 },
  { id: 'sulawesi', label: 'Sulawesi', price: 32000 },
  { id: 'bali_nusa', label: 'Bali & Nusa Tenggara', price: 28000 },
  { id: 'maluku', label: 'Maluku', price: 40000 },
  { id: 'papua', label: 'Papua', price: 50000 },
] as const

export type ShippingZoneId = typeof SHIPPING_ZONES[number]['id']

// Province Data
export const PROVINCES = [
  { id: 'dki_jakarta', label: 'DKI Jakarta', zone: 'jabodetabek' },
  { id: 'banten', label: 'Banten', zone: 'jawa' },
  { id: 'jawa_barat', label: 'Jawa Barat', zone: 'jawa' },
  { id: 'jawa_tengah', label: 'Jawa Tengah', zone: 'jawa' },
  { id: 'di_yogyakarta', label: 'DI Yogyakarta', zone: 'jawa' },
  { id: 'jawa_timur', label: 'Jawa Timur', zone: 'jawa' },
  { id: 'aceh', label: 'Aceh', zone: 'sumatera' },
  { id: 'sumatera_utara', label: 'Sumatera Utara', zone: 'sumatera' },
  { id: 'sumatera_barat', label: 'Sumatera Barat', zone: 'sumatera' },
  { id: 'riau', label: 'Riau', zone: 'sumatera' },
  { id: 'jambi', label: 'Jambi', zone: 'sumatera' },
  { id: 'sumatera_selatan', label: 'Sumatera Selatan', zone: 'sumatera' },
  { id: 'bengkulu', label: 'Bengkulu', zone: 'sumatera' },
  { id: 'lampung', label: 'Lampung', zone: 'sumatera' },
  { id: 'kep_bangka_belitung', label: 'Kep. Bangka Belitung', zone: 'sumatera' },
  { id: 'kep_riau', label: 'Kep. Riau', zone: 'sumatera' },
  { id: 'bali', label: 'Bali', zone: 'bali_nusa' },
  { id: 'ntb', label: 'Nusa Tenggara Barat', zone: 'bali_nusa' },
  { id: 'ntt', label: 'Nusa Tenggara Timur', zone: 'bali_nusa' },
  { id: 'kalimantan_barat', label: 'Kalimantan Barat', zone: 'kalimantan' },
  { id: 'kalimantan_tengah', label: 'Kalimantan Tengah', zone: 'kalimantan' },
  { id: 'kalimantan_selatan', label: 'Kalimantan Selatan', zone: 'kalimantan' },
  { id: 'kalimantan_timur', label: 'Kalimantan Timur', zone: 'kalimantan' },
  { id: 'kalimantan_utara', label: 'Kalimantan Utara', zone: 'kalimantan' },
  { id: 'sulawesi_utara', label: 'Sulawesi Utara', zone: 'sulawesi' },
  { id: 'sulawesi_tengah', label: 'Sulawesi Tengah', zone: 'sulawesi' },
  { id: 'sulawesi_selatan', label: 'Sulawesi Selatan', zone: 'sulawesi' },
  { id: 'sulawesi_tenggara', label: 'Sulawesi Tenggara', zone: 'sulawesi' },
  { id: 'gorontalo', label: 'Gorontalo', zone: 'sulawesi' },
  { id: 'sulawesi_barat', label: 'Sulawesi Barat', zone: 'sulawesi' },
  { id: 'maluku', label: 'Maluku', zone: 'maluku' },
  { id: 'maluku_utara', label: 'Maluku Utara', zone: 'maluku' },
  { id: 'papua', label: 'Papua', zone: 'papua' },
  { id: 'papua_barat', label: 'Papua Barat', zone: 'papua' },
] as const

export function getZoneByProvince(provinceId: string): ShippingZoneId {
  const province = PROVINCES.find(p => p.id === provinceId)
  return (province?.zone as ShippingZoneId) || 'jawa'
}

export function getShippingCost(zoneId: ShippingZoneId): number {
  const zone = SHIPPING_ZONES.find(z => z.id === zoneId)
  return zone?.price || PRICES.shippingDefault
}

// Promo Thresholds
export const PROMOS = {
  freeShipping: {
    minQty: 2,
    label: 'BELI 2: GRATIS ONGKIR!',
    shortLabel: 'Gratis Ongkir',
  },
  freePatch: {
    minQty: 3,
    label: 'BELI 3: Bonus GRATIS Patch!',
    shortLabel: 'Gratis Patch',
  },
  megaBundle: {
    minQty: 5,
    bonusQty: 1,  // Get 6 total (5+1)
    label: 'BELI 5: Dapat 6 Jersey + GRATIS Nameset + Patch!',
    shortLabel: '6 Jersey + Nameset + Patch Gratis',
  },
}

// Calculate promo benefits based on quantity
export function calculatePromo(totalQty: number) {
  const result = {
    freeShipping: false,
    freePatch: false,
    freeNameset: false,
    bonusJersey: 0,
    activePromos: [] as string[],
  }

  if (totalQty >= PROMOS.megaBundle.minQty) {
    result.freeShipping = true
    result.freePatch = true
    result.freeNameset = true
    result.bonusJersey = PROMOS.megaBundle.bonusQty
    result.activePromos.push(PROMOS.megaBundle.shortLabel)
  } else if (totalQty >= PROMOS.freePatch.minQty) {
    result.freeShipping = true
    result.freePatch = true
    result.activePromos.push(PROMOS.freePatch.shortLabel)
    result.activePromos.push(PROMOS.freeShipping.shortLabel)
  } else if (totalQty >= PROMOS.freeShipping.minQty) {
    result.freeShipping = true
    result.activePromos.push(PROMOS.freeShipping.shortLabel)
  }

  return result
}

// Calculate total with customizations and shipping
export function calculateOrderTotal(params: {
  subtotal: number
  totalQty: number
  namesetCount: number
  patchCount: number
  shippingZone?: ShippingZoneId  // Optional - for transfer method
  isTransfer?: boolean           // If true, use zone pricing
}) {
  const promo = calculatePromo(params.totalQty)
  
  let customizationCost = 0
  
  // Nameset cost (free if mega bundle)
  // Calculate cost for EACH nameset, then remove if free
  const namesetCost = params.namesetCount * PRICES.nameset
  if (!promo.freeNameset) {
    customizationCost += namesetCost
  }
  
  // Patch cost (free if >= 3 items)
  const patchCost = params.patchCount * PRICES.patch
  if (!promo.freePatch) {
    customizationCost += patchCost
  }
  
  // Shipping calculation
  let shippingCost = 0
  if (!promo.freeShipping) {
    if (params.isTransfer && params.shippingZone) {
      // For transfer: use zone pricing
      shippingCost = getShippingCost(params.shippingZone)
    } else {
      // For WhatsApp: will be calculated manually (show 0, but display "Dihitung")
      shippingCost = 0
    }
  }
  
  return {
    subtotal: params.subtotal,
    customization: customizationCost,
    shipping: shippingCost,
    shippingIncluded: params.isTransfer || promo.freeShipping,  // Whether shipping is final
    total: params.subtotal + customizationCost + shippingCost,
    promo,
    savings: {
      nameset: promo.freeNameset ? namesetCost : 0,
      patch: promo.freePatch ? patchCost : 0,
      shipping: promo.freeShipping ? getShippingCost(params.shippingZone || 'jawa') : 0,
    }
  }
}

// Format promo message for WhatsApp
export function formatPromoMessage(promo: ReturnType<typeof calculatePromo>) {
  if (promo.activePromos.length === 0) return ''
  return `🎁 Promo: ${promo.activePromos.join(' + ')}`
}
