import { createClient } from '@/lib/supabase/server'
import Header from '@/app/components/Header'
import Breadcrumb from '@/app/components/Breadcrumb'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Shield, Truck, RefreshCw, Star, ShoppingBag, Heart } from 'lucide-react'
import Link from 'next/link'
import AddToCartButton from '@/app/components/AddToCartButton'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch product details
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !product) {
    notFound()
  }

  // Fetch related products (same category or random)
  const { data: relatedProducts } = await supabase
    .from('products')
    .select('*')
    .neq('id', id)
    .limit(4)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: 'Products', href: '/#products' },
            { label: product.name },
          ]}
        />

        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Product Image */}
          <div className="relative">
            <div className="sticky top-24">
              <div className="relative aspect-square bg-background-soft rounded-3xl overflow-hidden border border-border-subtle group">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-foreground-subtle">
                    <ShoppingBag className="w-32 h-32 opacity-20" />
                  </div>
                )}

                {/* Stock Badge */}
                {product.inventory_count > 0 && product.inventory_count <= 10 && (
                  <div className="absolute top-6 left-6 bg-jade/90 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-full">
                    Only {product.inventory_count} left in stock!
                  </div>
                )}

                {product.inventory_count === 0 && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground mb-2">Out of Stock</p>
                      <p className="text-foreground-muted">Check back soon</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="glass rounded-xl p-3 text-center">
                  <Shield className="w-6 h-6 text-jade mx-auto mb-1" />
                  <p className="text-xs text-foreground-muted">Secure</p>
                </div>
                <div className="glass rounded-xl p-3 text-center">
                  <Truck className="w-6 h-6 text-jade mx-auto mb-1" />
                  <p className="text-xs text-foreground-muted">Fast Ship</p>
                </div>
                <div className="glass rounded-xl p-3 text-center">
                  <RefreshCw className="w-6 h-6 text-jade mx-auto mb-1" />
                  <p className="text-xs text-foreground-muted">30-Day Return</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= 4
                          ? 'fill-jade text-jade'
                          : 'fill-foreground-subtle text-foreground-subtle'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-foreground-muted text-sm">(4.0) · 127 reviews</span>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-bold gradient-text">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-foreground-muted line-through text-xl">
                    ${(product.price * 1.2).toFixed(2)}
                  </span>
                  <span className="bg-jade/10 text-jade text-sm font-semibold px-3 py-1 rounded-full">
                    Save 20%
                  </span>
                </div>
                <p className="text-foreground-muted text-sm mt-2">
                  Tax included. Shipping calculated at checkout.
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">About this product</h3>
              <p className="text-foreground-muted leading-relaxed">
                {product.description ||
                  'Experience premium quality with this carefully crafted product. Designed with attention to detail and built to last, this item combines functionality with style to enhance your everyday life.'}
              </p>
            </div>

            {/* Key Features */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Key Features</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-jade/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-jade rounded-full" />
                  </div>
                  <span className="text-foreground-muted">Premium quality materials and construction</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-jade/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-jade rounded-full" />
                  </div>
                  <span className="text-foreground-muted">Modern design that fits any style</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-jade/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-jade rounded-full" />
                  </div>
                  <span className="text-foreground-muted">Built to last with durability in mind</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-jade/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-jade rounded-full" />
                  </div>
                  <span className="text-foreground-muted">Easy to use and maintain</span>
                </li>
              </ul>
            </div>

            {/* Add to Cart Section */}
            <div className="sticky bottom-0 bg-background/80 backdrop-blur-xl border border-border-subtle rounded-2xl p-6 space-y-4">
              {product.inventory_count > 0 ? (
                <>
                  <AddToCartButton product={product} />

                  <button className="w-full border border-border-muted text-foreground font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:border-jade hover:text-jade hover:scale-[1.02] flex items-center justify-center gap-2">
                    <Heart className="w-5 h-5" />
                    Add to Wishlist
                  </button>
                </>
              ) : (
                <button
                  disabled
                  className="w-full bg-foreground/10 text-foreground-subtle font-semibold px-8 py-4 rounded-xl cursor-not-allowed"
                >
                  Out of Stock
                </button>
              )}

              <div className="flex items-center justify-center gap-6 text-sm text-foreground-muted pt-4 border-t border-border-subtle">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  <span>Free shipping</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section className="py-12 border-t border-border-subtle">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">You might also like</h2>
              <p className="text-foreground-muted">Discover similar products</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/products/${relatedProduct.id}`}
                  className="group"
                >
                  <div className="bg-background-elevated rounded-2xl overflow-hidden border border-border-subtle hover:border-jade/50 transition-all duration-300 hover:shadow-xl hover:shadow-jade/10 hover:-translate-y-1">
                    <div className="relative aspect-square bg-background-soft">
                      {relatedProduct.image_url ? (
                        <Image
                          src={relatedProduct.image_url}
                          alt={relatedProduct.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-16 h-16 text-foreground-subtle opacity-20" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-foreground font-semibold mb-1 line-clamp-1 group-hover:text-jade transition-colors">
                        {relatedProduct.name}
                      </h3>
                      <p className="text-jade font-bold text-lg">
                        ${relatedProduct.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
