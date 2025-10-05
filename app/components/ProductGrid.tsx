'use client'

import { Product, CartItem } from '@/lib/types/database'
import ProductCard from './ProductCard'
import { useState, useEffect } from 'react'

interface ProductGridProps {
  initialProducts: Product[]
}

export default function ProductGrid({ initialProducts }: ProductGridProps) {
  const [cart, setCart] = useState<CartItem[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id)

      if (existingItem) {
        // Update quantity if item already in cart
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        // Add new item to cart
        return [...prevCart, { product, quantity: 1 }]
      }
    })

    // Show a simple notification (you can enhance this with a toast library)
    alert(`${product.name} added to cart!`)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {initialProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={handleAddToCart}
        />
      ))}
    </div>
  )
}
