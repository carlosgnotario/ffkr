<script lang="ts">
	import { onMount } from 'svelte'
	
	let siteSettings: any = null
	let logoUrl = ''

	onMount(async () => {
		try {
			// Fetch directly from Sanity CDN
			const query = `*[_type == "siteSettings"][0] {
				logo {
					asset->{
						_id,
						url
					}
				}
			}`
			
			const response = await fetch(`https://80je9ukv.api.sanity.io/v2024-01-15/data/query/production?query=${encodeURIComponent(query)}`)
			const data = await response.json()
			siteSettings = data.result || {}
			
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

