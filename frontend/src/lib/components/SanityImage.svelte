<script lang="ts">
  import type { Post } from '$lib/sanity'

  export let image: Post['featuredImage']
  export let width: number = 1024
  export let height: number = 1024
  export let alt: string = ''
  export let quality: number = 80
  export let className: string = ''

  // Generate optimized image URL with Sanity's image API
  function getImageUrl(image: Post['featuredImage'], width: number, height: number) {
    if (!image?.asset?.url) return null
    
    const baseUrl = image.asset.url
    const params = new URLSearchParams({
      w: width.toString(),
      h: height.toString(),
      auto: 'format',
      q: quality.toString()
    })
    
    return `${baseUrl}?${params.toString()}`
  }

  // Get the image URL
  $: imageUrl = getImageUrl(image, width, height)
  $: imageAlt = alt || image?.alt || ''
</script>

{#if imageUrl}
  <img 
    src={imageUrl} 
    alt={imageAlt}
    class={className}
    loading="lazy"
    decoding="async"
  />
{:else}
  <div class="placeholder {className}">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21,15 16,10 5,21"/>
    </svg>
    <span>No image</span>
  </div>
{/if}
