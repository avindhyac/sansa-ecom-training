import { createClient } from '@/lib/supabase/server'
import Header from './components/Header'
import ProductGrid from './components/ProductGrid'

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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Discover Our Latest Products
          </h1>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            Shop high-quality products with secure payments and fast delivery
          </p>
        </div>

        {products && products.length > 0 ? (
          <ProductGrid initialProducts={products} />
        ) : (
          <div className="text-center py-20">
            <p className="text-foreground/50 text-lg">
              No products available at the moment. Please check back later.
            </p>
          </div>
        )}
      </main>

      <footer className="border-t border-foreground/10 py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-foreground/60">
          <p>&copy; 2025 Ecommerce Store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
