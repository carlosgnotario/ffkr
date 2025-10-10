<script lang="ts">
	import { onMount } from 'svelte'

	onMount(() => {
		// Force screensaver to show immediately on homepage
		// Wait a bit for the screensaver to be initialized by the layout
		setTimeout(() => {
			if (typeof window !== 'undefined' && window.screensaverInstance) {
				console.log("set to 0");
				window.screensaverInstance.timer = 0
			}
		}, 100)
	})

</script>

<!-- Empty homepage - screensaver will be forced to show -->
<div class="homepage">
	<!-- Empty - screensaver is handled by layout -->
</div>