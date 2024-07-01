<script>
	export let text;
	export let style = '';
	export let active = false;
</script>

<span
	class="{style} {$$restProps.class} transition-opacity ease-in-out {active
		? 'opacity-100'
		: 'opacity-25'}">{text}</span
>
