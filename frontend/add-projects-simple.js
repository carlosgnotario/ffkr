// Simple script to add dummy projects to Sanity
// Run this in your browser console on the Sanity Studio page

const dummyProjects = [
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

console.log('Dummy projects data ready to add:')
console.log(dummyProjects)

// Instructions for manual addition:
console.log(`
To add these projects manually in Sanity Studio:

1. Go to https://ffkr.sanity.studio/
2. Click "Create" → "Project"
3. For each project above, fill in:
   - Project Name: ${dummyProjects[0].name}
   - Description: ${dummyProjects[0].description}
   - Location: ${dummyProjects[0].location}
   - Status: ${dummyProjects[0].status}
   - Category: Select the appropriate category
   - Slug: ${dummyProjects[0].slug}
4. Repeat for all ${dummyProjects.length} projects
5. Publish each project

Projects to add:
${dummyProjects.map((p, i) => `${i + 1}. ${p.name} (${p.category})`).join('\n')}
`)
