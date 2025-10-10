import { json } from '@sveltejs/kit'
import { createClient } from '@sanity/client'

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  
  const day = date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  
  // Add ordinal suffix to day
  const getOrdinalSuffix = (day: number): string => {
    if (day >= 11 && day <= 13) return 'th'
    switch (day % 10) {
      case 1: return 'st'
      case 2: return 'nd'
      case 3: return 'rd'
      default: return 'th'
    }
  }
  
  return `${month} ${day}${getOrdinalSuffix(day)}, ${year}`
}

const client = createClient({
  projectId: '80je9ukv',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-01-15',
  perspective: 'published',
})

export async function GET() {
  try {
    const siteSettings = await client.fetch(`*[_type == "siteSettings"][0] {
      _id,
      title,
      description,
      logo {
        asset->{
          _id,
          url,
          metadata {
            dimensions
          }
        },
        alt
      },
      navigation[] {
        title,
        url,
        description,
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
        children[] {
          title,
          url,
          description
        }
      },
      testimonialVideos[] {
        title,
        videoUrl,
        thumbnail {
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
      awards[] {
        name,
        date,
        "formattedDate": date,
        logo {
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
    
    // Format dates for awards
    if (siteSettings && siteSettings.awards) {
      siteSettings.awards = siteSettings.awards.map((award: any) => ({
        ...award,
        formattedDate: formatDate(award.date)
      }))
    }
    
    return json(siteSettings)
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return json({ error: 'Failed to fetch site settings' }, { status: 500 })
  }
}
