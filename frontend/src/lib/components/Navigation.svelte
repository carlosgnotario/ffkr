<script lang="ts">
	import { onMount } from 'svelte'
	
	let siteSettings: any = null
	let logoUrl = ''

	onMount(async () => {
		// Use fallback logo since CORS blocks direct Sanity API calls
		logoUrl = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=60&fit=crop'
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

