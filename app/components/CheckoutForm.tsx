'use client'

import { useState } from 'react'
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'

interface CheckoutFormProps {
  orderId: string
}

export default function CheckoutForm({ orderId }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setLoading(true)
    setErrorMessage('')

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success?orderId=${orderId}`,
      },
    })

    if (error) {
      setErrorMessage(error.message || 'An error occurred')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-foreground/5 rounded-lg p-6 border border-foreground/10">
        <PaymentElement />
      </div>

      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-500 text-sm">{errorMessage}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-jade hover:bg-jade-dark text-white font-medium px-6 py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Processing...
          </span>
        ) : (
          'Pay Now'
        )}
      </button>

      <p className="text-foreground/50 text-xs text-center">
        Your payment information is secured by Stripe
      </p>
    </form>
  )
}
