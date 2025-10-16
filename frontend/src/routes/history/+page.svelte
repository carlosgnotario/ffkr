<script lang="ts">
	import { onMount, tick, onDestroy } from 'svelte'
	import SanityImage from '$lib/components/SanityImage.svelte'
	import { History } from './scripts.js'
	import celebratingImage from '$lib/assets/celebrating.png'

	let timeline: any[] = []
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
				{#each timeline as item, index}
					<div class="timeline-item index-{index + 1}">
						<div class="year">{item.year}</div>
						<div class="text">
							<h3>{item.text}</h3>
							{#if item.caption}
								<div class="caption">{item.caption}</div>
							{/if}
						</div>
						{#if item.image1}
							<div class="img1">
								<SanityImage image={item.image1} alt={`Timeline ${item.year}`} />
							</div>
						{/if}
						{#if item.image2}
							<div class="img2">
								<SanityImage image={item.image2} alt={`Timeline ${item.year}`} />
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
	{:else}
		<p>No timeline items found.</p>
	{/if}
</section>

