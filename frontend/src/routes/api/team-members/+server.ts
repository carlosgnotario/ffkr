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
    const teamMembers = await client.fetch(`*[_type == "teamMember" && !unlist] | order(order asc, name asc) {
      _id,
      name,
      role,
      description,
      credentials,
      photo {
        asset->{
          _id,
          url,
          metadata {
            dimensions
          }
        },
        alt
      },
      location->{
        _id,
        name,
        country
      },
      categories[]->{
        _id,
        title,
        slug,
        description
      }
    }`)
    
    return json(teamMembers)
  } catch (error) {
    console.error('Error fetching team members:', error)
    return json({ error: 'Failed to fetch team members' }, { status: 500 })
  }
}
