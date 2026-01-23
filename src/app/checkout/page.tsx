"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, Truck, Package } from "lucide-react"
import { motion } from "framer-motion"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [isProcessing, setIsProcessing] = useState(false)
  const { items, getTotalPrice, clearCart } = useCart()
  const { user } = useAuth()

  const subtotal = getTotalPrice()
  const tax = subtotal * 0.08
  const shipping = subtotal > 50 ? 0 : 9.99
  const total = subtotal + tax + shipping

  if (sessionId) {
    return <CheckoutSuccess />
  }

  const handleCheckout = async () => {
    if (!user) {
      // Redirect to sign in
      return
    }

    setIsProcessing(true)
    try {
      const response = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.productId,
            productVariantId: item.productVariantId,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      })

      const { sessionId } = await response.json()
      
      const stripe = await stripePromise
      const { error } = await stripe!.redirectToCheckout({ sessionId })
      
      if (error) {
        console.error("Stripe redirect error:", error)
      }
    } catch (error) {
      console.error("Checkout error:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden">
                      <img
                        src={item.product?.images[0] || "/placeholder.jpg"}
                        alt={item.product?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.product?.name}</h3>
                      {item.variant && (
                        <p className="text-sm text-gray-500">
                          {Object.values(item.variant.options).join(", ")}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border rounded-lg"
                        defaultValue={user?.name?.split(" ")[0]}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border rounded-lg"
                        defaultValue={user?.name?.split(" ")[1]}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border rounded-lg"
                      defaultValue={user?.email}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="123 Main St"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="NY"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="10001"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Summary */}
          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <Badge variant="secondary">FREE</Badge>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>

                {shipping > 0 && (
                  <p className="text-sm text-gray-500">
                    Add {formatPrice(50 - subtotal)} more for free shipping
                  </p>
                )}

                <Button
                  onClick={handleCheckout}
                  disabled={isProcessing || items.length === 0}
                  className="w-full"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Proceed to Payment"
                  )}
                </Button>

                <div className="text-center text-sm text-gray-500">
                  <p>Secure payment powered by Stripe</p>
                  <div className="flex justify-center gap-2 mt-2">
                    <Badge variant="outline">Visa</Badge>
                    <Badge variant="outline">Mastercard</Badge>
                    <Badge variant="outline">Amex</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function CheckoutSuccess() {
  const { clearCart } = useCart()

  // Clear cart on successful checkout
  React.useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto text-center"
      >
        <div className="mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Package className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h3 className="font-medium mb-1">Order Processing</h3>
                <p className="text-sm text-gray-500">
                  We're preparing your order
                </p>
              </div>
              <div className="text-center">
                <Truck className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h3 className="font-medium mb-1">Shipping</h3>
                <p className="text-sm text-gray-500">
                  2-3 business days
                </p>
              </div>
              <div className="text-center">
                <CheckCircle className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <h3 className="font-medium mb-1">Delivery</h3>
                <p className="text-sm text-gray-500">
                  Track your order
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Button className="w-full" size="lg">
            View Order Details
          </Button>
          <Button variant="outline" className="w-full" size="lg">
            Continue Shopping
          </Button>
        </div>
      </motion.div>
    </div>
  )
}