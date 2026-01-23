"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface WishlistStore {
  items: string[]
  toggleItem: (productId: string) => void
  addItem: (productId: string) => void
  removeItem: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      toggleItem: (productId) => {
        set((state) => {
          const isInWishlist = state.items.includes(productId)
          if (isInWishlist) {
            return {
              items: state.items.filter((id) => id !== productId),
            }
          } else {
            return {
              items: [...state.items, productId],
            }
          }
        })
      },

      addItem: (productId) => {
        set((state) => {
          if (state.items.includes(productId)) return state
          return {
            items: [...state.items, productId],
          }
        })
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((id) => id !== productId),
        }))
      },

      isInWishlist: (productId) => {
        return get().items.includes(productId)
      },

      clearWishlist: () => {
        set({ items: [] })
      },
    }),
    {
      name: "wishlist-storage",
    }
  )
)