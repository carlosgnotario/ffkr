<script lang="ts">
  import { onMount } from 'svelte'
  import { page } from '$app/stores'
  import { PortableText } from '@portabletext/svelte'
  import SanityImage from '$lib/components/SanityImage.svelte'

  let post: any = null
  let loading = true

  onMount(async () => {
    try {
      const slug = $page.params.slug
      const response = await fetch(`/api/posts/${slug}`)
      post = await response.json()
    } catch (error) {
      console.error('Error fetching post:', error)
    } finally {
      loading = false
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
  <title>{post?.title || 'Loading...'} - Sanity + SvelteKit</title>
  <meta name="description" content="Read {post?.title || 'Loading...'}" />
</svelte:head>

<div class="container">
  {#if loading}
    <p>Loading...</p>
  {:else if post}
    <article>
      {#if post.image}
        <SanityImage image={post.image} width={800} height={400} alt={post.image.alt || post.title} />
      {/if}
      
      <div style="padding: 2rem 0;">
        <h1>{post.title}</h1>
        <p style="color: #666; font-size: 0.9rem;">{formatDate(post.publishedAt)}</p>
        
        {#if post.body}
          <div style="margin-top: 2rem;">
            <PortableText value={post.body} />
          </div>
        {/if}
      </div>
    </article>
  {:else}
    <p>Post not found</p>
  {/if}
</div>