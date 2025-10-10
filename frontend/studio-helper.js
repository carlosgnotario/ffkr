// Sanity Studio Helper Script
// Run this in the browser console while on your Sanity Studio page

console.log('🚀 Sanity Studio Project Helper')
console.log('📍 Make sure you are on: https://ffkr.sanity.studio/')

// Check if we're on the right page
if (!window.location.href.includes('sanity.studio')) {
  console.error('❌ Please navigate to your Sanity Studio first: https://ffkr.sanity.studio/')
} else {
  console.log('✅ Sanity Studio detected!')
}

// Project data
const projectData = [
  {
    name: "Downtown Urban Renewal",
    description: "A comprehensive urban planning project focused on revitalizing the downtown core with sustainable design principles and community engagement.",
    location: "Downtown District, Metro City",
    status: "in-progress",
    category: "Urban Planning",
    slug: "downtown-urban-renewal"
  },
  {
    name: "Green Infrastructure Network",
    description: "Development of an integrated green infrastructure system connecting parks, bike lanes, and sustainable transportation options across the city.",
    location: "Metro City, Regional Area",
    status: "planning", 
    category: "Environmental Design",
    slug: "green-infrastructure-network"
  },
  {
    name: "Historic District Preservation",
    description: "Comprehensive preservation and adaptive reuse plan for the historic downtown district, maintaining architectural heritage while enabling modern functionality.",
    location: "Historic Downtown, Metro City",
    status: "completed",
    category: "Heritage Conservation",
    slug: "historic-district-preservation"
  },
  {
    name: "Smart City Technology Hub", 
    description: "Implementation of smart city technologies including IoT sensors, data analytics, and citizen engagement platforms to improve urban services.",
    location: "Tech District, Metro City",
    status: "in-progress",
    category: "Smart Cities",
    slug: "smart-city-technology-hub"
  },
  {
    name: "Waterfront Development",
    description: "Mixed-use waterfront development featuring residential, commercial, and recreational spaces with sustainable design and flood resilience.",
    location: "Waterfront District, Metro City", 
    status: "planning",
    category: "Urban Planning",
    slug: "waterfront-development"
  }
]

// Function to help create projects
function createProjectHelper() {
  console.log('\n📝 PROJECT CREATION HELPER')
  console.log('='.repeat(50))
  
  projectData.forEach((project, index) => {
    console.log(`\n${index + 1}. ${project.name}`)
    console.log(`   📍 Location: ${project.location}`)
    console.log(`   📊 Status: ${project.status}`)
    console.log(`   🏷️  Category: ${project.category}`)
    console.log(`   🔗 Slug: ${project.slug}`)
    console.log(`   📄 Description: ${project.description}`)
  })
  
  console.log('\n🎯 STEP-BY-STEP INSTRUCTIONS:')
  console.log('1. Click "Create" button in Sanity Studio')
  console.log('2. Select "Project" from the list')
  console.log('3. Fill in the fields using the data above')
  console.log('4. Click "Publish" when done')
  console.log('5. Repeat for each project')
  
  return projectData
}

// Run the helper
const projects = createProjectHelper()

// Make data available globally
window.sanityProjects = projects
window.createProjectHelper = createProjectHelper

console.log('\n💾 Helper functions available:')
console.log('- window.sanityProjects (project data)')
console.log('- window.createProjectHelper() (run again)')

// Try to detect if we can interact with Sanity Studio
if (typeof window !== 'undefined') {
  console.log('\n🔍 Looking for Sanity Studio elements...')
  
  // Check for common Sanity Studio elements
  const sanityElements = document.querySelectorAll('[data-testid], [class*="sanity"], [class*="studio"]')
  if (sanityElements.length > 0) {
    console.log(`✅ Found ${sanityElements.length} Sanity Studio elements`)
  } else {
    console.log('⚠️  Sanity Studio elements not detected - make sure you are on the studio page')
  }
}
