// Browser Console Script - No Authentication Required
// Run this in your browser console while on the Sanity Studio page

console.log('🚀 Sanity Studio Project Creation Script')
console.log('📋 This script will help you create projects using the Studio interface')

// Project data with only existing schema fields
const projectData = [
  {
    name: "Downtown Urban Renewal",
    description: "A comprehensive urban planning project focused on revitalizing the downtown core with sustainable design principles and community engagement.",
    location: "Downtown District, Metro City",
    status: "in-progress",
    category: "Urban Planning", // You'll need to select the actual category
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

console.log('📝 Project data ready:')
projectData.forEach((project, index) => {
  console.log(`${index + 1}. ${project.name} (${project.category}) - ${project.status}`)
})

console.log(`
🎯 MANUAL CREATION INSTRUCTIONS:

1. Go to your Sanity Studio: https://ffkr.sanity.studio/
2. Click "Create" → "Project"
3. For each project above, fill in these fields:

   Project Name: [Copy from list above]
   Description: [Copy from list above] 
   Location: [Copy from list above]
   Status: [Select from dropdown: planning, in-progress, completed, on-hold]
   Category: [Select from existing categories dropdown]
   Slug: [Copy from list above]
   
4. Optionally add:
   - Team Members (select from existing team members)
   - Photo Gallery (upload images)
   - Similar Projects (if needed)
   
5. Click "Publish"
6. Repeat for all ${projectData.length} projects

📋 Available Status Options:
- planning
- in-progress  
- completed
- on-hold

✅ This will create projects that match your existing schema exactly!
`)

// Make data available for copying
window.projectData = projectData
console.log('💾 Project data saved to window.projectData for easy copying')
