import { json } from '@sveltejs/kit'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    // Read from static JSON file
    const filePath = path.join(process.cwd(), 'static', 'api', 'site-settings.json')
    const data = fs.readFileSync(filePath, 'utf-8')
    const siteSettings = JSON.parse(data)
    
    return json(siteSettings)
  } catch (error) {
    console.error('Error reading site settings:', error)
    return json({ error: 'Failed to read site settings' }, { status: 500 })
  }
}
