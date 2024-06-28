<script>
	import { onMount, onDestroy } from 'svelte';
	export let registerSection;
	export let totalSections;
	let sectionRef;
	let unregister;

	onMount(() => {
		if (sectionRef && registerSection) {
			unregister = registerSection(sectionRef);
		}
	});

	onDestroy(() => {
		if (unregister) {
			unregister();
		}
	});
</script>

<section
	bind:this={sectionRef}
	class="place-content-center {$$restProps.class}"
	style="height: calc(100vh / {totalSections})"
>
	<slot></slot>
</section>
