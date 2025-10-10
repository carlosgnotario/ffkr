// Copy and paste this entire script into your browser console
// Make sure you're on the Sanity Studio page (https://ffkr.sanity.studio/)

console.log('🚀 Starting to add dummy projects to Sanity Studio...')

// Dummy projects data
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
  },
  {
    name: "Community Health Center",
    description: "Design and development of a state-of-the-art community health center with integrated wellness programs and accessible design features.",
    location: "Health District, Metro City",
    status: "in-progress",
    category: "Healthcare Design",
    slug: "community-health-center"
  },
  {
    name: "Sustainable Housing Complex",
    description: "Affordable housing development featuring sustainable materials, energy-efficient systems, and community spaces for residents.",
    location: "Residential District, Metro City", 
    status: "planning",
    category: "Residential Design",
    slug: "sustainable-housing-complex"
  },
  {
    name: "Cultural Arts District",
    description: "Mixed-use cultural district featuring galleries, performance spaces, artist studios, and public art installations.",
    location: "Arts Quarter, Metro City",
    status: "completed",
    category: "Cultural Design", 
    slug: "cultural-arts-district"
  }
]

console.log(`📋 Ready to add ${projects.length} dummy projects:`)
projects.forEach((project, index) => {
  console.log(`${index + 1}. ${project.name} (${project.category}) - ${project.status}`)
})

console.log(`
📝 MANUAL ADDITION INSTRUCTIONS:

1. Go to your Sanity Studio: https://ffkr.sanity.studio/
2. Click "Create" → "Project" 
3. For each project above, fill in the following fields:

   Project Name: [Copy from list above]
   Description: [Copy from list above] 
   Location: [Copy from list above]
   Status: [Copy from list above]
   Category: [Select the matching category from dropdown]
   Slug: [Copy from list above]
   
4. Add a photo to the Photo Gallery section (optional)
5. Click "Publish" 
6. Repeat for all ${projects.length} projects

🎯 This will give you sample projects to test the studio page display!
`)

// Export the data for easy copying
window.dummyProjects = projects
console.log('💾 Projects data saved to window.dummyProjects for easy access')
