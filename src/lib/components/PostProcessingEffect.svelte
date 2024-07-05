<script lang="ts">
	import { useThrelte, useFrame } from '@threlte/core';
	import { EffectComposer, RenderPass, EffectPass } from 'postprocessing';
	import { onMount } from 'svelte';
	import type { WebGLRenderer, Scene, Camera } from 'three';

	export let effects: any[] = [];
	export let disable = false;

	const { renderer, scene, camera } = useThrelte();

	let composer: EffectComposer;
	let isReady = false;

	onMount(() => {
		if (renderer && scene && camera) {
			setupEffectComposer(renderer, scene, camera);
		}

		return () => {
			if (composer) {
				composer.dispose();
			}
		};
	});

	function setupEffectComposer(renderer: WebGLRenderer, scene: Scene, camera: Camera) {
		if (composer) {
			composer.dispose();
		}

		composer = new EffectComposer(renderer);
		const renderPass = new RenderPass(scene, camera);
		composer.addPass(renderPass);

		const effectPass = new EffectPass(camera, ...effects);
		composer.addPass(effectPass);

		isReady = true;
	}

	useFrame(() => {
		if (isReady && composer && !disable) {
			composer.render();
		}
	});
</script>
