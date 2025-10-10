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

// Original Unsplash URLs without size restrictions
const projectImageMap = {
  "sustainable-housing-complex": "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?fit=crop",
  "green-office-tower": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?fit=crop",
  "transit-oriented-development": "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?fit=crop",
  "eco-friendly-retail-center": "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?fit=crop",
  "carbon-neutral-campus": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?fit=crop",
  "smart-transportation-hub": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?fit=crop",
  "renewable-energy-facility": "https://images.unsplash.com/photo-1466611653911-95081537e5b7?fit=crop",
  "sustainable-community-center": "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?fit=crop",
  "green-infrastructure-park": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?fit=crop",
  "eco-innovation-lab": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?fit=crop"
}

async function updateProjectImages() {
  try {
    console.log('🔄 Starting image update process...')
    
    // Fetch all projects
    const projects = await client.fetch(`*[_type == "project"] {
      _id,
      name,
      slug
    }`)
    
    console.log(`📋 Found ${projects.length} projects to update`)
    
    for (const project of projects) {
      const slug = project.slug?.current
      if (!slug || !projectImageMap[slug]) {
        console.log(`⚠️  Skipping ${project.name} - no image mapping found`)
        continue
      }
      
      console.log(`🖼️  Updating images for: ${project.name}`)
      
      // Download the image first
      const imageUrl = projectImageMap[slug]
      console.log(`📥 Downloading image from: ${imageUrl}`)
      
      const response = await fetch(imageUrl)
      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.statusText}`)
      }
      
      const imageBuffer = await response.buffer()
      console.log(`📦 Downloaded ${imageBuffer.length} bytes`)
      
      // Upload to Sanity
      const imageAsset = await client.assets.upload('image', imageBuffer, {
        filename: `${slug}-hero.jpg`
      })
      
      // Update the project with new photo gallery
      await client
        .patch(project._id)
        .set({
          photoGallery: [{
            _type: 'galleryImage',
            image: {
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: imageAsset._id
              },
              alt: `${project.name} - High resolution image`
            },
            caption: `High resolution image for ${project.name}`,
            isFeatured: true
          }]
        })
        .commit()
      
      console.log(`✅ Updated ${project.name}`)
    }
    
    console.log('🎉 All project images updated successfully!')
    
  } catch (error) {
    console.error('❌ Error updating project images:', error)
  }
}

// Run the update
updateProjectImages()
