<script lang="ts">
	import { onMount } from 'svelte'
	
	let siteSettings: any = null
	let logoUrl = ''

	function getOptimizedImageUrl(imageUrl: string): string {
		if (!imageUrl) return ''
		const url = new URL(imageUrl)
		url.searchParams.set('auto', 'format')
		return url.toString()
	}

	onMount(async () => {
		try {
			// Fetch from local API endpoint
			const response = await fetch('/api/site-settings')
			const data = await response.json()
			siteSettings = data || {}
			
			if (siteSettings?.logo?.asset?.url) {
				logoUrl = getOptimizedImageUrl(siteSettings.logo.asset.url)
			}
		} catch (error) {
			console.error('Error fetching site settings:', error)
		}
	})
</script>

<nav>
	<a href="/">
		{#if logoUrl}
			<picture>
				<source type="image/avif" srcset={logoUrl} />
				<img src={logoUrl} alt="FFKR Logo" />
			</picture>
		{:else}
			FFKR
		{/if}
	</a>
</nav>

