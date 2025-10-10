import { json } from '@sveltejs/kit'
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '80je9ukv',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-01-15',
  perspective: 'published',
})

export async function GET() {
  try {
    const cities = await client.fetch(`*[_type == "city"] | order(name asc) {
      _id,
      name
    }`)
    
    return json(cities)
  } catch (error) {
    console.error('Error fetching cities:', error)
    return json({ error: 'Failed to fetch cities' }, { status: 500 })
  }
}
