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
    const categories = await client.fetch(`*[_type == "category"] | order(title asc) {
      _id,
      title,
      slug,
      description,
      color,
      stats,
      achievements,
      teamMembers[]->{
        _id,
        name,
        role,
        description,
        credentials,
        location->{
          _id,
          name,
          country
        },
        photo {
          asset->{
            _id,
            url,
            metadata {
              dimensions
            }
          },
          alt
        }
      }
    }`)
    
    return json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}
