import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

// Function to fetch website metadata (title and favicon)
async function getWebsiteMetadata(url: string): Promise<{ title: string | null; favicon: string | null }> {
  let title: string | null = null
  let favicon: string | null = null
  
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`)
    const baseUrl = urlObj.origin
    
    // Fetch HTML from the exact URL provided (not just origin)
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })
    
    if (!response.ok) {
      // Fallback to /favicon.ico
      return { title: urlObj.hostname.replace('www.', ''), favicon: `${baseUrl}/favicon.ico` }
    }
    
    const html = await response.text()
    
    // Extract title from various sources
    // 1. Open Graph title
    const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i)
    if (ogTitleMatch && ogTitleMatch[1]) {
      title = ogTitleMatch[1]
    }
    
    // 2. Twitter title
    if (!title) {
      const twitterTitleMatch = html.match(/<meta[^>]*name=["']twitter:title["'][^>]*content=["']([^"']+)["']/i)
      if (twitterTitleMatch && twitterTitleMatch[1]) {
        title = twitterTitleMatch[1]
      }
    }
    
    // 3. Standard title tag
    if (!title) {
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
      if (titleMatch && titleMatch[1]) {
        title = titleMatch[1].trim()
      }
    }
    
    // Clean up title (remove extra whitespace, common suffixes)
    if (title) {
      title = title
        .replace(/\s+/g, ' ')
        .replace(/\s*[\|–—-]\s*$/g, '')
        .trim()
    }
    
    // Parse HTML to find favicon
    const iconPatterns = [
      /<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']+)["']/i,
      /<link[^>]*href=["']([^"']+)["'][^>]*rel=["'](?:shortcut )?icon["']/i,
      /<link[^>]*rel=["']icon["'][^>]*href=["']([^"']+)["']/i,
      /<link[^>]*href=["']([^"']+)["'][^>]*rel=["']icon["']/i,
      /<link[^>]*rel=["']apple-touch-icon["'][^>]*href=["']([^"']+)["']/i,
    ]
    
    for (const pattern of iconPatterns) {
      const match = html.match(pattern)
      if (match && match[1]) {
        let faviconUrl = match[1]
        
        // Handle relative URLs
        if (faviconUrl.startsWith('//')) {
          faviconUrl = `${urlObj.protocol}${faviconUrl}`
        } else if (faviconUrl.startsWith('/')) {
          faviconUrl = `${baseUrl}${faviconUrl}`
        } else if (!faviconUrl.startsWith('http')) {
          faviconUrl = `${baseUrl}/${faviconUrl}`
        }
        
        favicon = faviconUrl
        break
      }
    }
    
    // Fallback to /favicon.ico
    if (!favicon) {
      favicon = `${baseUrl}/favicon.ico`
    }
    
    return { title, favicon }
  } catch (error) {
    console.error('Error fetching website metadata:', error)
    // Last fallback: try direct favicon.ico
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`)
      return { 
        title: urlObj.hostname.replace('www.', ''), 
        favicon: `${urlObj.origin}/favicon.ico` 
      }
    } catch {
      return { title: url, favicon: null }
    }
  }
}

// GET all website recommendations
export async function GET() {
  try {
    const recommendations = await db.recommendation.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    return NextResponse.json(recommendations)
  } catch (error) {
    console.error('Error fetching recommendations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    )
  }
}

// POST create new recommendation
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { url, category, categoryIcon, password, verifyOnly } = body

    // Verify password
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Password salah!' },
        { status: 401 }
      )
    }

    // If verifyOnly, just return success without creating
    if (verifyOnly) {
      return NextResponse.json({ success: true, message: 'Password valid' })
    }

    if (!url || !category) {
      return NextResponse.json(
        { error: 'URL dan kategori wajib diisi!' },
        { status: 400 }
      )
    }

    // Normalize URL
    const normalizedUrl = url.startsWith('http') ? url : `https://${url}`

    // Get website metadata (title and favicon)
    const metadata = await getWebsiteMetadata(normalizedUrl)
    
    // Use extracted title, fallback to domain name
    let title = metadata.title
    if (!title) {
      try {
        const urlObj = new URL(normalizedUrl)
        title = urlObj.hostname.replace('www.', '')
      } catch {
        title = url
      }
    }
    
    const imageUrl = metadata.favicon

    const recommendation = await db.recommendation.create({
      data: {
        title,
        url: normalizedUrl,
        category,
        categoryIcon: categoryIcon || null,
        imageUrl,
      },
    })

    return NextResponse.json(recommendation, { status: 201 })
  } catch (error) {
    console.error('Error creating recommendation:', error)
    return NextResponse.json(
      { error: 'Failed to create recommendation' },
      { status: 500 }
    )
  }
}
