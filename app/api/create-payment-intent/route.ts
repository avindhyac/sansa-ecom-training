import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Ensure customer record exists before creating order
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('id', user.id)
      .maybeSingle()

    if (!existingCustomer) {
      console.log('Customer record missing for user:', user.id, '- Creating now')

      // Use admin client to bypass RLS for customer creation
      const supabaseAdmin = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
      )

      const { error: customerError } = await supabaseAdmin
        .from('customers')
        .insert({
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata.full_name || user.user_metadata.name || null,
        })

      if (customerError) {
        console.error('Error creating customer:', customerError)
        return NextResponse.json(
          { error: 'Failed to create customer record' },
          { status: 500 }
        )
      }
      console.log('Customer record created successfully')
    }

    const { cartItems } = await request.json()

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    // Calculate total amount
    const amount = cartItems.reduce(
      (total: number, item: { product: { price: number }; quantity: number }) => total + item.product.price * item.quantity * 100,
      0
    )

    // Create a PaymentIntent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Amount in cents
      currency: 'usd',
      metadata: {
        userId: user.id,
        cartItemsCount: cartItems.length.toString(),
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    console.log('Creating order with payment intent:', paymentIntent.id)
    console.log('User ID:', user.id)
    console.log('Total amount:', amount / 100)

    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id: user.id,
        total_amount: amount / 100,
        status: 'pending',
        stripe_payment_intent_id: paymentIntent.id,
      })
      .select()
      .single()

    if (orderError) {
      console.error('Error creating order:', orderError)
      console.error('Full error details:', JSON.stringify(orderError, null, 2))
      return NextResponse.json(
        { error: 'Failed to create order', details: orderError.message },
        { status: 500 }
      )
    }

    console.log('Order created successfully:', order.id, 'with payment intent:', order.stripe_payment_intent_id)

    // Create order items
    const orderItems = cartItems.map((item: { product: { id: string; price: number }; quantity: number }) => ({
      order_id: order.id,
      product_id: item.product.id,
      quantity: item.quantity,
      price: item.product.price,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Error creating order items:', itemsError)
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId: order.id,
    })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
