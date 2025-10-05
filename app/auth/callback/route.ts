import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { resend } from '@/lib/resend'
import { render } from '@react-email/render'
import WelcomeEmail from '@/emails/WelcomeEmail'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Get the user data
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // Check if customer exists, if not create one
        const { data: existingCustomer } = await supabase
          .from('customers')
          .select('*')
          .eq('id', user.id)
          .maybeSingle()

        const isNewCustomer = !existingCustomer

        if (isNewCustomer) {
          // Create customer record using admin client to bypass RLS
          const supabaseAdmin = createAdminClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            { auth: { autoRefreshToken: false, persistSession: false } }
          )

          const { error: customerError } = await supabaseAdmin.from('customers').upsert({
            id: user.id,
            email: user.email!,
            full_name: user.user_metadata.full_name || user.user_metadata.name || null,
          }, {
            onConflict: 'id'
          })

          if (customerError) {
            console.error('Error creating customer record:', customerError)
          } else {
            console.log('Customer record created for:', user.email)
          }

          // Send welcome email to new user
          try {
            const emailHtml = await render(
              WelcomeEmail({
                userName: user.user_metadata.full_name || user.user_metadata.name || 'there',
                userEmail: user.email!,
              })
            )

            const emailResult = await resend.emails.send({
              from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
              to: user.email!,
              subject: 'Welcome to Ecommerce Store! 🎉',
              html: emailHtml,
            })

            console.log('Welcome email sent to:', user.email, 'Result:', emailResult)
          } catch (emailError) {
            console.error('Error sending welcome email:', emailError)
          }
        } else {
          console.log('Returning user:', user.email)
        }
      }

      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
