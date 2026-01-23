"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { formatPrice, calculateDiscount } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, ShoppingCart } from "lucide-react"
import { motion } from "framer-motion"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { ProductWithVariants } from "@/lib/products"

interface ProductCardProps {
  product: ProductWithVariants
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { addItem } = useCart()
  const { toggleItem, isInWishlist } = useWishlist()

  const hasDiscount = product.comparePrice && product.comparePrice > product.price
  const discountPercentage = hasDiscount 
    ? calculateDiscount(Number(product.comparePrice), Number(product.price))
    : 0

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      quantity: 1,
      price: Number(product.price),
    })
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    toggleItem(product.id)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500">
        <CardContent className="p-0">
          <div className="relative">
            <Link href={`/products/${product.slug}`}>
              <div 
                className="relative overflow-hidden"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <div className="aspect-square relative">
                  <Image
                    src={product.images[currentImageIndex] || product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  
                  {/* Hover effect with second image */}
                  {product.images.length > 1 && (
                    <Image
                      src={product.images[1]}
                      alt={product.name}
                      fill
                      className={`object-cover absolute inset-0 transition-opacity duration-700 ${
                        isHovered ? 'opacity-100' : 'opacity-0'
                      }`}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  )}
                </div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {product.featured && (
                    <Badge className="bg-black text-white">Featured</Badge>
                  )}
                  {hasDiscount && (
                    <Badge className="bg-red-500 text-white">
                      -{discountPercentage}%
                    </Badge>
                  )}
                  {product.tags.includes('new') && (
                    <Badge className="bg-green-500 text-white">New</Badge>
                  )}
                </div>

                {/* Wishlist button */}
                <button
                  onClick={handleToggleWishlist}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors duration-200"
                >
                  <Heart
                    className={`h-4 w-4 ${
                      isInWishlist(product.id)
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-600'
                    }`}
                  />
                </button>

                {/* Quick add button */}
                <motion.div
                  className="absolute bottom-3 left-3 right-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: isHovered ? 1 : 0,
                    y: isHovered ? 0 : 10,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    onClick={handleAddToCart}
                    className="w-full bg-black text-white hover:bg-gray-800"
                    size="sm"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Quick Add
                  </Button>
                </motion.div>
              </div>
            </Link>

            {/* Image thumbnails */}
            {product.images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
                {product.images.slice(0, 3).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      currentImageIndex === idx ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="p-4">
            <Link href={`/products/${product.slug}`}>
              <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-black transition-colors">
                {product.name}
              </h3>
            </Link>

            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-gray-600 ml-1">
                  {product._count.reviews > 0 
                    ? (4.5).toFixed(1) 
                    : 'New'
                  }
                </span>
              </div>
              {product._count.reviews > 0 && (
                <span className="text-sm text-gray-500">
                  ({product._count.reviews})
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">
                {formatPrice(Number(product.price))}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(Number(product.comparePrice))}
                </span>
              )}
            </div>

            {/* Variants preview */}
            {product.variants.length > 1 && (
              <div className="flex gap-1 mt-3">
                {product.variants.slice(0, 4).map((variant) => (
                  <div
                    key={variant.id}
                    className="w-6 h-6 rounded-full border-2 border-gray-200 overflow-hidden"
                    style={{
                      backgroundColor: variant.options.color as string || '#ccc',
                    }}
                  />
                ))}
                {product.variants.length > 4 && (
                  <span className="text-xs text-gray-500 self-center">
                    +{product.variants.length - 4}
                  </span>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}