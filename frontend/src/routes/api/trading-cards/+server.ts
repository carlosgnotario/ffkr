import { json } from '@sveltejs/kit'
import { createClient } from '@sanity/client'
import type { RequestHandler } from './$types'

const client = createClient({
  projectId: '80je9ukv',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-01-15',
  perspective: 'published',
})

export const GET: RequestHandler = async () => {
  try {
    const tradingCards = await client.fetch(`*[_type == "tradingCards" && _id == "tradingCards"][0] {
      _id,
      title,
      gallery[] {
        asset->{
          _id,
          url,
          metadata {
            dimensions
          }
        },
        alt,
        caption
      }
    }`)
    
    if (!tradingCards) {
      return json({ gallery: [] })
    }
    
    return json(tradingCards)
  } catch (error) {
    console.error('Error fetching trading cards:', error)
    return json({ error: 'Failed to fetch trading cards' }, { status: 500 })
  }
}

