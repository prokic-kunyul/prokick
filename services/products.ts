
import { getJerseyById } from './jerseys'
import { getShoeById } from './shoes'
import { getWindbreakerById } from './windbreakers'
import { getAccessoryById } from './accessories'

export async function getProductById(id: string) {
  // Try Jersey first (Most common)
  const jersey = await getJerseyById(id)
  if (jersey) return { ...jersey, category: 'Jersey' } // Ensure category is set

  // Try Shoes
  const shoe = await getShoeById(id)
  if (shoe) return { ...shoe, category: 'Sepatu' }

  // Try Windbreakers
  const windbreaker = await getWindbreakerById(id)
  if (windbreaker) return { ...windbreaker, category: 'Windbreaker' }

  // Try Accessories
  const accessory = await getAccessoryById(id)
  if (accessory) return { ...accessory, category: 'Produk Lainnya' }

  return null
}
