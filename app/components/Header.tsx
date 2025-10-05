import { createClient } from '@/lib/supabase/server'
import AuthButton from './AuthButton'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'

export default async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="border-b border-foreground/10 bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-jade rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">E</span>
          </div>
          <span className="text-xl font-bold text-foreground">
            Ecommerce Store
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/cart"
            className="flex items-center gap-2 text-foreground hover:text-jade transition-colors"
          >
            <ShoppingCart className="w-6 h-6" />
            <span className="text-sm font-medium">Cart</span>
          </Link>
          <AuthButton user={user} />
        </div>
      </div>
    </header>
  )
}
