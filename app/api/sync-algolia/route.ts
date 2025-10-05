import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAdminClient, ALGOLIA_INDEX_NAME } from '@/lib/algolia'

export async function POST(request: Request) {
  try {
    // Get all products from Supabase
    const supabase = await createClient()
    const { data: products, error } = await supabase
      .from('products')
      .select('*')

    if (error) {
      console.error('Error fetching products:', error)
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      )
    }

    if (!products || products.length === 0) {
      return NextResponse.json(
        { message: 'No products to sync' },
        { status: 200 }
      )
    }

    // Format products for Algolia
    const algoliaProducts = products.map((product) => ({
      objectID: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image_url: product.image_url,
      inventory_count: product.inventory_count,
      created_at: product.created_at,
    }))

    // Sync to Algolia
    const algoliaClient = getAdminClient()

    await algoliaClient.saveObjects({
      indexName: ALGOLIA_INDEX_NAME,
      objects: algoliaProducts,
    })

    // Configure index settings for better search
    await algoliaClient.setSettings({
      indexName: ALGOLIA_INDEX_NAME,
      indexSettings: {
        searchableAttributes: [
          'name',
          'description',
        ],
        attributesForFaceting: [
          'price',
          'inventory_count',
        ],
        customRanking: [
          'desc(inventory_count)',
          'asc(price)',
        ],
      },
    })

    console.log(`Successfully synced ${products.length} products to Algolia`)

    return NextResponse.json({
      success: true,
      message: `Synced ${products.length} products to Algolia`,
    })
  } catch (error) {
    console.error('Error syncing to Algolia:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
