import { createClient } from '@sanity/client'
import fetch from 'node-fetch'

// Initialize Sanity client
const client = createClient({
  projectId: '80je9ukv',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-15',
  token: process.env.SANITY_TOKEN || process.env.SANITY_STUDIO_TOKEN
})

// Project data - 10 more projects using existing categories with images
const projects = [
  {
    name: "Sustainable Housing Complex",
    description: "Affordable housing development featuring sustainable materials, energy-efficient systems, and community spaces for residents.",
    location: "Residential District, Metro City",
    status: "planning",
    category: "Residential Architecture",
    slug: "sustainable-housing-complex",
    imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
    imageAlt: "Sustainable residential complex with green features"
  },
  {
    name: "Green Office Tower",
    description: "LEED-certified commercial building with integrated green technologies, rooftop gardens, and sustainable energy systems.",
    location: "Business District, Metro City",
    status: "in-progress",
    category: "Commercial Design",
    slug: "green-office-tower",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
    imageAlt: "Modern green office building with sustainable design"
  },
  {
    name: "Transit-Oriented Development",
    description: "Mixed-use development centered around public transportation hubs, promoting walkability and reducing car dependency.",
    location: "Transit Hub, Metro City",
    status: "planning",
    category: "Urban Planning",
    slug: "transit-oriented-development",
    imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
    imageAlt: "Transit-oriented urban development"
  },
  {
    name: "Eco-Friendly Retail Center",
    description: "Sustainable shopping complex with renewable energy systems, water recycling, and green building materials.",
    location: "Shopping District, Metro City",
    status: "in-progress",
    category: "Commercial Design",
    slug: "eco-friendly-retail-center",
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
    imageAlt: "Eco-friendly retail center with sustainable design"
  },
  {
    name: "Net-Zero Energy Homes",
    description: "Residential development featuring homes that produce as much energy as they consume through solar panels and energy-efficient design.",
    location: "Green Suburb, Metro City",
    status: "completed",
    category: "Residential Architecture",
    slug: "net-zero-energy-homes",
    imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
    imageAlt: "Net-zero energy residential homes"
  },
  {
    name: "Urban Green Corridor",
    description: "Linear park system connecting neighborhoods with bike paths, walking trails, and native plant landscaping.",
    location: "Metro City Corridor",
    status: "in-progress",
    category: "Urban Planning",
    slug: "urban-green-corridor",
    imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
    imageAlt: "Urban green corridor with bike paths and landscaping"
  },
  {
    name: "Sustainable Community Center",
    description: "Multi-purpose community facility with renewable energy systems, rainwater harvesting, and sustainable materials throughout.",
    location: "Community District, Metro City",
    status: "planning",
    category: "Sustainable Design",
    slug: "sustainable-community-center",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop",
    imageAlt: "Sustainable community center building"
  },
  {
    name: "Modern Residential Tower",
    description: "High-rise residential building with contemporary design, energy-efficient systems, and panoramic city views.",
    location: "Downtown Heights, Metro City",
    status: "in-progress",
    category: "Residential Architecture",
    slug: "modern-residential-tower",
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
    imageAlt: "Modern residential tower with city views"
  },
  {
    name: "Smart Business District",
    description: "Technology-integrated commercial area with smart lighting, waste management systems, and digital infrastructure.",
    location: "Tech Business District, Metro City",
    status: "planning",
    category: "Commercial Design",
    slug: "smart-business-district",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop",
    imageAlt: "Smart business district with technology integration"
  },
  {
    name: "Carbon-Neutral Campus",
    description: "Educational facility designed for zero carbon footprint with renewable energy, sustainable materials, and green spaces.",
    location: "University District, Metro City",
    status: "completed",
    category: "Sustainable Design",
    slug: "carbon-neutral-campus",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    imageAlt: "Carbon-neutral educational campus"
  }
]

async function getCategoryReference(categoryName) {
  try {
    const category = await client.fetch(`*[_type == "category" && title == $name][0] { _id }`, { name: categoryName })
    return category ? { _type: 'reference', _ref: category._id } : null
  } catch (error) {
    console.error(`❌ Error finding category "${categoryName}":`, error.message)
    return null
  }
}

async function uploadImageFromUrl(imageUrl, altText) {
  try {
    console.log(`📸 Uploading image: ${imageUrl}`)
    
    // Fetch the image
    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`)
    }
    
    const imageBuffer = await response.arrayBuffer()
    
    // Upload to Sanity
    const asset = await client.assets.upload('image', Buffer.from(imageBuffer), {
      filename: `project-${Date.now()}.jpg`,
      title: altText
    })
    
    console.log(`✅ Image uploaded: ${asset._id}`)
    return asset
  } catch (error) {
    console.error(`❌ Error uploading image:`, error.message)
    return null
  }
}

async function addProjects() {
  try {
    console.log('🚀 Adding projects to Sanity...')
    
    // Get all categories first
    const categories = await client.fetch(`*[_type == "category"] { _id, title }`)
    console.log('📋 Available categories:', categories.map(c => c.title))
    
    // Create projects in batches
    const batchSize = 2
    const batches = []
    
    for (let i = 0; i < projects.length; i += batchSize) {
      batches.push(projects.slice(i, i + batchSize))
    }
    
    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex]
      console.log(`\n📦 Processing batch ${batchIndex + 1}/${batches.length}`)
      
      const transaction = client.transaction()
      
      for (const project of batch) {
        try {
          console.log(`📝 Creating: ${project.name}`)
          
          // Get category reference
          const categoryRef = await getCategoryReference(project.category)
          if (!categoryRef) {
            console.log(`⚠️  Category "${project.category}" not found, skipping`)
            continue
          }
          
          // Upload image if provided
          let imageAsset = null
          if (project.imageUrl) {
            imageAsset = await uploadImageFromUrl(project.imageUrl, project.imageAlt)
          }
          
          // Create project document
          const projectDoc = {
            _type: 'project',
            name: project.name,
            description: project.description,
            location: project.location,
            status: project.status,
            category: categoryRef,
            slug: {
              _type: 'slug',
              current: project.slug
            },
            completionDate: project.status === 'completed' ? new Date().toISOString().split('T')[0] : null
          }
          
          // Add photo gallery if image was uploaded
          if (imageAsset) {
            projectDoc.photoGallery = [
              {
                _type: 'galleryImage',
                image: {
                  _type: 'image',
                  asset: {
                    _type: 'reference',
                    _ref: imageAsset._id
                  },
                  alt: project.imageAlt
                },
                caption: project.imageAlt,
                isFeatured: true
              }
            ]
          }
          
          transaction.create(projectDoc)
          console.log(`✅ Queued: ${project.name}`)
          
        } catch (error) {
          console.error(`❌ Error with ${project.name}:`, error.message)
        }
      }
      
      // Commit batch
      try {
        const result = await transaction.commit()
        console.log(`🎉 Batch ${batchIndex + 1} committed! Created ${result.length} projects`)
      } catch (error) {
        console.error(`❌ Error committing batch:`, error.message)
      }
      
      // Wait between batches
      if (batchIndex < batches.length - 1) {
        console.log('⏳ Waiting 1 second...')
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
    
    console.log('\n🎉 All projects added successfully!')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.log('\n💡 Make sure you have SANITY_TOKEN set in your environment')
  }
}

// Run the script
addProjects()
