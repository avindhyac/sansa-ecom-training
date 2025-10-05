'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  useEffect(() => {
    // Clear the cart after successful payment
    localStorage.removeItem('cart')
  }, [])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-foreground/5 rounded-lg p-8 border border-foreground/10 text-center">
          <div className="mb-6 flex justify-center">
            <div className="bg-jade/20 rounded-full p-4">
              <CheckCircle className="w-16 h-16 text-jade" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-4">
            Payment Successful!
          </h1>

          <p className="text-foreground/70 mb-2">
            Thank you for your purchase.
          </p>

          {orderId && (
            <p className="text-foreground/60 text-sm mb-8">
              Order ID: <span className="font-mono">{orderId}</span>
            </p>
          )}

          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full bg-jade hover:bg-jade-dark text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Continue Shopping
            </Link>

            <p className="text-foreground/50 text-sm">
              You will receive an order confirmation email shortly.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
