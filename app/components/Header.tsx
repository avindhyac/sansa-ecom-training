import { createClient } from '@/lib/supabase/server'
import AuthButton from './AuthButton'
import Link from 'next/link'
import { ShoppingCart, Search, Sparkles } from 'lucide-react'

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
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-subtle" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full bg-background-soft border border-border-subtle rounded-xl pl-12 pr-4 py-3 text-sm text-foreground placeholder:text-foreground-subtle focus:outline-none focus:border-jade focus:ring-2 focus:ring-jade/20 transition-all"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex items-center gap-2 text-foreground hover:text-jade transition-colors group px-3 py-2 rounded-lg hover:bg-background-soft"
            >
              <div className="relative">
                <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                {/* Cart Badge - You can make this dynamic */}
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-jade text-white text-xs font-bold rounded-full flex items-center justify-center">
                  0
                </span>
              </div>
              <span className="hidden sm:block text-sm font-medium">Cart</span>
            </Link>

            {/* Auth Button */}
            <AuthButton user={user} />
          </div>
        </div>

        {/* Mobile Search - Shown on mobile */}
        <div className="md:hidden mt-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-subtle" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full bg-background-soft border border-border-subtle rounded-xl pl-12 pr-4 py-3 text-sm text-foreground placeholder:text-foreground-subtle focus:outline-none focus:border-jade focus:ring-2 focus:ring-jade/20 transition-all"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
