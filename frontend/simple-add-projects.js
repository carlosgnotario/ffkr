// Simple Project Creation Helper
// Copy and paste this into your browser console while on Sanity Studio

console.log('🎯 Simple Project Creation Helper')
console.log('📝 Copy the data below and create projects manually in Sanity Studio')

const projects = [
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

// Display projects in an easy-to-copy format
console.log('\n📋 PROJECTS TO CREATE:')
console.log('='.repeat(50))

projects.forEach((project, index) => {
  console.log(`\n${index + 1}. ${project.name}`)
  console.log(`   Description: ${project.description}`)
  console.log(`   Location: ${project.location}`)
  console.log(`   Status: ${project.status}`)
  console.log(`   Category: ${project.category}`)
  console.log(`   Slug: ${project.slug}`)
  console.log('   ' + '-'.repeat(40))
})

console.log('\n🎯 INSTRUCTIONS:')
console.log('1. Go to https://ffkr.sanity.studio/')
console.log('2. Click "Create" → "Project"')
console.log('3. Fill in the fields above for each project')
console.log('4. Click "Publish"')
console.log('5. Repeat for all projects')

// Make data available
window.projects = projects
console.log('\n💾 Data saved to window.projects')
