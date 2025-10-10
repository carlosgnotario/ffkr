<script lang="ts">
	import { onMount } from 'svelte'
	
	let siteSettings: any = null
	let logoUrl = ''

	onMount(async () => {
		try {
			// Use CORS proxy to fetch from Sanity API
			const corsProxy = 'https://api.allorigins.win/raw?url='
			const query = `*[_type == "siteSettings"][0] {
				logo {
					asset->{
						_id,
						url
					}
				}
			}`
			
			const response = await fetch(`${corsProxy}${encodeURIComponent(`https://80je9ukv.api.sanity.io/v2024-01-15/data/query/production?query=${encodeURIComponent(query)}`)}`)
			const data = await response.json()
			siteSettings = data.result || {}
			
			if (siteSettings?.logo?.asset?.url) {
				logoUrl = siteSettings.logo.asset.url
			}
		} catch (error) {
			console.error('Error fetching site settings:', error)
			// Fallback to hardcoded logo if API fails
			logoUrl = 'https://cdn.sanity.io/images/80je9ukv/production/a951976d003854fa494abca54cfc312c44f4f6d8-506x50.svg?w=2000&fit=max&auto=format'
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

