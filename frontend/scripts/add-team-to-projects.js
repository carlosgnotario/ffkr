import { createClient } from '@sanity/client'

// Initialize Sanity client
const client = createClient({
  projectId: '80je9ukv',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-15',
  token: process.env.SANITY_TOKEN || process.env.SANITY_STUDIO_TOKEN
})

async function addTeamToProjects() {
  try {
    console.log('👥 Starting team assignment to projects...')
    
    // Fetch all projects and team members
    const [projects, teamMembers] = await Promise.all([
      client.fetch(`*[_type == "project"] {
        _id,
        name,
        team
      }`),
      client.fetch(`*[_type == "teamMember"] {
        _id,
        name
      }`)
    ])
    
    console.log(`📋 Found ${projects.length} projects and ${teamMembers.length} team members`)
    
    // Filter projects that don't have team members
    const projectsWithoutTeam = projects.filter(project => !project.team || project.team.length === 0)
    
    console.log(`🔍 Found ${projectsWithoutTeam.length} projects without team members`)
    
    for (const project of projectsWithoutTeam) {
      // Assign 1-3 random team members to each project
      const numMembers = Math.floor(Math.random() * 3) + 1 // 1-3 members
      const shuffled = [...teamMembers].sort(() => 0.5 - Math.random())
      const selectedMembers = shuffled.slice(0, numMembers)
      
      console.log(`👥 Adding team to: ${project.name}`)
      console.log(`   Team members: ${selectedMembers.map(m => m.name).join(', ')}`)
      
      // Update the project with team members
      await client
        .patch(project._id)
        .set({
          team: selectedMembers.map(member => ({
            _type: 'reference',
            _ref: member._id
          }))
        })
        .commit()
      
      console.log(`✅ Updated ${project.name}`)
    }
    
    console.log('🎉 All projects updated with team members!')
    
  } catch (error) {
    console.error('❌ Error adding team to projects:', error)
  }
}

// Run the script
addTeamToProjects()
