<script lang="ts">
  import { onMount } from 'svelte'
  import SanityImage from '$lib/components/SanityImage.svelte'

  let posts: any[] = []

  onMount(async () => {
    try {
      const response = await fetch('/api/posts')
      posts = await response.json()
    } catch (error) {
      console.error('Error fetching posts:', error)
    }
  })

  // Format date helper
  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
</script>

<svelte:head>
  <title>Posts - Sanity + SvelteKit</title>
  <meta name="description" content="Browse all posts from our Sanity CMS" />
</svelte:head>

<div class="container">
  <h1>All Posts</h1>
  
  {#if posts.length === 0}
    <div style="text-align: center; padding: 2rem;">
      <h2>No posts found</h2>
      <p>Check back later for new content!</p>
    </div>
  {:else}
    <div style="margin: 2rem 0;">
      {#each posts as post}
        <div style="border: 1px solid #eee; padding: 1rem; margin-bottom: 1rem;">
          {#if post.image}
            <SanityImage image={post.image} width={300} height={200} alt={post.image.alt || post.title} />
          {/if}
          <h2><a href="/posts/{post.slug.current}">{post.title}</a></h2>
          <p style="color: #666; font-size: 0.9rem;">{formatDate(post.publishedAt)}</p>
          {#if post.body && post.body.length > 0}
            <p>{post.body.slice(0, 2).map(block => 
              block._type === 'block' && block.children ? 
              block.children.map(child => child.text).join('') : ''
            ).join('')}</p>
          {/if}
          <a href="/posts/{post.slug.current}">Read More →</a>
        </div>
      {/each}
    </div>
  {/if}
</div>