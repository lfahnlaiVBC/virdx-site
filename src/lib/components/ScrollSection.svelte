<script>
	export let section;
	export let index;
	export let totalSections;
</script>

<section
	class="place-content-center font-normal text-xl text-center max-w-prose"
	style="height: calc(100vh / {totalSections})"
>
	{#if typeof section === 'string'}
		{@html section}
	{:else if typeof section === 'function'}
		<svelte:component this={section} />
	{:else}
		<slot />
	{/if}
</section>
