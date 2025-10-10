<script lang="ts">
  import { onMount } from 'svelte'
  import SanityImage from '$lib/components/SanityImage.svelte'

  let projects: any[] = []
  let loading = true
  let error: string | null = null
  let selectedCategory = 'all'
  let selectedStatus = 'all'

  onMount(async () => {
    // Reset screensaver timer for non-homepage pages
    if (typeof window !== 'undefined' && window.screensaverInstance) {
      window.screensaverInstance.resetTimer();
    }
    
    try {
      const response = await fetch('/api/projects')
      if (!response.ok) {
        throw new Error('Failed to fetch projects')
      }
      projects = await response.json()
    } catch (err) {
      console.error('Error fetching projects:', err)
      error = 'Failed to load projects'
    } finally {
      loading = false
    }
  })

  // Get unique categories
  $: categories = [...new Set(projects.map(p => p.category?.title).filter(Boolean))]
  
  // Get unique statuses
  $: statuses = [...new Set(projects.map(p => p.status).filter(Boolean))]

  // Filter projects based on selected filters
  $: filteredProjects = projects.filter(project => {
    const categoryMatch = selectedCategory === 'all' || project.category?.title === selectedCategory
    const statusMatch = selectedStatus === 'all' || project.status === selectedStatus
    return categoryMatch && statusMatch
  })

  // Get featured image or first image
  function getFeaturedImage(project: any) {
    if (!project.photoGallery || project.photoGallery.length === 0) return null
    
    const featured = project.photoGallery.find((img: any) => img.isFeatured)
    return featured || project.photoGallery[0]
  }

  // Get status color
  function getStatusColor(status: string) {
    switch (status) {
      case 'completed': return '#22c55e'
      case 'in-progress': return '#3b82f6'
      case 'planning': return '#f59e0b'
      case 'on-hold': return '#ef4444'
      default: return '#6b7280'
    }
  }

  // Format date helper
  function formatDate(dateString: string) {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
</script>

<svelte:head>
  <title>Projects - Portfolio</title>
  <meta name="description" content="Explore our portfolio of projects across various categories and disciplines." />
</svelte:head>

<div class="container">
  <header class="page-header">
    <h1>Our Projects</h1>
    <p class="page-description">
      Discover our diverse portfolio of projects spanning urban planning, architecture, 
      environmental design, and smart city initiatives.
    </p>
  </header>

  {#if loading}
    <div class="loading">
      <p>Loading projects...</p>
    </div>
  {:else if error}
    <div class="error">
      <h2>Error</h2>
      <p>{error}</p>
    </div>
  {:else}
    <!-- Filters -->
    <div class="filters">
      <div class="filter-group">
        <label for="category-filter">Category:</label>
        <select id="category-filter" bind:value={selectedCategory}>
          <option value="all">All Categories</option>
          {#each categories as category}
            <option value={category}>{category}</option>
          {/each}
        </select>
      </div>
      
      <div class="filter-group">
        <label for="status-filter">Status:</label>
        <select id="status-filter" bind:value={selectedStatus}>
          <option value="all">All Statuses</option>
          {#each statuses as status}
            <option value={status}>{status.replace('-', ' ').toUpperCase()}</option>
          {/each}
        </select>
      </div>
    </div>

    <!-- Projects Grid -->
    <div class="projects-grid">
      {#each filteredProjects as project}
        <a href="/projects/{project.slug.current}" class="project-card">
          <div class="project-image">
            {#if getFeaturedImage(project)}
              <SanityImage 
                image={getFeaturedImage(project).image} 
                width={400} 
                height={250} 
                alt={getFeaturedImage(project).image.alt || project.name}
                className="card-image"
              />
            {:else}
              <div class="placeholder-image">
                <span>No Image</span>
              </div>
            {/if}
            
            <div class="project-overlay">
              <span 
                class="status-badge" 
                style="background-color: {getStatusColor(project.status)}"
              >
                {project.status.replace('-', ' ').toUpperCase()}
              </span>
            </div>
          </div>
          
          <div class="project-content">
            <div class="project-meta">
              {#if project.category}
                <span class="category">{project.category.title}</span>
              {/if}
              {#if project.location}
                <span class="location">📍 {project.location}</span>
              {/if}
            </div>
            
            <h3 class="project-title">{project.name}</h3>
            
            {#if project.description}
              <p class="project-description">
                {project.description.length > 120 
                  ? project.description.substring(0, 120) + '...' 
                  : project.description}
              </p>
            {/if}
            
            {#if project.completionDate}
              <p class="completion-date">
                Completed: {formatDate(project.completionDate)}
              </p>
            {/if}
            
            {#if project.team && project.team.length > 0}
              <div class="team-preview">
                <span class="team-count">
                  👥 {project.team.length} team member{project.team.length !== 1 ? 's' : ''}
                </span>
              </div>
            {/if}
          </div>
        </a>
      {/each}
    </div>

    {#if filteredProjects.length === 0}
      <div class="no-results">
        <h3>No projects found</h3>
        <p>Try adjusting your filters to see more projects.</p>
      </div>
    {/if}
  {/if}
</div>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  .page-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .page-header h1 {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: #111827;
  }

  .page-description {
    font-size: 1.125rem;
    color: #6b7280;
    max-width: 600px;
    margin: 0 auto;
  }

  .loading, .error {
    text-align: center;
    padding: 4rem 0;
  }

  .error h2 {
    color: #ef4444;
    margin-bottom: 1rem;
  }

  .filters {
    display: flex;
    gap: 2rem;
    margin-bottom: 3rem;
    padding: 1.5rem;
    background: #f9fafb;
    border-radius: 8px;
    flex-wrap: wrap;
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .filter-group label {
    font-weight: 500;
    color: #374151;
  }

  .filter-group select {
    padding: 0.5rem 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    background: white;
    font-size: 0.875rem;
  }

  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
  }

  .project-card {
    text-decoration: none;
    color: inherit;
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    border: 1px solid #e5e7eb;
  }

  .project-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
    border-color: #3b82f6;
  }

  .project-image {
    position: relative;
    height: 250px;
    overflow: hidden;
  }


  .placeholder-image {
    width: 100%;
    height: 100%;
    background: #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9ca3af;
    font-weight: 500;
  }

  .project-overlay {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }

  .status-badge {
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .project-content {
    padding: 1.5rem;
  }

  .project-meta {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  .category {
    background: #3b82f6;
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .location {
    color: #6b7280;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .project-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0 0 0.75rem 0;
    color: #111827;
    line-height: 1.4;
  }

  .project-description {
    color: #6b7280;
    font-size: 0.875rem;
    line-height: 1.5;
    margin: 0 0 1rem 0;
  }

  .completion-date {
    color: #9ca3af;
    font-size: 0.75rem;
    margin: 0 0 0.75rem 0;
  }

  .team-preview {
    margin-top: 0.75rem;
  }

  .team-count {
    color: #6b7280;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .no-results {
    text-align: center;
    padding: 4rem 2rem;
    color: #6b7280;
  }

  .no-results h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: #374151;
  }

  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }

    .page-header h1 {
      font-size: 2rem;
    }

    .filters {
      flex-direction: column;
      gap: 1rem;
    }

    .projects-grid {
      grid-template-columns: 1fr;
    }

    .project-meta {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
</style>
