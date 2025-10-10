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

export const GET: RequestHandler = async ({ params }) => {
  try {
    const post = await client.fetch(`*[_type == "post" && slug.current == $slug][0] {
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
    }`, { slug: params.slug })
    
    if (!post) {
      return json({ error: 'Post not found' }, { status: 404 })
    }
    
    return json(post)
  } catch (error) {
    console.error('Error fetching post:', error)
    return json({ error: 'Failed to fetch post' }, { status: 500 })
  }
}
