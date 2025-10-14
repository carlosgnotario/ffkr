<script lang="ts">
	import { onMount, tick, onDestroy } from 'svelte'
	import SanityImage from '$lib/components/SanityImage.svelte'
	import { loadCultureData, cultureGrid, cultureToggler } from './scripts.js'

	let teamMembers: any[] = []
	let siteSettings: any = null
	let cities: any[] = []
	let teamGrid: any = null;
	let grid: any = null;
	let toggler: any = null;
	let togglerElement: any = null;
	let featuredPosts: any[] = []

	onMount(async () => {
		const data = await loadCultureData()
		teamMembers = data.teamMembers
		siteSettings = data.siteSettings		
		cities = data.cities
		featuredPosts = data.newsPosts
		await tick()
		if (teamGrid) {
			grid = new cultureGrid(teamGrid, teamMembers, siteSettings)
		}
		if (togglerElement) {
			toggler = new cultureToggler(togglerElement)
		}
	})

	onDestroy(() => {
		if (grid) {
			grid.destroy();
		}
		if (toggler) {
			toggler.destroy();
		}
	});

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
	}
</script>

<svelte:head>
	<title>Culture - Sanity + SvelteKit</title>
	<meta name="description" content="Learn about our company culture" />
</svelte:head>

<section class="culture">
	{#if teamMembers.length > 0}
	<div class="culture-grid">
		<div class="team-grid" data-object="teamGrid" bind:this={teamGrid}>
			{#each teamMembers as member}
				{#if member.photo}
				<div class="avatar" data-id={member._id} data-city={member.location?.name || 'Unknown'}>
					<div class="wrap">
						<img src={member.photo.asset?.url} alt={member.photo.alt || member.name} />
					</div>
				</div>
				{/if}
			{/each}
			{#each Array(2) as _, i}
			{#each siteSettings.awards as award}
				<div class="award">
					<div class="wrap">
						{#if award.logo}
							<img class="award-logo" src={award.logo.asset.url} alt={award.name} />
						{/if}
						<span class="award-name">{award.name}</span>
						<span class="award-date">{award.formattedDate}</span>
					</div>
				</div>
			{/each}
			{/each}
			{#each Array(2) as _, i}
				{#each siteSettings.testimonialVideos as testimonial}
					<div class="testimonial" data-video={testimonial.videoUrl}>
						<div class="wrap">
							{#if testimonial.thumbnail}
								<img class="testimonial-thumbnail" src={testimonial.thumbnail.asset.url} alt={testimonial.title} />
							{/if}
							<span class="testimonial-title">{testimonial.title}</span>
						</div>
					</div>
				{/each}
			{/each}
			{#each teamMembers as member}
				<div class="team-member" data-id={member._id}>
					<div class="team-member-wrap">
						<div class="team-member-image">
							{#if member.photo}
								<SanityImage 
									image={member.photo} 
									width={400} 
									height={400} 
									alt={member.photo.alt || member.name}
								/>
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
	<div class="team-member-modal"></div>
	<div class="testimonial-modal"></div>
	<div class="team-member-filter">
			<div class="team-member-filter-item active" data-city="all">
				<span>All</span>
			</div>
		{#each cities as city}
			<div class="team-member-filter-item" data-city={city.name}>
				{city.name}
			</div>
		{/each}
	</div>
	{/if}

	
	<div class="culture-content" bind:this={togglerElement}>
		<div class="culture-content-news active">
			<div class="culture-content-news-toggle">
				<h2 class="culture-content-news-title">Latest News</h2>
				<span class="toggle"></span>
			</div>
			<div class="culture-content-news-items">
			{#each featuredPosts as post}
				<div class="culture-content-news-item">
					<!-- image -->
					{#if post.image}
						<SanityImage image={post.image} width={300} height={200} alt={post.image.alt || post.title} />
					{/if}
					<span class="date">{formatDate(post.publishedAt)}</span>
					{#if post.body && post.body.length > 0}
						<p>{post.body.slice(0, 1).map(block => 
							block._type === 'block' && block.children ? 
							block.children.map(child => child.text).join('').substring(0, 150) + '...' : ''
						).join('')}</p>
					{/if}
				</div>
			{/each}
			</div>
		</div>
		<div class="culture-content-cards">
			<div class="culture-content-news-toggle">
				<h2 class="culture-content-cards-title">Trading Cards</h2>
				<span class="toggle"></span>
			</div>
			<div class="culture-content-cards-items">
				
			</div>
		</div>
	</div>
</section>


