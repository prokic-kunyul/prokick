'use client'

import { useCartStore } from '@/features/cart/store'
import { Header } from '@/components/layout/Header'
import Link from 'next/link'
import { useState, useEffect, useMemo } from 'react'
import { createOrder } from '@/app/actions/order'

import { 
  SHIPPING_ZONES,
  getZoneByProvince,
  calculateOrderTotal, 
  PROVINCES
} from '@/lib/promo'
import toast from 'react-hot-toast'

// Import modular components
import { Button } from '@/components/ui/button'
import {
  CartItem,
  CustomerForm,
  OrderSummary,
  PaymentMethodSelector,
  TransferSuccessView,
  CheckoutStepper,
} from '@/features/cart/components'
import { generateWhatsAppOrderText, generateTransferOrderText } from '@/features/cart/lib/message-generator'

interface SettingsMap {
  [key: string]: string
}

interface OrderSuccessData {
  id: string
  total: number
  customerName: string
  items: { id: string; team: string; type: string; size: string; price: number; image: string | null; quantity: number }[]
  shippingZone: string
  shippingCost: number
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, updateSize, clearCart } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'whatsapp' | 'transfer'>('whatsapp')
  const [settings, setSettings] = useState<SettingsMap>({})

  // Customer Form State
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerAddress, setCustomerAddress] = useState('')
  const [customerProvince, setCustomerProvince] = useState('')

  // Customization State (Removed global state - now derived from items)
  
  // Shipping State (Derived)
  const shippingZone = customerProvince ? getZoneByProvince(customerProvince) : 'jawa'
  
  // Success State
  const [orderSuccess, setOrderSuccess] = useState<OrderSuccessData | null>(null)
  const [waConfirmText, setWaConfirmText] = useState('')
  
  // Checkout Step State (1=Cart, 2=Customer, 3=Shipping, 4=Payment, 5=Complete)
  const [checkoutStep] = useState(1)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
    fetch('/api/settings', { cache: 'no-store' }).then(res => res.json()).then(setSettings).catch(console.error)
  }, [])

  // Calculations
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const totalQty = items.reduce((acc, item) => acc + item.quantity, 0)
  
  // Calculate eligible quantity for promos (Exclude 'Produk Lainnya')
  const eligibleQty = items.reduce((acc, item) => {
    if (item.category === 'Produk Lainnya') return acc
    return acc + item.quantity
  }, 0)

  // Calculate customization counts
  const namesetCount = items.reduce((acc, item) => acc + ((item.customName || item.customNumber) ? item.quantity : 0), 0)
  const patchCount = items.reduce((acc, item) => acc + (item.customPatch ? item.quantity : 0), 0)

  const orderCalc = useMemo(() => {
    return calculateOrderTotal({
      subtotal,
      totalQty: eligibleQty, 
      namesetCount: namesetCount,
      patchCount: patchCount,
      shippingZone: shippingZone,
      isTransfer: paymentMethod === 'transfer',
    })
  }, [subtotal, eligibleQty, namesetCount, patchCount, shippingZone, paymentMethod])

  // Checkout Handler
  const handleCheckout = async () => {
    if (!customerName.trim()) {
      toast.error('Mohon isi nama lengkap')
      return
    }
    if (!customerPhone.trim()) {
      toast.error('Mohon isi nomor WhatsApp')
      return
    }
    if (!customerAddress.trim()) {
      toast.error('Mohon isi alamat lengkap')
      return
    }
    if (!customerProvince) {
      toast.error('Mohon pilih provinsi')
      return
    }

    // Get Province Label
    const provinceLabel = PROVINCES.find(p => p.id === customerProvince)?.label || customerProvince
    const fullAddress = `${customerAddress}, ${provinceLabel}`

    // Generate Checkout Data
    const checkoutData = {
      items,
      totalQty,
      customer: {
        name: customerName,
        phone: customerPhone,
        address: fullAddress, 
        rawAddress: customerAddress,
        province: provinceLabel
      },
      // Customization summary is now implicit in items, but we keep structure if needed for message gen
      // For now, we pass empty or derived info if message generator expects it
      customization: {
        namesetCount,
        patchCount
      },
      orderCalc,
      shippingZone,
      settings
    }

    if (paymentMethod === 'whatsapp') {
      const phone = settings.whatsapp || '6282197008330'
      const text = generateWhatsAppOrderText(checkoutData)
      
      window.open(`https://wa.me/${phone}?text=${text}`, '_blank')
      toast.success('Membuka WhatsApp...')
    } else {
      // Transfer: Create Order -> Show Success View
      const selectedZoneLabel = SHIPPING_ZONES.find(z => z.id === shippingZone)?.label ?? 'Jabodetabek'
      
      try {
          const order = await createOrder({
          total: orderCalc.total,
          customer: {
            name: customerName,
            phone: customerPhone,
            address: fullAddress,
            zone: selectedZoneLabel
          },
          items: items.map(i => ({
             id: i.id,
             category: i.category || 'Jersey',
             quantity: i.quantity,
             size: i.size,
             price: i.price,
             customName: i.customName,
             customNumber: i.customNumber,
             customPatch: i.customPatch
          }))
        })
        
        const text = generateTransferOrderText(checkoutData, order.id, settings)

        setWaConfirmText(text)
        setOrderSuccess({
          id: order.id,
          total: orderCalc.total,
          customerName,
          items,
          shippingZone: selectedZoneLabel,
          shippingCost: orderCalc.shipping
        })
        
        clearCart()
        window.scrollTo({ top: 0, behavior: 'smooth' })
        toast.success('Order Berhasil Dibuat!')
      
      } catch (e) {
        console.error(e)
        // Check rate limit error
        const message = e instanceof Error ? e.message : ''
        if (message.includes('Terlalu banyak')) {
           toast.error(message)
        } else {
           toast.error('Gagal membuat order. Coba lagi.')
        }
      }
    }
  }

  if (!mounted) return null
  
  if (!mounted) return null

  return (
    <div className="min-h-screen pb-20 pt-20">
      <Header />

      <div className="max-w-[1100px] mx-auto px-6 pt-4">
        {/* Checkout Stepper */}
        <CheckoutStepper currentStep={orderSuccess ? 5 : checkoutStep} />
        
        <div className="flex items-center gap-4 mb-8 pb-4 border-b border-blue-500/20">
          <h1 className="text-3xl font-black italic tracking-tight text-white drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
            KERANJANG SAYA
          </h1>
          <span className="text-cyan-400 font-bold text-sm mt-2 bg-blue-900/30 px-3 py-1 rounded-full border border-blue-500/30">
            {items.length} ITEM
          </span>
        </div>

        {orderSuccess ? (
          <TransferSuccessView 
            orderData={orderSuccess}
            bank={{
              name: settings.bankName || 'BCA',
              number: settings.bankAccount || '1234567890',
              holder: settings.bankHolder || 'Jersey Store'
            }}
            waPhone={settings.whatsapp || '6282197008330'}
            waText={waConfirmText}
          />
        ) : items.length === 0 ? (
          <div className="py-20 border-t border-blue-500/20 text-center">
            <p className="text-blue-200/60 mb-8 text-xl">Keranjang Anda masih kosong, ayo isi dengan jersey impian!</p>
            <Link href="/products" className="inline-block px-10 py-4 bg-cyan-400 text-black rounded-full font-black hover:bg-cyan-300 hover:scale-105 transition-all shadow-[0_0_20px_rgba(6,182,212,0.5)]">
              LANJUT BELANJA
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Cart Items */}
            <div className="lg:w-2/3 space-y-6">
              {items.map((item) => (
                <CartItem 
                  key={`${item.id}-${item.size}`}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onUpdateSize={updateSize}
                  onRemove={removeItem}
                />
              ))}

              {/* Bonus Jersey Notice */}
              {orderCalc.promo.bonusJersey > 0 && (
                <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 p-6 rounded-xl border border-cyan-500/30 flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/30">
                      <span className="text-xl">🎁</span>
                   </div>
                   <div>
                      <h4 className="text-cyan-400 font-bold text-lg">SELAMAT!</h4>
                      <p className="text-blue-100/80 text-sm">
                        Anda berhak mendapatkan <span className="text-white font-bold">{orderCalc.promo.bonusJersey} Bonus Jersey</span> secara GRATIS!
                      </p>
                   </div>
                </div>
              )}
              {/* Customer Details Form */}
              <div className="bg-blue-900/5 backdrop-blur-sm border border-blue-500/10 p-6 rounded-2xl md:p-8 mt-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-blue-900/20 flex items-center justify-center border border-cyan-500/30 text-cyan-400 font-bold">1</div>
                  <h2 className="text-xl font-bold text-white">INFORMASI PENGIRIMAN</h2>
                </div>
                
                <CustomerForm 
                  name={customerName}
                  phone={customerPhone}
                  address={customerAddress}
                  province={customerProvince}
                  onNameChange={setCustomerName}
                  onPhoneChange={setCustomerPhone}
                  onAddressChange={setCustomerAddress}
                  onProvinceChange={setCustomerProvince}
                />
              </div>

              {/* Payment Method Selector */}
              <div className="bg-blue-900/5 backdrop-blur-sm border border-blue-500/10 p-6 rounded-2xl md:p-8 mt-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-blue-900/20 flex items-center justify-center border border-cyan-500/30 text-cyan-400 font-bold">2</div>
                  <h2 className="text-xl font-bold text-white">METODE PEMBAYARAN</h2>
                </div>

                <PaymentMethodSelector
                  method={paymentMethod}
                  onMethodChange={setPaymentMethod}
                  bankName={settings.bankName}
                  bankAccount={settings.bankAccount}
                  bankHolder={settings.bankHolder}
                />
              </div>
            </div>

            {/* Vertical Divider (Desktop) */}
            <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-blue-500/20 to-transparent self-stretch"></div>

            {/* Checkout Panel */}
            <div className="lg:w-1/3">
              <div className="sticky top-24 space-y-6">
                <div className="bg-blue-900/5 backdrop-blur-sm border border-blue-500/10 p-6 rounded-2xl">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 bg-cyan-400 rounded-full block"></span>
                    RINGKASAN ORDER
                  </h2>
                  
                  <div className="space-y-6">
                    <OrderSummary
                      totalQty={totalQty}
                      subtotal={orderCalc.subtotal}
                      customization={orderCalc.customization}
                      shipping={orderCalc.shipping}
                      shippingIncluded={orderCalc.shippingIncluded}
                      total={orderCalc.total}
                      freeShipping={orderCalc.promo.freeShipping}
                      activePromos={orderCalc.promo.activePromos}
                      bonusJersey={orderCalc.promo.bonusJersey}
                      paymentMethod={paymentMethod}
                    />

                    <Button 
                      onClick={handleCheckout}
                      className="w-full py-8 text-lg font-black italic tracking-wide rounded-xl mt-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:brightness-110 shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all border border-cyan-300/50"
                      size="lg"
                    >
                      {paymentMethod === 'whatsapp' ? 'CHECKOUT (WA)' : 'BAYAR SEKARANG'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
