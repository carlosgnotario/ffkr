<script lang="ts">
	import { onMount, tick, onDestroy } from 'svelte'
	import SanityImage from '$lib/components/SanityImage.svelte'
	import { History } from './scripts.js'
	import celebratingImage from '$lib/assets/celebrating.png'

	let timeline: any[] = []
	let founders: any[] = []
	let loading = true
	let timelineElement: any = null
	let timelineInstance: any = null;

	onMount(async () => {
		try {
			const response = await fetch('/api/site-settings')
			if (!response.ok) {
				throw new Error('Failed to fetch site settings')
			}
			const data = await response.json()
			timeline = data.timeline || []
			founders = data.founders || []
		} catch (err) {
			console.error('Error fetching timeline:', err)
		} finally {
			loading = false
		}
		
		await tick() // Wait for DOM to update
		
		if (timelineElement) {
			timelineInstance = new History(timelineElement)
		}
	})

	onDestroy(() => {
		if (timelineInstance) {
			timelineInstance.destroy()
		}
	})
</script>

<svelte:head>
	<title>History</title>
	<meta name="description" content="Our company history" />
</svelte:head>

<section class="history">
	{#if loading}
		<p>Loading...</p>
	{:else if timeline.length > 0}
		<div class="timeline" bind:this={timelineElement}>
			<div class="timeline-wrap">
				<div class="timeline-line"></div>
				
				{#each founders as founder}
					<div class="founder">
						{#if founder.image}
							<SanityImage image={founder.image} alt={founder.name} />
						{/if}
						{#if founder.name}
							<h3>{founder.name}</h3>
						{/if}
						{#if founder.education && founder.education.length > 0}
							{#each founder.education as edu}
								<div>{edu.title} - {edu.institution}</div>
							{/each}
						{/if}
						{#if founder.honorsAwards && founder.honorsAwards.length > 0}
							{#each founder.honorsAwards as award}
								<h4>{award.heading}</h4>
								<p>{award.content}</p>
							{/each}
						{/if}
						{#if founder.keyContributions && founder.keyContributions.length > 0}
							{#each founder.keyContributions as contribution}
								<h4>{contribution.heading}</h4>
								<p>{contribution.content}</p>
							{/each}
						{/if}
					</div>
				{/each}
				
				{#each timeline as item, index}
					<div class="timeline-item index-{index + 2}">
						<div class="year">{item.year}</div>
						<div class="text">
							<h3>{item.text}</h3>
							{#if item.caption}
								<div class="caption">{item.caption}</div>
							{/if}
						</div>
						{#if item.image1}
							<div class="img1" data-video={item.videoUrl || ''}>
								<SanityImage image={item.image1} alt={`Timeline ${item.year}`} quality={100} />
								{#if item.videoUrl}
									<div class="video-play-button">
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
											<path d="M8 5v14l11-7z"/>
										</svg>
									</div>
								{/if}
							</div>
						{/if}
						{#if item.image2}
							<div class="img2">
								<SanityImage image={item.image2} alt={`Timeline ${item.year}`} quality={100} />
							</div>
						{/if}
						<div class="bar"></div>
					</div>
				{/each}
				<div class="timeline-end">
					<div class="timeline-decoration">
						<img src={celebratingImage} alt="Celebrating" />
					</div>
				</div>
			</div>
		</div>
		<div class="video-modal"></div>
	{:else}
		<p>No timeline items found.</p>
	{/if}
</section>

