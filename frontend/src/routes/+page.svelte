<script lang="ts">
	import { onMount } from 'svelte'

	onMount(() => {
		// Force screensaver to show immediately on homepage
		// Wait a bit for the screensaver to be fully initialized
		setTimeout(() => {
			if (typeof window !== 'undefined' && window.screensaverInstance) {
				window.screensaverInstance.setHomepageTimer();
			}
		}, 100)
	})

</script>

<!-- Empty homepage - screensaver will be forced to show -->
<div class="homepage">
	<!-- Empty - screensaver is handled by layout -->
</div>