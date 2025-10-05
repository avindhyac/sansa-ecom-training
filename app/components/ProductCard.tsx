'use client'

import { Product } from '@/lib/types/database'
import Image from 'next/image'
import { ShoppingBag, Star } from 'lucide-react'
import { useState } from 'react'

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = async () => {
    setIsAdding(true)
    onAddToCart(product)

    // Reset after animation
    setTimeout(() => setIsAdding(false), 1000)
  }

  return (
    <div className="group relative bg-background-elevated rounded-2xl overflow-hidden border border-border-subtle hover:border-jade/50 transition-all duration-300 hover:shadow-2xl hover:shadow-jade/10 hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-square bg-background-soft overflow-hidden">
        {product.image_url ? (
          <>
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-foreground-subtle">
            <div className="text-center">
              <ShoppingBag className="w-16 h-16 mx-auto mb-2 opacity-20" />
              <span className="text-sm">No Image</span>
            </div>
          </div>
        )}

        {/* Low Stock Badge */}
        {product.inventory_count > 0 && product.inventory_count <= 10 && (
          <div className="absolute top-3 left-3 bg-jade/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full">
            Only {product.inventory_count} left
          </div>
        )}

        {/* Out of Stock Badge */}
        {product.inventory_count === 0 && (
          <div className="absolute top-3 left-3 bg-red-500/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full">
            Out of Stock
          </div>
        )}

        {/* Quick View Button */}
        <button className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-background">
          <Star className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-1 group-hover:text-jade transition-colors">
          {product.name}
        </h3>

        <p className="text-sm text-foreground-muted mb-4 line-clamp-2 leading-relaxed">
          {product.description || 'Premium quality product crafted with care'}
        </p>

        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-jade">
              ${product.price.toFixed(2)}
            </span>
          </div>

          {product.inventory_count > 0 ? (
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="group/btn relative bg-jade hover:bg-jade-dark text-white font-medium px-5 py-2.5 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-jade/30 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
            >
              <span className={`flex items-center gap-2 ${isAdding ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
                <ShoppingBag className="w-4 h-4" />
                Add
              </span>
              {isAdding && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              )}
            </button>
          ) : (
            <span className="text-foreground-subtle text-sm font-medium px-5 py-2.5 bg-background-soft rounded-xl border border-border-subtle">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-jade/20 via-transparent to-accent-purple/20" />
      </div>
    </div>
  )
}
