<script lang="ts">
	import { spring } from 'svelte/motion';
	import TextToken from './TextToken.svelte';
	import { progressStore } from '$lib/stores/progressStore';
	export let section;
	export let sectionIndex;
	const visibility = spring(0);
	$: {
		const { overallProgress, totalSections } = $progressStore;
		const sectionDuration = 1 / totalSections;
		const sectionStart = sectionIndex * sectionDuration;
		const sectionEnd = (sectionIndex + 1) * sectionDuration;

		if (overallProgress < sectionStart || overallProgress > sectionEnd) {
			visibility.set(0);
		} else {
			const sectionProgress = (overallProgress - sectionStart) / sectionDuration;
			visibility.set(1 - Math.abs(2 * sectionProgress - 1));
		}
	}
	$: active = $progressStore.currentSectionIndex === sectionIndex;
	$: progress = active ? $progressStore.currentProgress : 0;
	$: totalTokens = section.content.reduce((sum, paragraph) => sum + paragraph.length, 0);
	$: activeTokenIndex = Math.floor(progress * totalTokens);

	function getTokenIndex(pIndex, tIndex) {
		return section.content.slice(0, pIndex).reduce((sum, p) => sum + p.length, 0) + tIndex;
	}
</script>

<section
	class={`py-8 h-screen flex flex-col justify-center ${
		active ? 'opacity-100' : 'opacity-0'
	} transition-opacity ease-in-out`}
>
	<h1 class="text-2xl font-bold mb-4">{@html section.title}</h1>
	{#each section.content as paragraph, pIndex}
		<p class="mb-2">
			{#each paragraph as token, tIndex}
				<TextToken
					text={token.text}
					style={token.style}
					active={active && getTokenIndex(pIndex, tIndex) <= activeTokenIndex}
				/>
			{/each}
		</p>
	{/each}
</section>
