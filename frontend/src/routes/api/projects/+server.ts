import { json } from '@sveltejs/kit'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    // Read from static JSON file
    const filePath = path.join(process.cwd(), 'static', 'api', 'projects.json')
    const data = fs.readFileSync(filePath, 'utf-8')
    const projects = JSON.parse(data)
    
    return json(projects)
  } catch (error) {
    console.error('Error reading projects:', error)
    return json({ error: 'Failed to read projects' }, { status: 500 })
  }
}
