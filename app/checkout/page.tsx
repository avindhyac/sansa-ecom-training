'use client'

import { useEffect, useState } from 'react'
import { CartItem } from '@/lib/types/database'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import CheckoutForm from '../components/CheckoutForm'
import Link from 'next/link'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [clientSecret, setClientSecret] = useState('')
  const [orderId, setOrderId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart)
      setCart(parsedCart)

      // Create payment intent
      fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartItems: parsedCart }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to create payment intent')
          }
          return res.json()
        })
        .then((data) => {
          setClientSecret(data.clientSecret)
          setOrderId(data.orderId)
          setLoading(false)
        })
        .catch((err) => {
          console.error('Error:', err)
          setError(err.message || 'Failed to initialize checkout')
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const calculateTotal = () => {
    return cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jade mx-auto mb-4"></div>
          <p className="text-foreground">Preparing checkout...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Checkout Error</h1>
          <p className="text-foreground/70 mb-6">{error}</p>
          <Link
            href="/cart"
            className="inline-block bg-jade hover:bg-jade-dark text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Return to Cart
          </Link>
        </div>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Your cart is empty</h1>
          <Link
            href="/"
            className="inline-block bg-jade hover:bg-jade-dark text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/cart" className="text-jade hover:text-jade-light transition-colors inline-flex items-center gap-2">
            ← Back to Cart
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-foreground mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Order Summary
            </h2>

            <div className="bg-foreground/5 rounded-lg p-6 border border-foreground/10 space-y-4">
              {cart.map((item) => (
                <div key={item.product.id} className="flex justify-between">
                  <div>
                    <p className="text-foreground font-medium">
                      {item.product.name}
                    </p>
                    <p className="text-foreground/60 text-sm">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className="text-foreground font-semibold">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}

              <div className="border-t border-foreground/10 pt-4 mt-4">
                <div className="flex justify-between text-xl font-bold">
                  <span className="text-foreground">Total</span>
                  <span className="text-jade">${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Payment Details
            </h2>

            {clientSecret && (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: 'night',
                    variables: {
                      colorPrimary: '#00A86B',
                      colorBackground: '#000000',
                      colorText: '#ffffff',
                      colorDanger: '#df1b41',
                      borderRadius: '8px',
                    },
                  },
                }}
              >
                <CheckoutForm orderId={orderId} />
              </Elements>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
