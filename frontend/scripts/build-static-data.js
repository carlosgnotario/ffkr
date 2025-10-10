import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'

// Initialize Sanity client
const client = createClient({
  projectId: '80je9ukv',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_TOKEN
})

async function buildStaticData() {
  console.log('🔄 Building static data...')
  
  try {
    // Fetch all data from Sanity
    const [projects, siteSettings, categories, cities, teamMembers] = await Promise.all([
      // Projects
      client.fetch(`*[_type == "project"] | order(name asc) {
        _id,
        name,
        description,
        location,
        status,
        completionDate,
        "slug": slug.current,
        services,
        selectSimilarProjectsManually,
        similarProjects[]->{
          _id,
          name,
          "slug": slug.current,
          photoGallery[0] {
            image {
              asset->{
                _id,
                url
              }
            }
          }
        },
        category->{
          _id,
          title,
          "slug": slug.current
        },
        team[]->{
          _id,
          name,
          role,
          description,
          credentials,
          location,
          photo {
            asset->{
              _id,
              url
            }
          }
        },
        photoGallery[] {
          image {
            asset->{
              _id,
              url
            }
          }
        }
      }`),
      
      // Site Settings
      client.fetch(`*[_type == "siteSettings"][0] {
        _id,
        logo {
          asset->{
            _id,
            url
          }
        },
        navigation[] {
          title,
          url,
          description,
          image {
            asset->{
              _id,
              url
            }
          }
        }
      }`),
      
      // Categories
      client.fetch(`*[_type == "category"] | order(title asc) {
        _id,
        title,
        "slug": slug.current
      }`),
      
      // Cities
      client.fetch(`*[_type == "city"] | order(name asc) {
        _id,
        name,
        "slug": slug.current
      }`),
      
      // Team Members
      client.fetch(`*[_type == "teamMember"] | order(name asc) {
        _id,
        name,
        role,
        description,
        credentials,
        location,
        photo {
          asset->{
            _id,
            url
          }
        }
      }`)
    ])

    // Create static directory in public folder for GitHub Pages
    const staticDir = path.join(process.cwd(), 'static', 'api')
    const publicDir = path.join(process.cwd(), 'static', 'api')
    
    if (!fs.existsSync(staticDir)) {
      fs.mkdirSync(staticDir, { recursive: true })
    }

    // Write static JSON files
    fs.writeFileSync(
      path.join(staticDir, 'projects.json'),
      JSON.stringify(projects, null, 2)
    )
    
    fs.writeFileSync(
      path.join(staticDir, 'site-settings.json'),
      JSON.stringify(siteSettings, null, 2)
    )
    
    fs.writeFileSync(
      path.join(staticDir, 'categories.json'),
      JSON.stringify(categories, null, 2)
    )
    
    fs.writeFileSync(
      path.join(staticDir, 'cities.json'),
      JSON.stringify(cities, null, 2)
    )
    
    fs.writeFileSync(
      path.join(staticDir, 'team-members.json'),
      JSON.stringify(teamMembers, null, 2)
    )

    // Create individual project files
    const projectsDir = path.join(staticDir, 'projects')
    if (!fs.existsSync(projectsDir)) {
      fs.mkdirSync(projectsDir, { recursive: true })
    }

    for (const project of projects) {
      fs.writeFileSync(
        path.join(projectsDir, `${project.slug}.json`),
        JSON.stringify(project, null, 2)
      )
    }

    console.log('✅ Static data built successfully!')
    console.log(`📁 Generated ${projects.length} projects`)
    console.log(`📁 Generated site settings`)
    console.log(`📁 Generated ${categories.length} categories`)
    console.log(`📁 Generated ${cities.length} cities`)
    console.log(`📁 Generated ${teamMembers.length} team members`)

  } catch (error) {
    console.error('❌ Error building static data:', error)
    process.exit(1)
  }
}

buildStaticData()
