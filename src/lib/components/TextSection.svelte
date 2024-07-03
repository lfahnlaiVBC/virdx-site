<script lang="ts">
	import { onMount } from 'svelte';
	import { progressStore } from '$lib/stores/progressStore';
	import { triggerStore } from '$lib/stores/triggerStore';
	import TextToken from './TextToken.svelte';

	export let section;
	export let sectionIndex;

	$: active = $progressStore.currentSectionIndex === sectionIndex;
	$: progress = active ? $progressStore.currentProgress : 0;

	let triggerRanges = [];
	let totalTokens = 0;

	onMount(() => {
		// Calculate total tokens and trigger ranges
		totalTokens = section.content.reduce((sum, paragraph) => sum + paragraph.length, 0);

		if (section.triggers) {
			triggerRanges = Object.entries(section.triggers).map(([phrase, event]) => {
				const phraseTokens = phrase.split(/\s+/);
				let phraseStart = -1;
				let phraseEnd = -1;
				let tokenCount = 0;

				for (const paragraph of section.content) {
					for (const token of paragraph) {
						if (token.text.trim() === phraseTokens[0] && phraseStart === -1) {
							phraseStart = tokenCount;
						}
						if (phraseStart !== -1 && tokenCount - phraseStart + 1 === phraseTokens.length) {
							phraseEnd = tokenCount;
							break;
						}
						tokenCount++;
					}
					if (phraseEnd !== -1) break;
				}

				return { start: phraseStart, end: phraseEnd, event, phrase };
			});
		}

		return () => {
			// Clean up any active triggers when component unmounts
			triggerRanges.forEach((range) => triggerStore.removeTrigger(range.event));
		};
	});

	$: activeTokenIndex = Math.floor(progress * totalTokens);

	const triggerBuffer = 5;

	$: {
		if (active) {
			triggerRanges.forEach((range) => {
				if (
					activeTokenIndex >= range.start - triggerBuffer &&
					activeTokenIndex <= range.end + triggerBuffer
				) {
					triggerStore.addTrigger(range.event, range.phrase);
				} else {
					triggerStore.removeTrigger(range.event);
				}
			});
		} else {
			triggerRanges.forEach((range) => triggerStore.removeTrigger(range.event));
		}
	}

	function getTokenIndex(pIndex, tIndex) {
		return section.content.slice(0, pIndex).reduce((sum, p) => sum + p.length, 0) + tIndex;
	}
</script>

<section class="h-screen flex flex-col justify-around">
	{#each section.content as paragraph, pIndex}
		<p class="caption">
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
