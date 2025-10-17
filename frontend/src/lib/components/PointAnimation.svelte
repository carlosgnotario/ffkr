<script lang="ts">
	import LottieAnimation from './LottieAnimation.svelte'
	import pointAnimationData from '$lib/assets/point-animation.json'

	// Allow overriding the default props
	export let loop: boolean = true
	export let autoplay: boolean = true
	export let width: string = '64px'
	export let height: string = '64px'
	export let className: string = ''
</script>

<LottieAnimation 
	animationData={pointAnimationData}
	{loop}
	{autoplay}
	{width}
	{height}
	{className}
/>

