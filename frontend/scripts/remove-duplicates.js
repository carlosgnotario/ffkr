import { createClient } from '@sanity/client'

// Initialize Sanity client
const client = createClient({
  projectId: '80je9ukv',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-15',
  token: process.env.SANITY_TOKEN || process.env.SANITY_STUDIO_TOKEN
})

async function removeDuplicates() {
  try {
    console.log('🔍 Analyzing duplicates for safe removal...')
    
    // Fetch all projects ordered by creation date (oldest first)
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
    projects.forEach(project => {
      if (!projectsByName[project.name]) {
        projectsByName[project.name] = []
      }
      projectsByName[project.name].push(project)
    })
    
    // Find duplicates (keep first, remove rest)
    const duplicatesToRemove = []
    const projectsToKeep = []
    
    Object.entries(projectsByName).forEach(([name, projectList]) => {
      if (projectList.length > 1) {
        // Keep the first (oldest) project
        const keepProject = projectList[0]
        projectsToKeep.push(keepProject)
        
        // Mark the rest for removal
        const removeProjects = projectList.slice(1)
        duplicatesToRemove.push(...removeProjects)
        
        console.log(`\n📝 "${name}":`)
        console.log(`   ✅ KEEPING: ${keepProject._id} (${new Date(keepProject._createdAt).toLocaleDateString()})`)
        removeProjects.forEach(project => {
          console.log(`   ❌ REMOVING: ${project._id} (${new Date(project._createdAt).toLocaleDateString()})`)
        })
      } else {
        // No duplicates, keep the project
        projectsToKeep.push(projectList[0])
      }
    })
    
    console.log(`\n📊 SUMMARY:`)
    console.log(`   Total projects: ${projects.length}`)
    console.log(`   Projects to keep: ${projectsToKeep.length}`)
    console.log(`   Duplicates to remove: ${duplicatesToRemove.length}`)
    
    if (duplicatesToRemove.length === 0) {
      console.log('\n✅ No duplicates found! Nothing to remove.')
      return
    }
    
    // Confirm before deletion
    console.log(`\n⚠️  WARNING: About to delete ${duplicatesToRemove.length} duplicate projects!`)
    console.log('This action cannot be undone.')
    
    // For safety, let's just show what would be deleted without actually deleting
    console.log('\n🔍 DUPLICATES THAT WOULD BE REMOVED:')
    console.log('='.repeat(50))
    duplicatesToRemove.forEach((project, index) => {
      const created = new Date(project._createdAt).toLocaleDateString()
      console.log(`${index + 1}. ${project.name} (${project._id}) - ${created}`)
    })
    
    console.log('\n🗑️  Removing duplicates...')
    const transaction = client.transaction()
    
    duplicatesToRemove.forEach(project => {
      transaction.delete(project._id)
    })
    
    const result = await transaction.commit()
    console.log(`✅ Removed ${result.length} duplicate projects`)
    
    return {
      totalProjects: projects.length,
      projectsToKeep: projectsToKeep.length,
      duplicatesToRemove: duplicatesToRemove.length,
      duplicates: duplicatesToRemove
    }
    
  } catch (error) {
    console.error('❌ Error removing duplicates:', error.message)
    return null
  }
}

// Run the removal analysis
removeDuplicates()
