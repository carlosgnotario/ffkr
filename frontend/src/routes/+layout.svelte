<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../lib/styles/main.scss';
	import Navigation from '$lib/components/Navigation.svelte';
	import Screensaver from '$lib/components/Screensaver.svelte';
	import { onMount } from 'svelte'
	import { loader } from '../js/app.js';

	onMount(() => {
		console.log("layout mounted");
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
<Screensaver />
<main>
	{@render children?.()}
</main>
