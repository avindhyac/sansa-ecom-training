'use client'

import { Product } from '@/lib/types/database'
import { ShoppingBag } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface AddToCartButtonProps {
  product: Product
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const router = useRouter()

  const handleAddToCart = () => {
    setIsAdding(true)

    // Get existing cart
    const existingCart = localStorage.getItem('cart')
    const cart = existingCart ? JSON.parse(existingCart) : []

    // Check if product already in cart
    const existingItemIndex = cart.findIndex(
      (item: { product: { id: string } }) => item.product.id === product.id
    )

    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += quantity
    } else {
      cart.push({ product, quantity })
    }

    localStorage.setItem('cart', JSON.stringify(cart))

    // Show success feedback
    setTimeout(() => {
      setIsAdding(false)
      alert(`${product.name} added to cart!`)
    }, 500)
  }

  const goToCart = () => {
    router.push('/cart')
  }

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-foreground font-medium">Quantity:</span>
        <div className="flex items-center gap-3 bg-background-soft border border-border-subtle rounded-xl p-2">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-8 h-8 flex items-center justify-center text-foreground hover:text-jade hover:bg-jade/10 rounded-lg transition-all"
          >
            -
          </button>
          <span className="w-12 text-center text-foreground font-semibold">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(product.inventory_count, quantity + 1))}
            className="w-8 h-8 flex items-center justify-center text-foreground hover:text-jade hover:bg-jade/10 rounded-lg transition-all"
          >
            +
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="flex-1 bg-jade hover:bg-jade-dark text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-jade/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isAdding ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Adding...
            </>
          ) : (
            <>
              <ShoppingBag className="w-5 h-5" />
              Add to Cart
            </>
          )}
        </button>

        <button
          onClick={goToCart}
          className="bg-accent-purple hover:bg-accent-purple/80 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-accent-purple/30"
        >
          Buy Now
        </button>
      </div>
    </div>
  )
}
