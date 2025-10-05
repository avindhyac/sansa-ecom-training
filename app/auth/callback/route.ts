import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

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
          .single()

        if (!existingCustomer) {
          await supabase.from('customers').insert({
            id: user.id,
            email: user.email!,
            full_name: user.user_metadata.full_name || user.user_metadata.name || null,
          })
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
