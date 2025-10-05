import { algoliasearch } from 'algoliasearch'

if (!process.env.NEXT_PUBLIC_ALGOLIA_APP_ID) {
  throw new Error('NEXT_PUBLIC_ALGOLIA_APP_ID is not defined')
}

if (!process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY) {
  throw new Error('NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY is not defined')
}

// Client-side search client (read-only)
export const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY
)

// Server-side admin client (for indexing)
export function getAdminClient() {
  if (!process.env.ALGOLIA_ADMIN_API_KEY) {
    throw new Error('ALGOLIA_ADMIN_API_KEY is not defined')
  }

  return algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
    process.env.ALGOLIA_ADMIN_API_KEY
  )
}

export const ALGOLIA_INDEX_NAME = 'products'
