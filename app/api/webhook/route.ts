import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { resend } from '@/lib/resend'
import Stripe from 'stripe'
import { render } from '@react-email/render'
import OrderConfirmationEmail from '@/emails/OrderConfirmationEmail'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  const supabase = await createClient()

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent

      // Update order status to completed
      const { data: order, error } = await supabase
        .from('orders')
        .update({ status: 'completed' })
        .eq('stripe_payment_intent_id', paymentIntent.id)
        .select(`
          *,
          order_items (
            *,
            products (*)
          ),
          customers (*)
        `)
        .single()

      if (error) {
        console.error('Error updating order:', error)
        break
      }

      // Send order confirmation email
      if (order && order.customers) {
        try {
          const orderItems = order.order_items.map((item: { products: { name: string }; quantity: number; price: number }) => ({
            name: item.products.name,
            quantity: item.quantity,
            price: item.price,
          }))

          const emailHtml = await render(
            OrderConfirmationEmail({
              orderId: order.id,
              customerName: order.customers.full_name || 'Customer',
              customerEmail: order.customers.email,
              orderItems,
              totalAmount: order.total_amount,
              orderDate: new Date(order.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }),
            })
          )

          await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
            to: order.customers.email,
            subject: `Order Confirmation - #${order.id}`,
            html: emailHtml,
          })

          console.log('Order confirmation email sent to:', order.customers.email)
        } catch (emailError) {
          console.error('Error sending order confirmation email:', emailError)
        }
      }
      break

    case 'payment_intent.payment_failed':
      const failedPaymentIntent = event.data.object as Stripe.PaymentIntent

      // Update order status to cancelled
      await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('stripe_payment_intent_id', failedPaymentIntent.id)
      break

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
