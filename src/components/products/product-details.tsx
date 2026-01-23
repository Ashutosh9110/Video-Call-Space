"use client"

import { useState } from "react"
import Image from "next/image"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Star, Heart, ShoppingCart, Truck, Shield, RefreshCw } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { ProductWithVariants } from "@/lib/products"

interface ProductDetailsProps {
  product: ProductWithVariants
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants[0] || null
  )
  const [quantity, setQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { addItem } = useCart()
  const { toggleItem, isInWishlist } = useWishlist()

  const hasDiscount = product.comparePrice && product.comparePrice > product.price
  const currentPrice = selectedVariant?.price || product.price

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      productVariantId: selectedVariant?.id,
      quantity,
      price: Number(currentPrice),
    })
  }

  const handleToggleWishlist = () => {
    toggleItem(product.id)
  }

  const handleQuantityChange = (type: 'increase' | 'decrease') => {
    if (type === 'increase') {
      setQuantity(prev => prev + 1)
    } else {
      setQuantity(prev => Math.max(1, prev - 1))
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Product Images */}
      <div className="space-y-4">
        <div className="relative aspect-square overflow-hidden rounded-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="relative aspect-square"
            >
              <Image
                src={product.images[currentImageIndex]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </motion.div>
          </AnimatePresence>

          {/* Wishlist button */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-4 right-4 p-3 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors duration-200"
          >
            <Heart
              className={`h-5 w-5 ${
                isInWishlist(product.id)
                  ? 'fill-red-500 text-red-500'
                  : 'text-gray-600'
              }`}
            />
          </button>

          {/* Discount badge */}
          {hasDiscount && (
            <Badge className="absolute top-4 left-4 bg-red-500 text-white">
              Sale
            </Badge>
          )}
        </div>

        {/* Thumbnail gallery */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {product.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`relative aspect-square w-20 rounded-lg overflow-hidden border-2 transition-colors ${
                currentImageIndex === index
                  ? 'border-black'
                  : 'border-gray-200'
              }`}
            >
              <Image
                src={image}
                alt={`${product.name} ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < 4
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="ml-2 text-sm text-gray-600">
                4.5 ({product._count.reviews} reviews)
              </span>
            </div>
            {product.featured && (
              <Badge className="bg-black text-white">Featured</Badge>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold">
              {formatPrice(Number(currentPrice))}
            </span>
            {hasDiscount && (
              <>
                <span className="text-xl text-gray-500 line-through">
                  {formatPrice(Number(product.comparePrice))}
                </span>
                <Badge className="bg-red-500 text-white">
                  {Math.round(
                    ((Number(product.comparePrice) - Number(currentPrice)) /
                      Number(product.comparePrice)) *
                      100
                  )}% OFF
                </Badge>
              </>
            )}
          </div>
        </div>

        <Separator />

        {/* Product Description */}
        <div>
          <h3 className="font-semibold mb-2">Description</h3>
          <p className="text-gray-600 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Product Variants */}
        {product.variants.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">Options</h3>
            <div className="space-y-3">
              {Object.entries(
                product.variants[0]?.options || {}
              ).map(([optionType, _]) => (
                <div key={optionType}>
                  <h4 className="text-sm font-medium mb-2 capitalize">
                    {optionType}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(
                      new Set(
                        product.variants.map((v) => v.options[optionType])
                      )
                    ).map((option) => {
                      const variant = product.variants.find(
                        (v) => v.options[optionType] === option
                      )
                      return (
                        <button
                          key={option}
                          onClick={() => setSelectedVariant(variant!)}
                          className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                            selectedVariant?.id === variant?.id
                              ? 'border-black bg-black text-white'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {option}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quantity and Add to Cart */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-3">Quantity</h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center border-2 border-gray-200 rounded-lg">
                <button
                  onClick={() => handleQuantityChange('decrease')}
                  className="p-3 hover:bg-gray-50 transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange('increase')}
                  className="p-3 hover:bg-gray-50 transition-colors"
                >
                  +
                </button>
              </div>
              
              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-black text-white hover:bg-gray-800"
                size="lg"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${
              product.inventory?.quantity && product.inventory.quantity > 0
                ? 'bg-green-500'
                : 'bg-red-500'
            }`} />
            <span>
              {product.inventory?.quantity && product.inventory.quantity > 0
                ? `In Stock (${product.inventory.quantity} available)`
                : 'Out of Stock'
              }
            </span>
          </div>
        </div>

        <Separator />

        {/* Product Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <Truck className="h-5 w-5 text-gray-600" />
            <div>
              <p className="font-medium text-sm">Free Shipping</p>
              <p className="text-xs text-gray-500">On orders over $50</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-gray-600" />
            <div>
              <p className="font-medium text-sm">Secure Payment</p>
              <p className="text-xs text-gray-500">SSL encrypted</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RefreshCw className="h-5 w-5 text-gray-600" />
            <div>
              <p className="font-medium text-sm">Easy Returns</p>
              <p className="text-xs text-gray-500">30-day return policy</p>
            </div>
          </div>
        </div>

        {/* Product Tags */}
        {product.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}