import { createClient } from '@/lib/supabase/server'
import AuthButton from './AuthButton'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import SearchBox from './SearchBox'
import CartCounter from './CartCounter'

export default async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 bg-gradient-to-br from-jade to-jade-dark rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-jade/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-foreground block leading-tight">
                Ecommerce
              </span>
              <span className="text-xs text-foreground-muted">Premium Store</span>
            </div>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <SearchBox />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <CartCounter />

            {/* Auth Button */}
            <AuthButton user={user} />
          </div>
        </div>

        {/* Mobile Search - Shown on mobile */}
        <div className="md:hidden mt-3">
          <SearchBox />
        </div>
      </div>
    </header>
  )
}
