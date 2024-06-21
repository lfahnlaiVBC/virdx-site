<script>
	export let img;
	export let name;
</script>

<div class="relative w-28 h-28 group">
	<div
		class="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center items-center"
	>
		<span class="text-white text-xl text-center">{name}</span>
	</div>
	<div class="relative z-0">
		<img src={img} alt={name} class="w-28 h-28 object-cover rounded-full" />
		<div
			class="absolute inset-0 border-8 border-transparent rounded-full group-hover:border-red-600 transition-all"
		></div>
	</div>
</div>

<style>
</style>
