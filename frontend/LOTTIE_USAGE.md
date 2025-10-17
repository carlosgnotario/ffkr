# Lottie Animation Usage Guide

This project now includes reusable Lottie animation components that you can use throughout your application.

## Components

### 1. LottieAnimation (Base Component)

A flexible, reusable Lottie animation component that can work with any Lottie animation data.

**Props:**
- `animationData` (required): The Lottie animation JSON data
- `loop` (default: `true`): Whether the animation should loop
- `autoplay` (default: `true`): Whether to start playing automatically
- `renderer` (default: `'svg'`): Rendering method ('svg', 'canvas', or 'html')
- `width` (default: `'64px'`): Width of the animation container
- `height` (default: `'64px'`): Height of the animation container
- `className` (default: `''`): Additional CSS classes

**Methods:**
- `play()`: Start playing the animation
- `pause()`: Pause the animation
- `stop()`: Stop the animation
- `setSpeed(speed: number)`: Set animation speed (1 = normal, 2 = 2x, etc.)

### 2. PointAnimation (Specific Component)

A pre-configured component for the point/hand animation from your lottieanim.html file.

**Props:**
- `loop` (default: `true`): Whether the animation should loop
- `autoplay` (default: `true`): Whether to start playing automatically
- `width` (default: `'64px'`): Width of the animation
- `height` (default: `'64px'`): Height of the animation
- `className` (default: `''`): Additional CSS classes

## Usage Examples

### Example 1: Using PointAnimation (Simple)

```svelte
<script>
	import { PointAnimation } from '$lib'
</script>

<!-- Basic usage with defaults -->
<PointAnimation />

<!-- Custom size -->
<PointAnimation width="128px" height="128px" />

<!-- Without autoplay -->
<PointAnimation autoplay={false} />

<!-- With custom styling -->
<PointAnimation className="my-custom-class" width="100px" height="100px" />
```

### Example 2: Using LottieAnimation with Custom Data

```svelte
<script>
	import { LottieAnimation } from '$lib'
	import myCustomAnimation from '$lib/assets/my-animation.json'
</script>

<LottieAnimation 
	animationData={myCustomAnimation}
	width="200px"
	height="200px"
	loop={true}
/>
```

### Example 3: Controlling Animation Programmatically

```svelte
<script>
	import { PointAnimation } from '$lib'
	
	let animationRef

	function handlePlay() {
		animationRef?.play()
	}

	function handlePause() {
		animationRef?.pause()
	}

	function handleStop() {
		animationRef?.stop()
	}

	function handleSpeedUp() {
		animationRef?.setSpeed(2)
	}
</script>

<PointAnimation bind:this={animationRef} />

<button on:click={handlePlay}>Play</button>
<button on:click={handlePause}>Pause</button>
<button on:click={handleStop}>Stop</button>
<button on:click={handleSpeedUp}>2x Speed</button>
```

### Example 4: Using in a Page

```svelte
<!-- routes/+page.svelte -->
<script>
	import { PointAnimation } from '$lib'
</script>

<div class="hero">
	<h1>Welcome</h1>
	<PointAnimation width="128px" height="128px" />
	<p>Click here to get started</p>
</div>

<style>
	.hero {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}
</style>
```

### Example 5: Canvas Rendering (Better Performance)

```svelte
<script>
	import { LottieAnimation } from '$lib'
	import pointAnimationData from '$lib/assets/point-animation.json'
</script>

<LottieAnimation 
	animationData={pointAnimationData}
	renderer="canvas"
	width="64px"
	height="64px"
/>
```

## Adding More Animations

To add new Lottie animations to your project:

1. Place your animation JSON file in `frontend/src/lib/assets/`
2. Create a specific component (optional) or use LottieAnimation directly:

```svelte
<!-- NewAnimation.svelte -->
<script lang="ts">
	import LottieAnimation from './LottieAnimation.svelte'
	import newAnimationData from '$lib/assets/new-animation.json'

	export let loop: boolean = true
	export let autoplay: boolean = true
	export let width: string = '64px'
	export let height: string = '64px'
	export let className: string = ''
</script>

<LottieAnimation 
	animationData={newAnimationData}
	{loop}
	{autoplay}
	{width}
	{height}
	{className}
/>
```

3. Export it in `frontend/src/lib/index.ts`:

```typescript
export { default as NewAnimation } from './components/NewAnimation.svelte'
```

## TypeScript Support

Both components are fully typed with TypeScript. The base `LottieAnimation` component uses the `AnimationItem` type from `lottie-web`.

## Resources

- [Lottie Files](https://lottiefiles.com/) - Free Lottie animations
- [Lottie Web GitHub](https://github.com/airbnb/lottie-web) - Official library documentation

