<script lang="ts">
	import { onMount } from 'svelte';
	import { progressStore } from '$lib/stores/progressStore';
	import { triggerStore } from '$lib/stores/triggerStore';
	import TextToken from './TextToken.svelte';

	export let section;
	export let sectionIndex;

	$: active = $progressStore.currentSectionIndex === sectionIndex;
	$: progress = active ? $progressStore.currentProgress : 0;

	let activeTrigger = null;

	onMount(() => {
		// console.log('TextSection mounted', { sectionIndex, triggers: section.triggers });
		return () => {
			if (activeTrigger) {
				triggerStore.removeTrigger(activeTrigger);
			}
		};
	});

	$: totalTokens = section.content.reduce((sum, paragraph) => sum + paragraph.length, 0);
	$: activeTokenIndex = Math.floor(progress * totalTokens);

	function getTokenIndex(pIndex, tIndex) {
		return section.content.slice(0, pIndex).reduce((sum, p) => sum + p.length, 0) + tIndex;
	}

	function checkTriggers() {
		if (!section.triggers || !active) {
			// console.log('Skipping trigger check', { active, hasTriggers: !!section.triggers });
			return;
		}

		const visibleText = section.content
			.flat()
			.slice(0, activeTokenIndex + 1)
			.map((token) => token.text)
			.join('');
		// console.log('Checking triggers', { visibleText, activeTokenIndex, triggers: section.triggers });

		let newTrigger = null;
		for (const [phrase, event] of Object.entries(section.triggers)) {
			if (visibleText.includes(phrase)) {
				newTrigger = event;
				// console.log('Trigger phrase found', { phrase, event });
			} else if (activeTrigger === event) {
				// console.log('Removing trigger', { event });
				triggerStore.removeTrigger(event);
				activeTrigger = null;
			}
		}

		if (newTrigger && newTrigger !== activeTrigger) {
			console.log('Setting new trigger', { newTrigger });
			if (activeTrigger) {
				triggerStore.removeTrigger(activeTrigger);
			}
			triggerStore.addTrigger(newTrigger);
			activeTrigger = newTrigger;
		}
	}

	$: {
		// console.log('Reactive statement running', { active, progress, activeTokenIndex });
		if (active) {
			checkTriggers();
		}
	}

	function isRelevantToken(token, pIndex, tIndex) {
		if (!section.triggers) return false;
		const tokenIndex = getTokenIndex(pIndex, tIndex);
		return (
			Object.keys(section.triggers).some((phrase) => phrase.includes(token.text)) &&
			tokenIndex <= activeTokenIndex
		);
	}
</script>

<section class="py-8 h-screen flex flex-col justify-around">
	{#each section.content as paragraph, pIndex}
		<p class="mb-2">
			{#each paragraph as token, tIndex}
				<TextToken
					text={token.text}
					style={token.style}
					active={active && getTokenIndex(pIndex, tIndex) <= activeTokenIndex}
					isRelevant={isRelevantToken(token, pIndex, tIndex)}
				/>
			{/each}
		</p>
	{/each}
</section>
