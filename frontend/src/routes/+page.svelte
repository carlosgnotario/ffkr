<script lang="ts">
	import { onMount } from 'svelte'

	onMount(() => {
		// Force show screensaver immediately on homepage
		if (typeof window !== 'undefined') {
			// Wait a bit for the screensaver to be initialized by the layout
			setTimeout(() => {
				const screensaverElement = document.querySelector('.screensaver')
				if (screensaverElement && window.screensaverInstance) {
					// Set timer to 0 for immediate show on homepage
					window.screensaverInstance.setTimer(0)
					window.screensaverInstance.show()
				}
			}, 100)
		}
	})

</script>

<!-- Empty homepage - screensaver will be forced to show -->
<div class="homepage">
	<!-- Empty - screensaver is handled by layout -->
</div>