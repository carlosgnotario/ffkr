import { json } from '@sveltejs/kit'

export async function GET({ url }) {
  try {
    const imageUrl = url.searchParams.get('url')
    
    if (!imageUrl) {
      return json({ error: 'Missing url parameter' }, { status: 400 })
    }

    // Fetch the image from Sanity
    const response = await fetch(imageUrl)
    
    if (!response.ok) {
      return json({ error: 'Failed to fetch image' }, { status: response.status })
    }

    const imageBuffer = await response.arrayBuffer()
    const contentType = response.headers.get('content-type') || 'image/jpeg'
    
    // Return the image with proper headers
    return new Response(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    })
  } catch (error) {
    console.error('Error proxying image:', error)
    return json({ error: 'Failed to proxy image' }, { status: 500 })
  }
}


