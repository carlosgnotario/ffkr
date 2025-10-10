import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: '80je9ukv',
  dataset: 'production',
  useCdn: true, // Use CDN for better performance
  apiVersion: '2024-01-15', // Use current date
  perspective: 'published', // Only fetch published content
})

// GROQ queries
export const queries = {
  // Get all posts
  posts: `*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
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
    body
  }`,
  
  // Get featured posts
  featuredPosts: `*[_type == "post"] | order(publishedAt desc) [0...3] {
    _id,
    title,
    slug,
    publishedAt,
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
    body
  }`,
  
  // Get single post by slug
  postBySlug: `*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishedAt,
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
    body
  }`,
  
  // Get all categories
  categories: `*[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description,
    color
  }`,
  
  // Get all authors
  authors: `*[_type == "author"] | order(name asc) {
    _id,
    name,
    slug,
    bio,
    email,
    social
  }`,
  
  // Get site settings (singleton)
  siteSettings: `*[_type == "siteSettings"][0] {
    _id,
    title,
    description,
    logo {
      asset->{
        _id,
        url
      },
      alt
    },
    favicon {
      asset->{
        _id,
        url
      }
    },
    socialMedia,
    contactInfo,
    seo,
    analytics,
    theme
  }`,
  
  // Get all cities
  cities: `*[_type == "city"] | order(name asc) {
    _id,
    name
  }`
}

// Type definitions
export interface Post {
  _id: string
  title: string
  slug: { current: string }
  publishedAt: string
  image?: {
    asset: {
      _id: string
      url: string
      metadata: {
        dimensions: {
          width: number
          height: number
        }
      }
    }
    alt?: string
  }
  body?: any[]
}

export interface Category {
  _id: string
  title: string
  slug: { current: string }
  description?: string
  color: string
  teamMembers?: TeamMember[]
  stats?: Array<{
    number: string
    description: string
  }>
}

export interface TeamMember {
  _id: string
  name: string
  role: string
  description?: string
  credentials?: string[]
  photo?: {
    asset: {
      _id: string
      url: string
      metadata: {
        dimensions: {
          width: number
          height: number
        }
      }
    }
    alt?: string
  }
  location?: {
    _id: string
    name: string
    country: string
  }
  categories?: Category[]
  order?: number
  unlist?: boolean
}

export interface Author {
  _id: string
  name: string
  slug: { current: string }
  bio?: any[]
  email?: string
  social?: {
    twitter?: string
    linkedin?: string
    github?: string
  }
}

export interface SiteSettings {
  _id: string
  title: string
  description: string
  logo?: {
    asset: {
      _id: string
      url: string
    }
    alt?: string
  }
  favicon?: {
    asset: {
      _id: string
      url: string
    }
  }
  socialMedia?: {
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
    youtube?: string
    github?: string
  }
  contactInfo?: {
    email?: string
    phone?: string
    address?: string
  }
  seo?: {
    metaTitle?: string
    metaDescription?: string
    keywords?: string[]
    ogImage?: {
      asset: {
        _id: string
        url: string
      }
    }
  }
  analytics?: {
    googleAnalyticsId?: string
    googleTagManagerId?: string
    facebookPixelId?: string
  }
  theme?: {
    primaryColor?: string
    secondaryColor?: string
    accentColor?: string
  }
}
