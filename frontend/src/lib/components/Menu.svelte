<script lang="ts">
	import { onMount, onDestroy } from 'svelte'
	import { goto } from '$app/navigation'
	import { Menu } from './menu-scripts.js'
	import '$lib/styles/components/menu.scss'

	let menuElement: HTMLElement
	let menuInstance: Menu

	onMount(() => {
		if (typeof window !== 'undefined') {
			menuInstance = new Menu(menuElement, goto)
            
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
    <button type="button" on:click={() => window.history.back()} class="back-button">Back</button>
    <button type="button" class="open-button">Open</button>
    <span class="drag" role="button" tabindex="0" aria-label="Drag to move menu"></span>
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
<div class="menu-hidden">
    <div class="menu-hidden-overlay"></div>
    <div class="menu-hidden-content">
        <button class="menu-hidden-close">×</button>
        <h3>Session Settings</h3>
        <div class="menu-hidden-controls">
            <div class="control-group">
                <label for="movement-modifier">Movement Modifier</label>
                <div class="slider-container">
                    <input 
                        type="range" 
                        id="movement-modifier" 
                        class="movement-slider"
                        min="1" 
                        max="3" 
                        step="0.1" 
                        value="1"
                    />
                    <span class="slider-value">1.0</span>
                </div>
            </div>
        </div>
    </div>
</div>

