
import { formatCurrency } from '@/lib/utils'
import { 
  SHIPPING_ZONES, 
  formatPromoMessage 
} from '@/lib/promo'

interface CartItemData {
  team: string
  type: string
  size: string
  quantity: number
  price: number
  customName?: string
  customNumber?: string
  customPatch?: string
}

interface OrderCalcData {
  subtotal: number
  customization: number
  shipping: number
  total: number
  shippingIncluded?: boolean
  promo: {
    freeShipping: boolean
    freeNameset: boolean
    freePatch: boolean
    bonusJersey: number
    activePromos: string[]
  }
}

interface SettingsData {
  bankName?: string
  bankAccount?: string
  bankHolder?: string
  whatsapp?: string
  [key: string]: string | undefined
}

interface CheckoutMessageData {
  items: CartItemData[]
  totalQty: number
  customer: {
    name: string
    phone: string
    address: string
  }
  customization: {
    namesetCount: number
    patchCount: number
  }
  orderCalc: OrderCalcData
  shippingZone?: string
  settings?: SettingsData
}

// Helper to format currency

export function generateWhatsAppOrderText(data: CheckoutMessageData) {
  const { items, customer, orderCalc, totalQty } = data

  const itemsList = items.map(i => {
    let line = `• ${i.team} (${i.type}) Size ${i.size} x${i.quantity} - ${formatCurrency(i.price * i.quantity)}`
    const customs = []
    if (i.customName) customs.push(`nameset: ${i.customName} ${i.customNumber || ''}`)
    else if (i.customNumber) customs.push(`No: ${i.customNumber}`)
    if (i.customPatch) customs.push(`Path: ${i.customPatch}`)
    
    if (customs.length > 0) {
      line += `%0A  👉 ${customs.join(', ')}`
    }
    return line
  }).join('%0A')
  
  const promoMsg = formatPromoMessage(orderCalc.promo)
  
  return `🛒 *ORDER BARU*%0A%0A` +
    `👤 *Data Pemesan:*%0A` +
    `Nama: ${customer.name}%0A` +
    `HP/WA: ${customer.phone}%0A` +
    `Alamat: ${customer.address}%0A%0A` +
    `📦 *Pesanan (${totalQty} jersey):*%0A${itemsList}%0A%0A` +
    (promoMsg ? `${promoMsg}%0A%0A` : '') +
    (orderCalc.promo.bonusJersey > 0 ? `🎉 *BONUS: +${orderCalc.promo.bonusJersey} Jersey Gratis!*%0A%0A` : '') +
    `💰 *Subtotal:* ${formatCurrency(orderCalc.subtotal)}%0A` +
    (orderCalc.customization > 0 ? `✍️ *Kustomisasi:* ${formatCurrency(orderCalc.customization)}%0A` : '') +
    `🚚 *Ongkir:* ${orderCalc.promo.freeShipping ? 'GRATIS' : 'Dihitung'}%0A` +
    `💵 *TOTAL:* ${formatCurrency(orderCalc.total)}%0A%0A` +
    `Terima kasih! 🙏`
}

export function generateTransferOrderText(data: CheckoutMessageData, orderId: string, settings: SettingsData) {
  const { items, customer, orderCalc, totalQty, shippingZone } = data

  const itemsList = items.map(i => {
    let line = `• ${i.team} (${i.type}) Size ${i.size} x${i.quantity}`
    const customs = []
    if (i.customName) customs.push(`nameset: ${i.customName} ${i.customNumber || ''}`)
    else if (i.customNumber) customs.push(`No: ${i.customNumber}`)
    if (i.customPatch) customs.push(`Patch: ${i.customPatch}`)
    
    if (customs.length > 0) {
      line += `%0A  👉 ${customs.join(', ')}`
    }
    return line
  }).join('%0A')
  
  const selectedZoneLabel = shippingZone ? 
    SHIPPING_ZONES.find(z => z.id === shippingZone)?.label : 'Jabodetabek'
  
  return `🏦 *KONFIRMASI TRANSFER #${orderId}*%0A%0A` +
    `👤 *Data Pemesan:*%0A` +
    `Nama: ${customer.name}%0A` +
    `HP/WA: ${customer.phone}%0A` +
    `Alamat: ${customer.address}%0A` +
    `Wilayah: ${selectedZoneLabel}%0A%0A` +
    `📦 *Pesanan (${totalQty} jersey):*%0A${itemsList}%0A%0A` +
    `💰 *Subtotal:* ${formatCurrency(orderCalc.subtotal)}%0A` +
    (orderCalc.customization > 0 ? `✍️ *Kustomisasi:* ${formatCurrency(orderCalc.customization)}%0A` : '') +
    `🚚 *Ongkir (${selectedZoneLabel}):* ${orderCalc.promo.freeShipping ? 'GRATIS' : formatCurrency(orderCalc.shipping)}%0A` +
    `💵 *TOTAL:* ${formatCurrency(orderCalc.total)}%0A%0A` +
    `━━━━━━━━━━━━━━━━━━━━━━%0A` +
    `🏦 *Transfer ke:*%0A` +
    `Bank: ${settings?.bankName || 'BCA'}%0A` +
    `No. Rek: ${settings?.bankAccount || '1234567890'}%0A` +
    `A/N: ${settings?.bankHolder || 'Jersey Store'}%0A%0A` +
    `📸 *Mohon kirim foto bukti transfer di chat ini*%0A` +
    `Terima kasih! 🙏`
}
