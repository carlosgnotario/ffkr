<script lang="ts">
	import { onMount, tick, onDestroy } from 'svelte'
	import { page } from '$app/stores'
	import '$lib/styles/pages/project.scss'
	import { projectSlider } from './scripts.js'

	let project: any = null
	let slider: any = null
	let sliderElement: any = null

	async function loadProject() {
		const slug = $page.params.slug
		const response = await fetch(`/api/projects/${slug}`)
		project = await response.json()
		console.log('Project data:', project)
		console.log('Similar projects:', project.similarProjects)
		await tick()
		
		// Clean up existing slider before creating new one
		if (slider) {
			slider.destroy()
		}
		slider = new projectSlider(sliderElement)
	}

	onMount(loadProject)

	onDestroy(() => {
		console.log("destroy pls");
		
		if (slider) {
			slider.destroy()
		}
	});

	// Watch for route changes - only in browser
	$: if (typeof window !== 'undefined' && $page.params.slug) {
		loadProject()
	}
</script>

<svelte:head>
	<title>{project?.name || 'Loading...'} - Projects</title>
	<meta name="description" content={project?.description || 'Project details'} />
</svelte:head>

<section class="project">
	<div class="project-slider" bind:this={sliderElement}>
		{#each project?.photoGallery || [] as image}
			<div class="project-slider-image">
				<img src={image.image.asset.url} alt={image.image.alt || project.name} />
			</div>
		{/each}
	</div>
	<div class="project-info">
		<div class="project-info-heading">
			<div class="project-info-category">
				{project?.category?.title}
			</div>
			<h2 class="project-info-name">{project?.name}</h2>
			<div class="project-info-location">
				{project?.location}
			</div>
			<div class="project-info-tags">
				{#each project?.services as service}
					<span class="project-info-tag">{service.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
				{/each}
			</div>
		</div>
		<div class="project-info-completion-date">
			<h3>Completion Date:</h3>
			<span>{project?.completionDate}</span>
		</div>
		{#if project?.team && project.team.length > 0}
			<div class="project-info-team">
				<h3>Key Team Members</h3>
				{#each project.team as member}
					<div class="project-info-team-member">
						<img src={member.photo.asset.url} alt={member.name} />
						<div class="project-info-team-member-floater">
							<div class="project-info-team-member-floater-wrap">
								<div class="project-info-team-member-floater-image">
									{#if member.photo}
										<img src={member.photo.asset.url} alt={member.name} />
									{/if}
								</div>
								<div class="project-info-team-member-floater-name">
									<h3>{member.name}</h3>
									<small>{member.role}</small>
								</div>
								<div class="project-info-team-member-floater-description">
									{#if member.description}
										<p>{member.description}</p>
									{/if}
								</div>
								<div class="project-info-team-member-floater-credentials">
									{#if member.credentials && member.credentials.length > 0}
									{#each member.credentials as credential}
										<span>
											{credential}
										</span>
									{/each}
									{/if}
								</div>
								<div class="project-info-team-member-floater-location">
									{#if member.location}
									{member.location.name || 'Unknown'}{#if member.location.country}, {member.location.country}{/if}
									{/if}
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
		{#if project?.similarProjects && project.similarProjects.length > 0}
			<div class="project-info-similar-projects">
				<h3>Similar Projects</h3>
				{#each project.similarProjects as similarProject}
					<a href={`/projects/${similarProject.slug}`} class="project-info-similar-project">
						{#if similarProject.photoGallery && similarProject.photoGallery.length > 0}
							<img src={similarProject.photoGallery[0].image.asset.url} alt={similarProject.name} />
						{/if}
						<span>{similarProject.name}</span>
						<span>{similarProject.location}</span>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</section>
