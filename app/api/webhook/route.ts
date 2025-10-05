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

  // Use admin client for webhook (bypasses RLS)
  const { createClient: createAdminClient } = await import('@supabase/supabase-js')
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent

      console.log('Payment intent succeeded:', paymentIntent.id)

      // First, check if order exists (using admin client to bypass RLS)
      const { data: existingOrder } = await supabaseAdmin
        .from('orders')
        .select('id')
        .eq('stripe_payment_intent_id', paymentIntent.id)
        .maybeSingle()

      if (!existingOrder) {
        console.log('No order found with payment intent:', paymentIntent.id)
        break
      }

      console.log('Found order:', existingOrder.id)

      // Update order status to completed (using admin client to bypass RLS)
      const { data: order, error } = await supabaseAdmin
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

      console.log('Order updated successfully:', order.id)

      // Send order confirmation email
      if (order && order.customers) {
        try {
          console.log('Preparing to send order confirmation email for order:', order.id)
          console.log('Customer email:', order.customers.email)
          console.log('RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY)
          console.log('RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev')

          const orderItems = order.order_items.map((item: { products: { name: string }; quantity: number; price: number }) => ({
            name: item.products.name,
            quantity: item.quantity,
            price: item.price,
          }))

          console.log('Order items:', orderItems)

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

          console.log('Email HTML rendered successfully')

          const result = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
            to: order.customers.email,
            subject: `Order Confirmation - #${order.id}`,
            html: emailHtml,
          })

          console.log('Order confirmation email sent successfully:', result)
          console.log('Email sent to:', order.customers.email)
        } catch (emailError) {
          console.error('Error sending order confirmation email:', emailError)
          console.error('Error details:', JSON.stringify(emailError, null, 2))
        }
      } else {
        console.log('Order or customer data missing:', { hasOrder: !!order, hasCustomers: !!order?.customers })
      }
      break

    case 'payment_intent.payment_failed':
      const failedPaymentIntent = event.data.object as Stripe.PaymentIntent

      // Update order status to cancelled (using admin client to bypass RLS)
      await supabaseAdmin
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('stripe_payment_intent_id', failedPaymentIntent.id)
      break

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
