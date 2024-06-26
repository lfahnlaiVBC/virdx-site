<script>
	import Person from './Person.svelte';
	export let items = [];
	let containerWidth = 0;
	let gapSize = 0;
	$: {
		if (containerWidth > 0) {
			const numColumns = 6;
			const gapWidth = containerWidth / numColumns;
			gapSize = Math.floor(gapWidth / 4); // Tailwind gap sizes are in multiples of 0.25rem
		}
	}
</script>

<div class="flex justify-center">
	<div class="container grid grid-cols-6 gap-y-{gapSize}" bind:clientWidth={containerWidth}>
		{#each items as item, index}
			<div
				class="relative w-32 h-32 flex items-center justify-center rounded-full"
				style="transform: translateY({index % 2 === 1 ? 'calc(-50% + 0.5rem)' : '0'});"
			>
				<Person name={item.name} img={item.img} />
			</div>
		{/each}
	</div>
</div>
