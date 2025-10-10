import { json } from '@sveltejs/kit'
import fs from 'fs'
import path from 'path'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ params }) => {
  try {
    const { slug } = params
    
    // Read from static JSON file
    const filePath = path.join(process.cwd(), 'static', 'api', 'projects', `${slug}.json`)
    const data = fs.readFileSync(filePath, 'utf-8')
    const project = JSON.parse(data)
    
    if (!project) {
      return json({ error: 'Project not found' }, { status: 404 })
    }
    
    return json(project)
  } catch (error) {
    console.error('Error reading project:', error)
    return json({ error: 'Failed to read project' }, { status: 500 })
  }
}
