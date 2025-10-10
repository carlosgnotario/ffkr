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

// Generate unique images for each project using different sources
function generateUniqueImages(projectName, categoryName, projectIndex) {
  const baseImages = {
    'Urban Planning': [
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop'
    ],
    'Residential Architecture': [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop'
    ],
    'Commercial Design': [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop'
    ],
    'Sustainable Design': [
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'
    ]
  }

  // Additional unique image sources for variety
  const additionalSources = [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop'
  ]

  // Get base images for the category
  const categoryImages = baseImages[categoryName] || baseImages['Urban Planning']
  
  // Create unique set by mixing category images with additional sources
  // Use project index to ensure different projects get different images
  const uniqueImages = []
  const startIndex = (projectIndex * 4) % additionalSources.length
  
  for (let i = 0; i < 4; i++) {
    const sourceIndex = (startIndex + i) % additionalSources.length
    uniqueImages.push(additionalSources[sourceIndex])
  }
  
  return uniqueImages
}

async function uploadImageFromUrl(imageUrl, altText) {
  try {
    console.log(`📸 Uploading: ${altText}`)
    
    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`)
    }
    
    const imageBuffer = await response.arrayBuffer()
    
    const asset = await client.assets.upload('image', Buffer.from(imageBuffer), {
      filename: `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`,
      title: altText
    })
    
    console.log(`✅ Uploaded: ${asset._id}`)
    return asset
  } catch (error) {
    console.error(`❌ Error uploading image:`, error.message)
    return null
  }
}

async function addMissingImages() {
  try {
    console.log('🔍 Finding projects without images...')
    
    // Fetch all projects with their photo galleries
    const projects = await client.fetch(`*[_type == "project"] | order(_createdAt asc) {
      _id,
      name,
      category->{title},
      photoGallery
    }`)
    
    console.log(`📊 Total projects found: ${projects.length}`)
    
    // Find projects without images
    const projectsWithoutImages = projects.filter(project => 
      !project.photoGallery || project.photoGallery.length === 0
    )
    
    console.log(`📸 Projects without images: ${projectsWithoutImages.length}`)
    
    if (projectsWithoutImages.length === 0) {
      console.log('✅ All projects already have images!')
      return
    }
    
    // Show which projects need images
    console.log('\n📋 PROJECTS NEEDING IMAGES:')
    console.log('='.repeat(50))
    projectsWithoutImages.forEach((project, index) => {
      console.log(`${index + 1}. ${project.name} (${project.category?.title || 'No Category'})`)
    })
    
    // Process each project
    for (let i = 0; i < projectsWithoutImages.length; i++) {
      const project = projectsWithoutImages[i]
      const categoryName = project.category?.title || 'Urban Planning'
      
      console.log(`\n🔄 Processing ${i + 1}/${projectsWithoutImages.length}: ${project.name}`)
      
      // Generate unique images for this project
      const imageUrls = generateUniqueImages(project.name, categoryName, i)
      
      // Upload 3-4 images for this project
      const uploadedImages = []
      const imagesToUpload = imageUrls.slice(0, 4) // Take first 4 images
      
      for (let j = 0; j < imagesToUpload.length; j++) {
        const imageUrl = imagesToUpload[j]
        const altText = `${project.name} - Image ${j + 1}`
        
        const asset = await uploadImageFromUrl(imageUrl, altText)
        if (asset) {
          uploadedImages.push({
            _type: 'galleryImage',
            image: {
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: asset._id
              },
              alt: altText
            },
            caption: altText,
            isFeatured: j === 0 // First image is featured
          })
        }
        
        // Small delay between uploads
        await new Promise(resolve => setTimeout(resolve, 500))
      }
      
      // Update the project with the new images
      if (uploadedImages.length > 0) {
        try {
          await client
            .patch(project._id)
            .set({
              photoGallery: uploadedImages
            })
            .commit()
          
          console.log(`✅ Added ${uploadedImages.length} images to ${project.name}`)
        } catch (error) {
          console.error(`❌ Error updating ${project.name}:`, error.message)
        }
      }
      
      // Delay between projects
      if (i < projectsWithoutImages.length - 1) {
        console.log('⏳ Waiting 2 seconds before next project...')
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }
    
    console.log('\n🎉 Finished adding images to all projects!')
    
  } catch (error) {
    console.error('❌ Error adding images:', error.message)
  }
}

// Run the script
addMissingImages()
