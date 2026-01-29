import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CartItem {
  id: string
  team: string
  type: string
  size: string
  price: number
  image: string | null
  quantity: number
  category?: string
  customName?: string
  customNumber?: string
  customPatch?: string
}

interface CartState {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  addItems: (items: (Omit<CartItem, 'quantity'> & { quantity?: number })[]) => void
  removeItem: (id: string, size: string, customName?: string, customNumber?: string, customPatch?: string) => void
  updateQuantity: (id: string, size: string, quantity: number, customName?: string, customNumber?: string, customPatch?: string) => void
  updateSize: (id: string, oldSize: string, newSize: string, customName?: string, customNumber?: string, customPatch?: string) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (newItem) => set((state) => {
        const quantityToAdd = newItem.quantity || 1
        const itemToAdd = { ...newItem }
        delete (itemToAdd as Record<string, unknown>).quantity

        // Unique Key: ID + Size + CustomName + CustomNumber
        const existingItem = state.items.find(item => 
          item.id === newItem.id && 
          item.size === newItem.size &&
          item.customName === newItem.customName && 
          item.customNumber === newItem.customNumber &&
          item.customPatch === newItem.customPatch
        )

        if (existingItem) {
          return {
            items: state.items.map(item => 
              (item.id === newItem.id && 
               item.size === newItem.size &&
               item.customName === newItem.customName && 
               item.customNumber === newItem.customNumber &&
               item.customPatch === newItem.customPatch)
                ? { ...item, quantity: item.quantity + quantityToAdd } 
                : item
            )
          }
        }
        return { items: [...state.items, { ...itemToAdd, quantity: quantityToAdd } as CartItem] }
      }),

      addItems: (newItems: (Omit<CartItem, 'quantity'> & { quantity?: number })[]) => set((state) => {
        const currentItems = [...state.items]

        newItems.forEach(newItem => {
           const quantityToAdd = newItem.quantity || 1
           const itemToAdd = { ...newItem }
           delete (itemToAdd as Record<string, unknown>).quantity

           const existingItemIndex = currentItems.findIndex(item => 
             item.id === newItem.id && 
             item.size === newItem.size &&
             item.customName === newItem.customName && 
             item.customNumber === newItem.customNumber &&
             item.customPatch === newItem.customPatch
           )

           if (existingItemIndex > -1) {
             currentItems[existingItemIndex] = {
               ...currentItems[existingItemIndex],
               quantity: currentItems[existingItemIndex].quantity + quantityToAdd
             }
           } else {
             currentItems.push({ ...itemToAdd, quantity: quantityToAdd } as CartItem)
           }
        })
        
        return { items: currentItems }
      }),

      removeItem: (id, size, customName, customNumber, customPatch) => set((state) => ({
        items: state.items.filter(item => 
          !(item.id === id && 
            item.size === size && 
            item.customName === customName && 
            item.customNumber === customNumber &&
            item.customPatch === customPatch)
        )
      })),

      updateQuantity: (id, size, quantity, customName, customNumber, customPatch) => set((state) => ({
        items: state.items.map(item => 
          (item.id === id && 
           item.size === size &&
           item.customName === customName && 
           item.customNumber === customNumber &&
           item.customPatch === customPatch)
            ? { ...item, quantity: Math.max(1, quantity) } 
            : item
        )
      })),

      updateSize: (id, oldSize, newSize, customName, customNumber, customPatch) => set((state) => {
        const itemToUpdate = state.items.find(i => 
          i.id === id && 
          i.size === oldSize &&
          i.customName === customName && 
          i.customNumber === customNumber &&
          i.customPatch === customPatch
        )
        if (!itemToUpdate) return state

        // Check if target size already exists for this product AND customization
        const targetItem = state.items.find(i => 
          i.id === id && 
          i.size === newSize &&
          i.customName === customName && 
          i.customNumber === customNumber &&
          i.customPatch === customPatch
        )
        
        if (targetItem) {
          // Merge quantities and remove old item
          const newQuantity = targetItem.quantity + itemToUpdate.quantity
          return {
            items: state.items
              .filter(i => !(
                i.id === id && 
                i.size === oldSize &&
                i.customName === customName && 
                i.customNumber === customNumber &&
                i.customPatch === customPatch
              ))
              .map(i => (
                i.id === id && 
                i.size === newSize &&
                i.customName === customName && 
                i.customNumber === customNumber && 
                i.customPatch === customPatch
              ) ? { ...i, quantity: newQuantity } : i)
          }
        } else {
          // Just update size string
          return {
            items: state.items.map(i => 
              (i.id === id && 
               i.size === oldSize &&
               i.customName === customName && 
               i.customNumber === customNumber &&
               i.customPatch === customPatch
              ) ? { ...i, size: newSize } : i
            )
          }
        }
      }),

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
      
      totalPrice: () => get().items.reduce((acc, item) => acc + (item.price * item.quantity), 0)
    }),
    {
      name: 'jersey-store-cart',
      storage: createJSONStorage(() => localStorage), 
      skipHydration: true,
    }
  )
)
