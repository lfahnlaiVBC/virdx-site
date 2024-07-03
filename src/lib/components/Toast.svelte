<script>
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
	const dispatch = createEventDispatcher();
	export let type = 'error';
	export let dismissible = true;
</script>

<article
	class={`rounded p-3 mb-2 mx-auto w-80 flex items-center ${type === 'error' ? 'bg-red-500' : type === 'success' ? 'bg-green-500' : 'bg-blue-400'}`}
	role="alert"
	transition:fade
>
	<div class="ml-4 text-white">
		<slot />
	</div>

	{#if dismissible}
		<button
			class="ml-auto text-white bg-transparent border-0 p-0 leading-none text-base"
			on:click={() => dispatch('dismiss')}
		>
			<svg
				class="w-4 h-4 inline-block align-middle"
				aria-hidden="true"
				focusable="false"
				role="img"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 352 512"
			>
				<path
					fill="currentColor"
					d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
				/>
			</svg>
		</button>
	{/if}
</article>
