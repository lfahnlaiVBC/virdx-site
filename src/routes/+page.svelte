<script lang="ts">
	import Toasts from '$lib/components/Toasts.svelte';
	import { onMount } from 'svelte';
	import { Canvas, T } from '@threlte/core';
	import SceneWrapper from '$lib/components/SceneWrapper.svelte';
	import TextSection from '$lib/components/TextSection.svelte';
	import { progressStore, updateProgress, calculateVisibility } from '$lib/stores/progressStore';
	import { triggerStore } from '$lib/stores/triggerStore';

	import sections from '$lib/sections';
	import Team from '$lib/components/Team.svelte';
	let teamData;
	import { marked } from 'marked';

	const tokenizeParagraph = (paragraph) => {
		const chunks = paragraph.split(/(\*\*.*?\*\*|\*.*?\*)/g);
		const tokens = [];
		chunks.forEach((chunk) => {
			if (chunk.startsWith('**') && chunk.endsWith('**')) {
				// Bold text
				chunk
					.slice(2, -2)
					.split(/(\s+)/)
					.forEach((word) => {
						if (word) tokens.push({ text: word, style: 'caption-strong' });
					});
			} else if (chunk.startsWith('*') && chunk.endsWith('*')) {
				// Italic text
				chunk
					.slice(1, -1)
					.split(/(\s+)/)
					.forEach((word) => {
						if (word) tokens.push({ text: word, style: 'caption-em' });
					});
			} else {
				// Normal text
				chunk.split(/(\s+)/).forEach((word) => {
					if (word) tokens.push({ text: word, style: '' });
				});
			}
		});

		return tokens;
	};

	const processSection = (section) => ({
		...section,
		title: marked.parseInline(section.title),
		content: section.content.map(tokenizeParagraph)
	});

	$: processedSections = sections.map(processSection);

	const handleScroll = () => {
		if (typeof window !== 'undefined') {
			updateProgress(
				window.scrollY || document.documentElement.scrollTop,
				document.documentElement.scrollHeight,
				sections.length,
				window.innerHeight
			);
		}
	};
	onMount(() => {
		window.addEventListener('scroll', handleScroll);
		handleScroll();
		return () => {
			window.removeEventListener('scroll', handleScroll);
			triggerStore.reset();
		};
	});
	onMount(async () => {
		const response = await fetch('/api/teamData');
		teamData = await response.json();
	});
	// $: console.log(
	// 	`current: ${$progressStore.currentProgress} overall: ${$progressStore.overallProgress} `
	// );
	const sceneDuration = 1;
</script>

<Toasts />
<div class="flex flex-col md:flex-row min-h-screen">
	<div class="w-full md:h-screen md:w-1/2 px-[5%] mb-8 md:mb-0">
		{#each processedSections as section, index (section.title)}
			<svelte:component this={TextSection} {section} sectionIndex={index} />
		{/each}
	</div>
	<div class="w-full md:w-1/2 h-screen md:ml-[50%] fixed">
		<Canvas>
			<T.OrthographicCamera makeDefault position={[0, 0, 10]} zoom={100} />
			<T.DirectionalLight position={[5, 5, 5]} intensity={1} />
			<T.AmbientLight intensity={0.5} />
			<SceneWrapper>
				{#each sections as section, sceneIndex}
					<svelte:component
						this={section.scene}
						sceneProgress={$progressStore.currentProgress}
						visibility={calculateVisibility(
							sceneIndex,
							sceneDuration,
							$progressStore.overallProgress,
							$progressStore.totalSections
						)}
					/>
				{/each}
			</SceneWrapper>
		</Canvas>
	</div>
	<div class="w-full flex flex-col items-center fixed bg-black bg-opacity-50">
		<h1
			class="text-5xl font-bold mb-4 text-white gridlite"
			style="--font-wght-g: {Math.floor(50 + $progressStore.currentProgress * 400)};"
		>
			{@html processedSections[$progressStore.currentSectionIndex].title}
		</h1>

		<div class="w-full flex flex-row justify-around items-center">
			<h2 class="text-xl font-bold text-white my-auto">
				scene: {($progressStore.currentProgress * 100).toFixed(1)}%
			</h2>
			<h2 class="text-xl font-bold text-white my-auto">
				page: {($progressStore.overallProgress * 100).toFixed(1)}%
			</h2>
		</div>
	</div>
</div>
<!-- <div class="w-full h-screen flex flex-row">
	

		<section class="section">
			<h1>Who We Are</h1>
			<div>
				<Team items={team} />
				<p>
					We are physicians | engineers | physicists | biologists | computer scientists | health
					economists dreaming of a world where seeing the building blocks of the human body opens up
					new pathways to healing it.
				</p>
				<p>We're looking for team members+collaborators+funders</p>
			</div>
		</section>
	</div>
	<div class="w-1/2 flex-shrink-0"></div>
</div> -->
