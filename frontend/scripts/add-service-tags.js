import { createClient } from '@sanity/client'

// Initialize Sanity client
const client = createClient({
  projectId: '80je9ukv',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-15',
  token: process.env.SANITY_TOKEN || process.env.SANITY_STUDIO_TOKEN
})

// Service tags pool - realistic architectural services
const serviceTags = [
  'Full Architectural Services',
  'Building Analysis',
  'Construction Administration',
  'Design Development',
  'Site Planning',
  'Urban Design',
  'Sustainability Consulting',
  'Code Compliance Review',
  'Project Management',
  'Feasibility Studies',
  'Master Planning',
  'Interior Design',
  'Landscape Architecture',
  'Structural Engineering Coordination',
  'MEP Coordination',
  'LEED Certification',
  'Historic Preservation',
  'Community Engagement',
  'Zoning Analysis',
  'Cost Estimation',
  '3D Visualization',
  'Building Information Modeling',
  'Energy Modeling',
  'Accessibility Compliance',
  'Permit Processing'
]

// Function to get random services (2-5 per project)
function getRandomServices() {
  const numServices = Math.floor(Math.random() * 4) + 2 // 2-5 services
  const shuffled = [...serviceTags].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, numServices)
}

async function addServiceTags() {
  try {
    console.log('🏷️  Starting service tags addition...')
    
    // Fetch all projects
    const projects = await client.fetch(`*[_type == "project"] {
      _id,
      name
    }`)
    
    console.log(`📋 Found ${projects.length} projects to update`)
    
    for (const project of projects) {
      const services = getRandomServices()
      
      console.log(`🏗️  Adding services to: ${project.name}`)
      console.log(`   Services: ${services.join(', ')}`)
      
      // Update the project with services
      await client
        .patch(project._id)
        .set({
          services: services
        })
        .commit()
      
      console.log(`✅ Updated ${project.name}`)
    }
    
    console.log('🎉 All projects updated with service tags!')
    
  } catch (error) {
    console.error('❌ Error adding service tags:', error)
  }
}

// Run the script
addServiceTags()
