<script lang="ts">
	import { onMount, onDestroy } from 'svelte'
	import { page } from '$app/stores'
	import { Screensaver } from '../../routes/screensaver/scripts.js'
	import '$lib/styles/pages/screensaver.scss'

	let screensaver: HTMLElement
	let screensaverInstance: Screensaver

	onMount(() => {
		// Only run in browser
		if (typeof window !== 'undefined') {
			screensaverInstance = new Screensaver(screensaver)
			if ($page.url.pathname === '/') {
				screensaverInstance.timer = 0
			}
			// Expose instance globally for homepage access
			window.screensaverInstance = screensaverInstance
		}
	})
</script>

<div class="screensaver" bind:this={screensaver}>
	<div class="screensaver-text">
		<p>Click anywhere to continue</p>
	</div>
	<div class="screensaver-menu">
		<a href="/studio">
			<img src="" alt="Projects" class="menu-image" />
			<span class="menu-text">Projects</span>
		</a>
		<a href="/history">
			<img src="" alt="History" class="menu-image" />
			<span class="menu-text">History</span>
		</a>
		<a href="/culture">
			<img src="" alt="Culture" class="menu-image" />
			<span class="menu-text">Culture</span>
		</a>
	</div>
</div>
