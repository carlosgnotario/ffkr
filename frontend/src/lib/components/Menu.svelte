<script lang="ts">
	import { onMount, onDestroy } from 'svelte'
	import { Menu } from './menu-scripts.js'
	import '$lib/styles/components/menu.scss'

	let menuElement: HTMLElement
	let menuInstance: Menu

	onMount(() => {
		if (typeof window !== 'undefined') {
			menuInstance = new Menu(menuElement)
            
		}
	})

	onDestroy(() => {
		if (menuInstance) {
			menuInstance.destroy()
		}
	})
</script>
<div class="menu-toggle">
    <!-- Back button browser -->
    <a onclick={() => window.history.back()} class="back-button">Back</a>
    <a href="" class="open-button">Open</a>
    <span class="drag"></span>
</div>
<div class="menu" bind:this={menuElement}>
	<div class="menu-display">
        <ul class="menu-pages">
            <li>
                <a href="/studio">Studios</a>
                <ul class="menu-studios">
                    <!-- Studios will be populated by JS -->
                </ul>
            </li>
            <li><a href="/history">History</a></li>
            <li><a href="/culture">Culture</a></li>
        </ul>
	</div>
</div>

