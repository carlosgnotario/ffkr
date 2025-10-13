<script lang="ts">
	import { onMount } from 'svelte'

	onMount(() => {
		console.log("homepage mounted");
		
		// Force screensaver to show immediately on homepage
		const activateScreensaver = () => {
			if (typeof window !== 'undefined' && window.screensaverInstance) {
				console.log("Activating screensaver on homepage");
				window.screensaverInstance.timer = 0
				return true
			}
			return false
		}
		
		// Try immediately first (screensaver should be mounted before this now)
		if (!activateScreensaver()) {
			// Fallback: poll for up to 500ms if not ready
			let attempts = 0
			const maxAttempts = 10
			const pollInterval = setInterval(() => {
				attempts++
				if (activateScreensaver() || attempts >= maxAttempts) {
					clearInterval(pollInterval)
				}
			}, 50)
		}
	})

</script>

<!-- Empty homepage - screensaver will be forced to show -->
<div class="homepage">
	<!-- Empty - screensaver is handled by layout -->
</div>