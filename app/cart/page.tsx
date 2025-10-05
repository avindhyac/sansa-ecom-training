'use client'

import { useEffect, useState } from 'react'
import { CartItem } from '@/lib/types/database'
import Image from 'next/image'
import { Trash2, Plus, Minus } from 'lucide-react'
import Link from 'next/link'

// This would normally come from server, but for cart we use client-side
export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('cart', JSON.stringify(cart))
    }
  }, [cart, loading])

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId)
      return
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    )
  }

  const removeItem = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId))
  }

  const calculateTotal = () => {
    return cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <p className="text-foreground text-center">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mb-16">
        <Link href="/" className="text-jade hover:text-jade-light transition-colors inline-flex items-center gap-2 mb-8">
          ← Back to Shop
        </Link>
      </div>

      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-8">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-foreground/50 text-lg mb-6">Your cart is empty</p>
            <Link
              href="/"
              className="inline-block bg-jade hover:bg-jade-dark text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-foreground/5 rounded-lg p-4 border border-foreground/10 flex gap-4"
                >
                  <div className="relative w-24 h-24 bg-foreground/10 rounded-lg overflow-hidden flex-shrink-0">
                    {item.product.image_url ? (
                      <Image
                        src={item.product.image_url}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-foreground/30 text-xs">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-foreground/70 mb-2">
                      ${item.product.price.toFixed(2)} each
                    </p>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="bg-foreground/10 hover:bg-foreground/20 p-2 rounded transition-colors"
                      >
                        <Minus className="w-4 h-4 text-foreground" />
                      </button>
                      <span className="text-foreground font-medium min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="bg-foreground/10 hover:bg-foreground/20 p-2 rounded transition-colors"
                      >
                        <Plus className="w-4 h-4 text-foreground" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-foreground/50 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <p className="text-xl font-bold text-jade">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-foreground/5 rounded-lg p-6 border border-foreground/10 sticky top-4">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-foreground/70">
                    <span>Subtotal</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-foreground/70">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="border-t border-foreground/10 pt-3 mt-3">
                    <div className="flex justify-between text-xl font-bold text-foreground">
                      <span>Total</span>
                      <span className="text-jade">${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full bg-jade hover:bg-jade-dark text-white font-medium px-6 py-3 rounded-lg transition-colors text-center"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  href="/"
                  className="block w-full text-center text-jade hover:text-jade-light mt-4 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
