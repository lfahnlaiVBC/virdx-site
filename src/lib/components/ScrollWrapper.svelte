<script>
	import Scroller from '@sveltejs/svelte-scroller';
	export let top = 0;
	export let bottom = 1;
	export let threshold = 0.5;
	export let parallax = true;
	export let progress = 0;
	let index = 0;
	let count = 0;

	let sections = [];
	$: totalSections = sections.length;

	const registerSection = (section) => {
		sections = [...sections, section];
		return {
			destroy: () => {
				sections = sections.filter((s) => s !== section);
			}
		};
	};
</script>

<Scroller {top} {bottom} {threshold} {parallax} bind:progress bind:index bind:count>
	<div slot="background">
		<slot name="background" {progress} {index} {count} />
	</div>
	<div slot="foreground">
		<slot name="foreground" {progress} {index} {count} {totalSections} {registerSection} />
	</div>
</Scroller>
