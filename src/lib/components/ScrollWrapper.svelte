<script>
	import Scroller from '@sveltejs/svelte-scroller';
	export let top = 0;
	export let bottom = 1;
	export let threshold = 0.5;
	export let parallax = true;
	export let progress = 0;
	let index = 0;
	let count = 0;
</script>

<Scroller {top} {bottom} {threshold} {parallax} bind:progress bind:index bind:count>
	<div slot="background">
		<slot name="background" {progress} {index} {count} />
	</div>
	<div slot="foreground">
		<slot name="foreground" {progress} {index} {count} />
	</div>
</Scroller>
