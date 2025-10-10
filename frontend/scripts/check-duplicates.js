import { createClient } from '@sanity/client'

// Initialize Sanity client
const client = createClient({
  projectId: '80je9ukv',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-15',
  token: process.env.SANITY_TOKEN || process.env.SANITY_STUDIO_TOKEN
})

async function checkDuplicates() {
  try {
    console.log('🔍 Checking for duplicate projects...')
    
    // Fetch all projects
    const projects = await client.fetch(`*[_type == "project"] | order(_createdAt asc) {
      _id,
      name,
      slug,
      _createdAt,
      category->{title}
    }`)
    
    console.log(`📊 Total projects found: ${projects.length}`)
    
    // Group by name to find duplicates
    const projectsByName = {}
    const projectsBySlug = {}
    
    projects.forEach(project => {
      // Group by name
      if (!projectsByName[project.name]) {
        projectsByName[project.name] = []
      }
      projectsByName[project.name].push(project)
      
      // Group by slug
      const slug = project.slug?.current
      if (slug) {
        if (!projectsBySlug[slug]) {
          projectsBySlug[slug] = []
        }
        projectsBySlug[slug].push(project)
      }
    })
    
    // Find duplicates by name
    const nameDuplicates = Object.entries(projectsByName)
      .filter(([name, projectList]) => projectList.length > 1)
      .map(([name, projectList]) => ({ name, projects: projectList }))
    
    // Find duplicates by slug
    const slugDuplicates = Object.entries(projectsBySlug)
      .filter(([slug, projectList]) => projectList.length > 1)
      .map(([slug, projectList]) => ({ slug, projects: projectList }))
    
    console.log('\n📋 DUPLICATE ANALYSIS:')
    console.log('='.repeat(50))
    
    if (nameDuplicates.length > 0) {
      console.log(`\n🔍 Duplicates by NAME (${nameDuplicates.length} groups):`)
      nameDuplicates.forEach(({ name, projects }) => {
        console.log(`\n📝 "${name}" (${projects.length} copies):`)
        projects.forEach((project, index) => {
          const created = new Date(project._createdAt).toLocaleDateString()
          console.log(`   ${index + 1}. ID: ${project._id} | Created: ${created} | Category: ${project.category?.title || 'N/A'}`)
        })
      })
    } else {
      console.log('\n✅ No duplicates found by name')
    }
    
    if (slugDuplicates.length > 0) {
      console.log(`\n🔍 Duplicates by SLUG (${slugDuplicates.length} groups):`)
      slugDuplicates.forEach(({ slug, projects }) => {
        console.log(`\n🔗 "${slug}" (${projects.length} copies):`)
        projects.forEach((project, index) => {
          const created = new Date(project._createdAt).toLocaleDateString()
          console.log(`   ${index + 1}. ID: ${project._id} | Name: ${project.name} | Created: ${created}`)
        })
      })
    } else {
      console.log('\n✅ No duplicates found by slug')
    }
    
    // Show all projects for reference
    console.log('\n📋 ALL PROJECTS:')
    console.log('='.repeat(50))
    projects.forEach((project, index) => {
      const created = new Date(project._createdAt).toLocaleDateString()
      console.log(`${index + 1}. ${project.name} (${project.slug?.current || 'no-slug'}) - ${project.category?.title || 'N/A'} - ${created}`)
    })
    
    return {
      totalProjects: projects.length,
      nameDuplicates,
      slugDuplicates,
      allProjects: projects
    }
    
  } catch (error) {
    console.error('❌ Error checking duplicates:', error.message)
    return null
  }
}

// Run the check
checkDuplicates()



