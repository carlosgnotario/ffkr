import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '80je9ukv',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
  apiVersion: '2024-01-15'
})

// Unsplash placeholder images
const placeholderImages = {
  projects: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
  history: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
  culture: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop'
}

async function downloadAndUploadImage(url, filename) {
  try {
    console.log(`Downloading ${filename}...`)
    const response = await fetch(url)
    const imageBuffer = await response.arrayBuffer()
    
    const imageAsset = await client.assets.upload('image', Buffer.from(imageBuffer), {
      filename: filename
    })
    
    console.log(`Uploaded ${filename}: ${imageAsset._id}`)
    return imageAsset
  } catch (error) {
    console.error(`Error uploading ${filename}:`, error)
    return null
  }
}

async function updateSiteSettings() {
  try {
    console.log('Starting site settings update...')
    console.log('Fetching current site settings...')
    
    // Get current site settings
    const currentSettings = await client.fetch(`*[_type == "siteSettings"][0]`)
    
    if (!currentSettings) {
      console.log('No site settings found, creating new one...')
      return
    }
    
    console.log('Found existing site settings:', currentSettings._id)
    
    console.log('Downloading and uploading placeholder images...')
    
    // Download and upload placeholder images
    const projectsImage = await downloadAndUploadImage(placeholderImages.projects, 'projects-navigation.jpg')
    const historyImage = await downloadAndUploadImage(placeholderImages.history, 'history-navigation.jpg')
    const cultureImage = await downloadAndUploadImage(placeholderImages.culture, 'culture-navigation.jpg')
    
    // Update navigation structure with images
    const newNavigation = [
      {
        title: 'Projects',
        url: '/studio',
        description: 'Explore our portfolio of architectural projects',
        image: projectsImage ? {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: projectsImage._id
          },
          alt: 'Projects'
        } : null
      },
      {
        title: 'History',
        url: '/history',
        description: 'Learn about our company history and journey',
        image: historyImage ? {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: historyImage._id
          },
          alt: 'History'
        } : null
      },
      {
        title: 'Culture',
        url: '/culture',
        description: 'Discover our company culture and values',
        image: cultureImage ? {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: cultureImage._id
          },
          alt: 'Culture'
        } : null
      }
    ]
    
    console.log('Updating site settings with new navigation...')
    
    // Update the site settings
    const updatedSettings = await client
      .patch(currentSettings._id)
      .set({
        navigation: newNavigation
      })
      .commit()
    
    console.log('Site settings updated successfully!')
    console.log('New navigation structure:')
    newNavigation.forEach(item => {
      console.log(`- ${item.title}: ${item.url}`)
    })
    
  } catch (error) {
    console.error('Error updating site settings:', error)
  }
}

// Run the update
updateSiteSettings()
