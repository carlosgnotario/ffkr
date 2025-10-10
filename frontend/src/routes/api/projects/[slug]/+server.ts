import { json } from '@sveltejs/kit'
import { createClient } from '@sanity/client'
import type { RequestHandler } from './$types'

const client = createClient({
  projectId: '80je9ukv',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-01-15',
  perspective: 'published',
})

export const GET: RequestHandler = async ({ params }) => {
  try {
    const { slug } = params
    
    const project = await client.fetch(`*[_type == "project" && slug.current == $slug][0] {
      _id,
      name,
      description,
      location,
      status,
      completionDate,
      slug,
      services,
      selectSimilarProjectsManually,
      similarProjects[]->{
        _id,
        name,
        slug,
        photoGallery[0]{
          image {
            asset->{
              _id,
              url,
              metadata {
                dimensions
              }
            },
            alt
          }
        }
      },
      category->{
        _id,
        title,
        slug
      },
      team[]->{
        _id,
        name,
        role,
        description,
        credentials,
        location->{
          name,
          country
        },
        photo {
          asset->{
            _id,
            url,
            metadata {
              dimensions
            }
          },
          alt
        }
      },
      photoGallery[]{
        image {
          asset->{
            _id,
            url,
            metadata {
              dimensions
            }
          },
          alt
        },
        caption,
        isFeatured
      },
      "categoryProjects": *[_type == "project" && category._ref == ^.category._ref && _id != ^._id] {
        _id,
        name,
        slug,
        location,
        photoGallery[]{
          image {
            asset->{
              _id,
              url,
              metadata {
                dimensions
              }
            },
            alt
          },
          isFeatured
        }
      }
    }`, { slug })
    
    if (!project) {
      return json({ error: 'Project not found' }, { status: 404 })
    }
    
    // Handle similar projects logic
    let similarProjects = []
    
    if (project.selectSimilarProjectsManually && project.similarProjects && project.similarProjects.length > 0) {
      // Use manually selected similar projects
      similarProjects = project.similarProjects
    } else {
      // Use pre-fetched category projects (already excludes current project)
      const shuffled = project.categoryProjects.sort(() => 0.5 - Math.random())
      const selectedProjects = shuffled.slice(0, 2)
      
      // Process each project to get the featured image or first image
      similarProjects = selectedProjects.map(proj => {
        let featuredImage = null
        
        if (proj.photoGallery && proj.photoGallery.length > 0) {
          // Find featured image first
          featuredImage = proj.photoGallery.find(img => img.isFeatured)
          // If no featured image, use first image
          if (!featuredImage) {
            featuredImage = proj.photoGallery[0]
          }
        }
        
        return {
          _id: proj._id,
          name: proj.name,
          slug: proj.slug.current,
          location: proj.location,
          photoGallery: featuredImage ? [featuredImage] : []
        }
      })
    }
    
    // Add similar projects to the response
    project.similarProjects = similarProjects
    
    // Remove the categoryProjects from response (it was just for internal use)
    delete project.categoryProjects
    
    return json(project)
  } catch (error) {
    console.error('Error fetching project:', error)
    return json({ error: 'Failed to fetch project' }, { status: 500 })
  }
}
