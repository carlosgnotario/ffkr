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
    const posts = await client.fetch(`*[_type == "post"] | order(publishedAt desc) [0...3] {
      _id,
      title,
      slug,
      publishedAt,
      image {
        asset->{
          _id,
          url,
          metadata {
            dimensions
          }
        },
        alt
      },
      body
    }`)
    
    return json(posts)
  } catch (error) {
    console.error('Error fetching featured posts:', error)
    return json({ error: 'Failed to fetch featured posts' }, { status: 500 })
  }
}
