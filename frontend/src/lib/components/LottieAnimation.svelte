<script lang="ts">
	import { onMount, onDestroy } from 'svelte'
	import lottie, { type AnimationItem } from 'lottie-web'

	// Props
	export let animationData: any = null
	export let loop: boolean = true
	export let autoplay: boolean = true
	export let renderer: 'svg' | 'canvas' | 'html' = 'svg'
	export let width: string = '64px'
	export let height: string = '64px'
	export let className: string = ''

	let containerElement: HTMLDivElement
	let animation: AnimationItem | null = null

	onMount(() => {
		if (animationData && containerElement) {
			animation = lottie.loadAnimation({
				container: containerElement,
				renderer: renderer,
				loop: loop,
				autoplay: autoplay,
				animationData: animationData
			})
		}
	})

	onDestroy(() => {
		if (animation) {
			animation.destroy()
		}
	})

	// Public methods for controlling animation
	export function play() {
		animation?.play()
	}

	export function pause() {
		animation?.pause()
	}

	export function stop() {
		animation?.stop()
	}

	export function setSpeed(speed: number) {
		if (animation) {
			animation.setSpeed(speed)
		}
	}
</script>

<div 
	bind:this={containerElement} 
	class="lottie-container {className}"
	style="width: {width}; height: {height};"
></div>

<style>
	.lottie-container {
		display: inline-block;
	}
</style>

