'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'

export default function CartCounter() {
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    // Function to update cart count
    const updateCartCount = () => {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        const cart = JSON.parse(savedCart)
        const totalItems = cart.reduce((total: number, item: { quantity: number }) => total + item.quantity, 0)
        setCartCount(totalItems)
      } else {
        setCartCount(0)
      }
    }

    // Initial load
    updateCartCount()

    // Listen for storage events (updates from other tabs)
    window.addEventListener('storage', updateCartCount)

    // Listen for custom cart update event
    window.addEventListener('cartUpdated', updateCartCount)

    return () => {
      window.removeEventListener('storage', updateCartCount)
      window.removeEventListener('cartUpdated', updateCartCount)
    }
  }, [])

  return (
    <Link
      href="/cart"
      className="relative flex items-center gap-2 text-foreground hover:text-jade transition-colors group px-3 py-2 rounded-lg hover:bg-background-soft"
    >
      <div className="relative">
        <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 w-5 h-5 bg-jade text-white text-xs font-bold rounded-full flex items-center justify-center animate-scale-in">
            {cartCount > 99 ? '99+' : cartCount}
          </span>
        )}
      </div>
      <span className="hidden sm:block text-sm font-medium">Cart</span>
    </Link>
  )
}
