<script lang="ts">
	import { onMount, tick } from 'svelte'

	onMount(() => {
		tick()
		if (typeof window !== 'undefined' && window.screensaverInstance) {
			window.screensaverInstance.timer = 0
			console.log("this happens");
			
		}
	})

</script>

<!-- Empty homepage - screensaver will be forced to show -->
<div class="homepage">
	<!-- Empty - screensaver is handled by layout -->
</div>