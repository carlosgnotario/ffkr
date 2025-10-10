<script lang="ts">
	import { onMount } from 'svelte'
	import { Screensaver } from '../routes/screensaver/scripts.js'

	onMount(() => {
		console.log("homepage");
		console.log(Screensaver);
	})

</script>

<!-- Empty homepage - screensaver will be forced to show -->
<div class="homepage">
	<!-- Empty - screensaver is handled by layout -->
</div>