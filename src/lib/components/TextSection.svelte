<script>
	import TextToken from './TextToken.svelte';

	export let title;
	export let content;
	export let active = false;
	export let progress = 0;

	$: totalTokens = content.reduce((sum, paragraph) => sum + paragraph.length, 0);
	$: activeTokenIndex = Math.floor(progress * totalTokens);

	function getTokenIndex(pIndex, tIndex) {
		return content.slice(0, pIndex).reduce((sum, p) => sum + p.length, 0) + tIndex;
	}
</script>

<section
	class={`py-8 h-screen flex flex-col justify-center ${
		active ? 'opacity-100' : 'opacity-0'
	} transition-opacity ease-in-out`}
>
	<h1 class="text-2xl font-bold mb-4">{@html title}</h1>
	{#each content as paragraph, pIndex}
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
