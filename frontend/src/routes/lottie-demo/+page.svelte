<script lang="ts">
	import { PointAnimation, LottieAnimation } from '$lib'
	import pointAnimationData from '$lib/assets/point-animation.json'

	let animationRef: any

	function handlePlay() {
		animationRef?.play()
	}

	function handlePause() {
		animationRef?.pause()
	}

	function handleStop() {
		animationRef?.stop()
	}

	function handleSpeedNormal() {
		animationRef?.setSpeed(1)
	}

	function handleSpeedFast() {
		animationRef?.setSpeed(2)
	}

	function handleSpeedSlow() {
		animationRef?.setSpeed(0.5)
	}
</script>

<svelte:head>
	<title>Lottie Animation Demo</title>
</svelte:head>

<div class="demo-container">
	<h1>Lottie Animation Demo</h1>
	
	<section class="demo-section">
		<h2>1. Basic PointAnimation</h2>
		<p>Default size (64x64), looping, autoplay</p>
		<PointAnimation />
	</section>

	<section class="demo-section">
		<h2>2. Larger PointAnimation</h2>
		<p>Custom size (128x128)</p>
		<PointAnimation width="128px" height="128px" />
	</section>

	<section class="demo-section">
		<h2>3. Controlled Animation</h2>
		<p>Control the animation with buttons</p>
		<PointAnimation bind:this={animationRef} width="100px" height="100px" />
		
		<div class="controls">
			<button on:click={handlePlay}>Play</button>
			<button on:click={handlePause}>Pause</button>
			<button on:click={handleStop}>Stop</button>
		</div>
		
		<div class="controls">
			<button on:click={handleSpeedSlow}>0.5x Speed</button>
			<button on:click={handleSpeedNormal}>1x Speed</button>
			<button on:click={handleSpeedFast}>2x Speed</button>
		</div>
	</section>

	<section class="demo-section">
		<h2>4. Canvas Renderer</h2>
		<p>Using canvas renderer instead of SVG (better performance)</p>
		<LottieAnimation 
			animationData={pointAnimationData}
			renderer="canvas"
			width="100px"
			height="100px"
		/>
	</section>

	<section class="demo-section">
		<h2>5. No Loop</h2>
		<p>Animation plays once and stops</p>
		<PointAnimation loop={false} width="100px" height="100px" />
	</section>

	<section class="demo-section">
		<h2>6. Multiple Animations</h2>
		<div class="animation-grid">
			<PointAnimation width="80px" height="80px" />
			<PointAnimation width="80px" height="80px" />
			<PointAnimation width="80px" height="80px" />
			<PointAnimation width="80px" height="80px" />
		</div>
	</section>
</div>

<style>
	.demo-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
		font-family: system-ui, -apple-system, sans-serif;
	}

	h1 {
		color: #333;
		margin-bottom: 2rem;
		text-align: center;
	}

	.demo-section {
		background: #f5f5f5;
		padding: 2rem;
		margin-bottom: 2rem;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0,0,0,0.1);
	}

	.demo-section h2 {
		color: #555;
		margin-bottom: 0.5rem;
		font-size: 1.3rem;
	}

	.demo-section p {
		color: #666;
		margin-bottom: 1rem;
	}

	.controls {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		margin-top: 1rem;
	}

	button {
		padding: 0.5rem 1rem;
		background: #007bff;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.9rem;
		transition: background 0.2s;
	}

	button:hover {
		background: #0056b3;
	}

	button:active {
		transform: translateY(1px);
	}

	.animation-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
		gap: 1rem;
		justify-items: center;
	}

	@media (max-width: 600px) {
		.demo-container {
			padding: 1rem;
		}

		.demo-section {
			padding: 1rem;
		}
	}
</style>

