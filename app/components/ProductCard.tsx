import { Product } from '@/lib/types/database'
import Image from 'next/image'

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="bg-foreground/5 rounded-lg overflow-hidden border border-foreground/10 hover:border-jade transition-colors group">
      <div className="relative aspect-square bg-foreground/10">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-foreground/30">
            No Image
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-foreground mb-1">
          {product.name}
        </h3>
        <p className="text-sm text-foreground/70 mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-jade">
            ${product.price.toFixed(2)}
          </span>
          {product.inventory_count > 0 ? (
            <button
              onClick={() => onAddToCart(product)}
              className="bg-jade hover:bg-jade-dark text-white font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Add to Cart
            </button>
          ) : (
            <span className="text-foreground/50 text-sm">Out of Stock</span>
          )}
        </div>
        {product.inventory_count > 0 && product.inventory_count <= 10 && (
          <p className="text-xs text-jade-light mt-2">
            Only {product.inventory_count} left!
          </p>
        )}
      </div>
    </div>
  )
}
