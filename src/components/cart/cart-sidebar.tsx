"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Minus, ShoppingBag } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/hooks/use-cart"
import { CartItem } from "@/hooks/use-cart"

export function CartSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCart()

  const handleCheckout = () => {
    // Navigate to checkout
    setIsOpen(false)
  }

  const totalItems = items.reduce((total, item) => total + item.quantity, 0)
  const totalPrice = getTotalPrice()

  return (
    <>
      {/* Cart Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="relative"
      >
        <ShoppingBag className="h-5 w-5" />
        {totalItems > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
            {totalItems}
          </Badge>
        )}
      </Button>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold">
                  Shopping Cart ({totalItems})
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {items.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
                    <p className="text-gray-600 mb-6">
                      Add some products to get started
                    </p>
                    <Button onClick={() => setIsOpen(false)}>
                      Continue Shopping
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <CartItem
                        key={item.id}
                        item={item}
                        onRemove={() => removeItem(item.id)}
                        onQuantityChange={(quantity) =>
                          updateQuantity(item.id, quantity)
                        }
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-bold">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-black text-white hover:bg-gray-800"
                    size="lg"
                  >
                    Proceed to Checkout
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    className="w-full"
                  >
                    Continue Shopping
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

interface CartItemProps {
  item: CartItem
  onRemove: () => void
  onQuantityChange: (quantity: number) => void
}

function CartItem({ item, onRemove, onQuantityChange }: CartItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex gap-4"
    >
      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
        <Image
          src={item.product?.images[0] || "/placeholder.jpg"}
          alt={item.product?.name || "Product"}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>

      <div className="flex-1 space-y-2">
        <div>
          <Link
            href={`/products/${item.product?.slug}`}
            className="font-medium hover:text-black transition-colors"
            onClick={() => onRemove()}
          >
            {item.product?.name}
          </Link>
          {item.variant && (
            <p className="text-sm text-gray-500">
              {Object.values(item.variant.options).join(", ")}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onQuantityChange(item.quantity - 1)}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onQuantityChange(item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-semibold">
              {formatPrice(item.price * item.quantity)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-red-500"
              onClick={onRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}