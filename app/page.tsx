import { createClient } from '@/lib/supabase/server'
import Header from './components/Header'
import ProductGrid from './components/ProductGrid'
import { Sparkles, Shield, Zap, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()

  // Fetch products from Supabase
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
  }

  const allProducts = products || []

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-jade/10 via-transparent to-accent-purple/10 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-jade/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-jade/10 border border-jade/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-jade" />
              <span className="text-sm text-jade font-medium">New Collection Available</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              Discover Products
              <br />
              <span className="gradient-text">You&apos;ll Love</span>
            </h1>

            <p className="text-lg md:text-xl text-foreground-muted max-w-2xl mx-auto mb-10">
              Shop premium quality products with secure payments, fast delivery, and an exceptional shopping experience designed just for you.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="#products"
                className="group bg-jade hover:bg-jade-dark text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-jade/20 flex items-center gap-2"
              >
                Shop Now
                <TrendingUp className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="glass text-foreground font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 border-y border-border-subtle bg-background-elevated/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center group">
              <div className="w-14 h-14 bg-jade/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-jade" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Secure Payments</h3>
              <p className="text-sm text-foreground-muted">
                Shop with confidence using our encrypted payment system
              </p>
            </div>

            <div className="flex flex-col items-center text-center group">
              <div className="w-14 h-14 bg-accent-purple/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-accent-purple" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Fast Delivery</h3>
              <p className="text-sm text-foreground-muted">
                Get your orders delivered quickly and reliably
              </p>
            </div>

            <div className="flex flex-col items-center text-center group">
              <div className="w-14 h-14 bg-accent-blue/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7 text-accent-blue" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Premium Quality</h3>
              <p className="text-sm text-foreground-muted">
                Curated selection of high-quality products
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <main id="products" className="container mx-auto px-4 py-20">
        <div className="mb-12 text-center animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Featured Products
          </h2>
          <p className="text-foreground-muted text-lg max-w-2xl mx-auto">
            Explore our handpicked selection of trending items
          </p>
        </div>

        {allProducts.length > 0 ? (
          <div className="animate-scale-in">
            <ProductGrid initialProducts={allProducts} />
          </div>
        ) : (
          <div className="text-center py-20 glass rounded-2xl">
            <p className="text-foreground-muted text-lg">
              No products available at the moment. Please check back later.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle bg-background-elevated/50 py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-jade rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">E</span>
                </div>
                <span className="text-xl font-bold text-foreground">Ecommerce Store</span>
              </div>
              <p className="text-foreground-muted text-sm max-w-md">
                Your trusted destination for premium quality products. Shop with confidence and experience exceptional service.
              </p>
            </div>

            <div>
              <h4 className="text-foreground font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-foreground-muted">
                <li><Link href="/" className="hover:text-jade transition-colors">All Products</Link></li>
                <li><Link href="/cart" className="hover:text-jade transition-colors">Cart</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-foreground font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-foreground-muted">
                <li><a href="#" className="hover:text-jade transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-jade transition-colors">FAQs</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border-subtle pt-8 text-center">
            <p className="text-foreground-subtle text-sm">
              &copy; 2025 Ecommerce Store. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
