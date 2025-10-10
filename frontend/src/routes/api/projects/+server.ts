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
    const projects = await client.fetch(`*[_type == "project"] | order(name asc) {
      _id,
      name,
      description,
      location,
      status,
      completionDate,
      "slug": slug.current,
      services,
      category->{
        _id,
        title,
        "slug": slug.current
      },
      team[]->{
        _id,
        name,
        role,
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
      },
      photoGallery[]{
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
        caption,
        isFeatured
      }
    }`)
    
    return json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}
