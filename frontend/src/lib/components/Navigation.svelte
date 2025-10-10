<script lang="ts">
	import { onMount } from 'svelte'
	
	let siteSettings: any = null
	let logoUrl = ''

	onMount(async () => {
		// Use the actual logo from Sanity studio
		logoUrl = 'https://cdn.sanity.io/images/80je9ukv/production/a951976d003854fa494abca54cfc312c44f4f6d8-506x50.svg?w=2000&fit=max&auto=format'
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

