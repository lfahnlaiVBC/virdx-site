<script>
	import { onMount } from 'svelte';
	import Person from './Person.svelte';

	let items = [];
	let containerWidth = 0;
	let gapSize = 0;

	onMount(async () => {
		const response = await fetch('/api/teamData');
		items = await response.json();
	});

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
				<Person name={item.name} img={item.img} w="w-28" h="h-28" />
			</div>
		{/each}
	</div>
</div>
