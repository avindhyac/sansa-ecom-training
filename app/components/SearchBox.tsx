'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { searchClient, ALGOLIA_INDEX_NAME } from '@/lib/algolia'

interface SearchHit {
  objectID: string
  name: string
  description: string
  price: number
  image_url: string
  inventory_count: number
}

export default function SearchBox() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchHit[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Search with Algolia
  useEffect(() => {
    const searchProducts = async () => {
      if (query.length < 2) {
        setResults([])
        return
      }

      setIsLoading(true)
      try {
        const { results } = await searchClient.search({
          requests: [
            {
              indexName: ALGOLIA_INDEX_NAME,
              query: query,
              hitsPerPage: 5,
            },
          ],
        })

        const firstResult = results[0]
        if ('hits' in firstResult) {
          setResults(firstResult.hits as SearchHit[])
        } else {
          setResults([])
        }
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }

    const debounce = setTimeout(() => {
      searchProducts()
    }, 300)

    return () => clearTimeout(debounce)
  }, [query])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleProductClick = (productId: string) => {
    router.push(`/products/${productId}`)
    setQuery('')
    setIsOpen(false)
    setResults([])
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setIsOpen(false)
  }

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-subtle" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search products..."
          className="w-full bg-background-soft border border-border-subtle rounded-xl pl-12 pr-12 py-3 text-sm text-foreground placeholder:text-foreground-subtle focus:outline-none focus:border-jade focus:ring-2 focus:ring-jade/20 transition-all"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground-subtle hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background-elevated border border-border-subtle rounded-xl shadow-2xl shadow-black/50 max-h-96 overflow-y-auto z-50">
          {isLoading ? (
            <div className="p-4 text-center text-foreground-muted">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-jade mx-auto mb-2"></div>
              Searching...
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((product) => (
                <button
                  key={product.objectID}
                  onClick={() => handleProductClick(product.objectID)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-background-soft transition-colors text-left"
                >
                  <div className="relative w-12 h-12 bg-background-soft rounded-lg flex-shrink-0 overflow-hidden">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-foreground-subtle text-xs">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground font-medium truncate">
                      {product.name}
                    </p>
                    <p className="text-foreground-muted text-sm truncate">
                      {product.description || 'No description'}
                    </p>
                  </div>
                  <div className="text-jade font-bold text-lg flex-shrink-0">
                    ${product.price.toFixed(2)}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-foreground-muted">
              No products found for &quot;{query}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  )
}
