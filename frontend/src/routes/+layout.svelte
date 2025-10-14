<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../lib/styles/main.scss';
	import Navigation from '$lib/components/Navigation.svelte';
	import Screensaver from '$lib/components/Screensaver.svelte';
	import { onMount } from 'svelte'
	import { fade } from 'svelte/transition';
	import { page } from '$app/stores';
	import { loader } from '../js/app.js';

	onMount(() => {
		loader();
	})

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>FFKR - Sanity + SvelteKit</title>
	<meta name="description" content="Your modern headless CMS with SvelteKit frontend" />
</svelte:head>

<Navigation />
<main>
	{#key $page.url.pathname}
		<div in:fade={{ duration: 300, delay: 300 }} out:fade={{ duration: 300 }}>
			{@render children?.()}
		</div>
	{/key}
</main>
<Screensaver />
