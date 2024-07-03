<script lang="ts">
	export let text: string;
	export let style: string = '';
	export let active: boolean = false;
</script>

<span class="{style} transition-opacity ease-in-out {active ? 'opacity-100' : 'opacity-15'}"
	>{text}</span
>
