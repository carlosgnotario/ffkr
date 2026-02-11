<script lang="ts">
	import { onMount } from 'svelte'
	import { page } from '$app/stores'
	import { Screensaver } from '../../routes/screensaver/scripts.js'
	import '$lib/styles/pages/screensaver.scss'
	import PointAnimation from './PointAnimation.svelte';

	let screensaver: HTMLElement
	let screensaverInstance: Screensaver
	let navigation: Array<{ title: string; url: string; image?: { asset?: { url: string }; alt?: string } }> = []

	function getOptimizedImageUrl(url: string, w = 400, h = 400, q = 80): string {
		if (!url) return ''
		const u = new URL(url)
		u.searchParams.set('w', String(w))
		u.searchParams.set('h', String(h))
		u.searchParams.set('auto', 'format')
		u.searchParams.set('q', String(q))
		return u.toString()
	}

	onMount(async () => {
		if (typeof window === 'undefined') return
		try {
			const res = await fetch('/api/site-settings')
			const data = await res.json()
			navigation = data?.navigation ?? []
		} catch (e) {
			console.error('Failed to load site settings for screensaver menu', e)
		}
		screensaverInstance = new Screensaver(screensaver)
		if ($page.url.pathname === '/') {
			screensaverInstance.timer = 0
		}
		window.screensaverInstance = screensaverInstance
	})
</script>

<div class="screensaver" bind:this={screensaver}>
	<div class="screensaver-text">
		<PointAnimation />
		<p>Tap anywhere to continue</p>
	</div>
	<div class="screensaver-menu">
		{#each navigation as item}
			<a href={item.url || '#'}>
				{#if item.image?.asset?.url}
					<img
						src={getOptimizedImageUrl(item.image.asset.url)}
						alt={item.image?.alt || item.title || ''}
						class="menu-image"
					/>
				{:else}
					<img src="" alt={item.title || ''} class="menu-image" />
				{/if}
				<span class="menu-text">{item.title || ''}</span>
			</a>
		{/each}
	</div>
</div>
