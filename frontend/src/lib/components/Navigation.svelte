<script lang="ts">
	import { onMount } from 'svelte'
	
	let siteSettings: any = null
	let logoUrl = ''

	onMount(async () => {
		try {
			// Fetch from local API endpoint
			const response = await fetch('/api/site-settings')
			const data = await response.json()
			siteSettings = data || {}
			
			if (siteSettings?.logo?.asset?.url) {
				logoUrl = siteSettings.logo.asset.url
			}
		} catch (error) {
			console.error('Error fetching site settings:', error)
		}
	})
</script>

<nav>
	<a href="/">
		{#if logoUrl}
			<img src={logoUrl} alt="FFKR Logo" />
		{:else}
			FFKR
		{/if}
	</a>
</nav>

