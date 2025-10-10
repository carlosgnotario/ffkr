import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '80je9ukv',
  dataset: 'production',
  useCdn: false, // We need to write data, so disable CDN
  apiVersion: '2024-01-15',
  token: process.env.SANITY_TOKEN, // You'll need to add this to your .env file
})

const dummyProjects = [
  {
    name: "Downtown Urban Renewal",
    description: "A comprehensive urban planning project focused on revitalizing the downtown core with sustainable design principles and community engagement.",
    location: "Downtown District, Metro City",
    status: "in-progress",
    category: "Urban Planning", // This will need to be a reference to the actual category
    photoGallery: [
      {
        image: {
          asset: {
            _type: "reference",
            _ref: "image-urban-1" // This would be a real image reference
          },
          alt: "Downtown aerial view"
        },
        caption: "Aerial view of downtown development",
        isFeatured: true
      }
    ],
    team: [], // Will be populated with team member references
    slug: {
      current: "downtown-urban-renewal"
    }
  },
  {
    name: "Green Infrastructure Network",
    description: "Development of an integrated green infrastructure system connecting parks, bike lanes, and sustainable transportation options across the city.",
    location: "Metro City, Regional Area",
    status: "planning",
    category: "Environmental Design",
    photoGallery: [
      {
        image: {
          asset: {
            _type: "reference", 
            _ref: "image-green-1"
          },
          alt: "Green infrastructure concept"
        },
        caption: "Green infrastructure concept design",
        isFeatured: true
      }
    ],
    team: [],
    slug: {
      current: "green-infrastructure-network"
    }
  },
  {
    name: "Historic District Preservation",
    description: "Comprehensive preservation and adaptive reuse plan for the historic downtown district, maintaining architectural heritage while enabling modern functionality.",
    location: "Historic Downtown, Metro City",
    status: "completed",
    category: "Heritage Conservation",
    photoGallery: [
      {
        image: {
          asset: {
            _type: "reference",
            _ref: "image-heritage-1"
          },
          alt: "Historic building facade"
        },
        caption: "Restored historic building facade",
        isFeatured: true
      }
    ],
    team: [],
    slug: {
      current: "historic-district-preservation"
    }
  },
  {
    name: "Smart City Technology Hub",
    description: "Implementation of smart city technologies including IoT sensors, data analytics, and citizen engagement platforms to improve urban services.",
    location: "Tech District, Metro City",
    status: "in-progress",
    category: "Smart Cities",
    photoGallery: [
      {
        image: {
          asset: {
            _type: "reference",
            _ref: "image-smart-1"
          },
          alt: "Smart city technology"
        },
        caption: "Smart city control center",
        isFeatured: true
      }
    ],
    team: [],
    slug: {
      current: "smart-city-technology-hub"
    }
  },
  {
    name: "Waterfront Development",
    description: "Mixed-use waterfront development featuring residential, commercial, and recreational spaces with sustainable design and flood resilience.",
    location: "Waterfront District, Metro City",
    status: "planning",
    category: "Urban Planning",
    photoGallery: [
      {
        image: {
          asset: {
            _type: "reference",
            _ref: "image-waterfront-1"
          },
          alt: "Waterfront development rendering"
        },
        caption: "Waterfront development concept",
        isFeatured: true
      }
    ],
    team: [],
    slug: {
      current: "waterfront-development"
    }
  }
]

async function addDummyProjects() {
  try {
    console.log('Starting to add dummy projects...')
    
    // First, get all categories to create proper references
    const categories = await client.fetch(`*[_type == "category"] { _id, title }`)
    console.log('Available categories:', categories)
    
    // Create a mapping of category names to IDs
    const categoryMap = {}
    categories.forEach(cat => {
      categoryMap[cat.title] = cat._id
    })
    
    // Add each project
    for (const project of dummyProjects) {
      try {
        // Find the category reference
        const categoryRef = categoryMap[project.category]
        if (!categoryRef) {
          console.log(`Category "${project.category}" not found, skipping project: ${project.name}`)
          continue
        }
        
        const projectData = {
          _type: 'project',
          name: project.name,
          description: project.description,
          location: project.location,
          status: project.status,
          category: {
            _type: 'reference',
            _ref: categoryRef
          },
          photoGallery: project.photoGallery,
          team: project.team,
          slug: project.slug,
          completionDate: project.status === 'completed' ? new Date().toISOString().split('T')[0] : null
        }
        
        const result = await client.create(projectData)
        console.log(`✅ Added project: ${project.name} (ID: ${result._id})`)
        
      } catch (error) {
        console.error(`❌ Error adding project ${project.name}:`, error.message)
      }
    }
    
    console.log('🎉 Finished adding dummy projects!')
    
  } catch (error) {
    console.error('❌ Error in addDummyProjects:', error)
  }
}

// Run the script
addDummyProjects()
