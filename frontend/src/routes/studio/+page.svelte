<script lang="ts">
	import { onMount, onDestroy, tick } from 'svelte'
	import { loadStudioData, studioGrid } from './scripts.js'

	let categories: any[] = []
	let grid: any = null;
	let studioSwiper: any = null;

	onMount(async () => {
		const data = await loadStudioData()
		categories = data.categories		
		await tick()
		grid = new studioGrid(studioSwiper)
	})

	onDestroy(() => {
		if (grid) {
			grid.destroy();
		}
	});
</script>

<svelte:head>
	<title>Studio - Sanity + SvelteKit</title>
	<meta name="description" content="Our creative studio" />
</svelte:head>

<section class="studio">
	<div class="studio-swiper" bind:this={studioSwiper}>
		{#each categories || [] as category, index}
			<div class="studio-category" class:active={index === 0}>
				<div class="wrap">
					<h2>{category.title}</h2>
					<!-- Projects Section -->
					<div class="studio-category-projects">
						{#each category.projects || [] as project}
						{@const featuredImage = project.photoGallery.find(img => img.isFeatured) || project.photoGallery[0]}
							<a href={project.url} class="studio-category-project">
								<span class="studio-category-project-name">{project.name || ""}</span>
								<img class="studio-category-project-image" src={featuredImage.image.asset.url} alt={project.name} />
								<span class="studio-category-project-location">{project.location || ""}</span>
							</a>
						{:else}
							<p class="no-projects">No projects in this category yet.</p>
						{/each}
					</div>
					{#if category.stats && category.stats.length > 0}
					<div class="studio-category-stats">
						{#each category.stats as stat}
							<div class="studio-category-stats-item">
								<span class="studio-category-stats-value">{stat.number}</span>
								<span class="studio-category-stats-label">{stat.description}</span>
							</div>
						{/each}
					</div>
					{:else}
						<p class="no-statistics">No statistics for this category yet.</p>
					{/if}
	
					{#if category.achievements && category.achievements.length > 0}
					<div class="studio-category-achievements">
						{#each category.achievements as achievement}
							<div class="studio-category-achievements-item">
								<span class="studio-category-achievements-item-number">{achievement.number}</span>
								<div class="studio-category-achievements-item-header">
									<h4 class="studio-category-achievements-item-heading">{achievement.heading}</h4>
									<p class="studio-category-achievements-item-content">{achievement.content}</p>
								</div>
							</div>
						{/each}
					</div>
					{/if}
	
					<!-- Team Members Section -->
					<div class="studio-category-members">
						{#each category.teamMembers || [] as member}
							<div class="studio-category-member" data-id={member._id}>
								{#if member.photo?.asset?.url}
									<img class="studio-category-member-image" src={member.photo.asset.url} alt={member.name} />
								{/if}
							</div>
						{:else}
							<p class="no-members">No team members assigned to this category yet.</p>
						{/each}
					</div>
					<div class="studio-category-member-cards">
					{#each category.teamMembers || [] as member}
						<div class="team-member" data-id={member._id}>
							<div class="team-member-wrap">
								<div class="team-member-image">
									{#if member.photo}
										<img src={member.photo.asset.url} alt={member.name} />
									{/if}
								</div>
								<div class="team-member-name">
									<h3>{member.name}</h3>
									<small>{member.role}</small>
								</div>
								<div class="team-member-description">
									{#if member.description}
										<p>{member.description}</p>
									{/if}
								</div>
								<div class="team-member-credentials">
									{#if member.credentials && member.credentials.length > 0}
									{#each member.credentials as credential}
										<span>
											{credential}
										</span>
									{/each}
									{/if}
								</div>
								<div class="team-member-location">
									{#if member.location}
									{member.location.name || 'Unknown'}{#if member.location.country}, {member.location.country}{/if}
									{/if}
								</div>
							</div>
						</div>
					{/each}
					</div>
				</div>
			</div>
		{/each}
	</div>
	<div class="studio-bar"><span></span></div>
</section>
