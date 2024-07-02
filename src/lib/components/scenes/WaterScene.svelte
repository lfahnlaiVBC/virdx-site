<script lang="ts">
	import { T } from '@threlte/core';
	import { useTexture } from '@threlte/extras';
	import { AdditiveBlending, Vector3 } from 'three';
	import { spring } from 'svelte/motion';
	import { progressStore } from '$lib/stores/progressStore';
	import { onMount, onDestroy } from 'svelte';

	export let sceneIndex = 1; // Assuming WaterScene is the second scene

	const visibility = spring(0);
	const waterOpacity = spring(0);
	const waterScale = spring(1);
	const waterColor = spring({ r: 0, g: 0.5, b: 1 });

	let time = 0;
	let animationFrame: number;

	$: {
		const { overallProgress, totalSections } = $progressStore;
		const sceneDuration = 1 / totalSections;
		const sceneStart = sceneIndex * sceneDuration;
		const sceneEnd = (sceneIndex + 1) * sceneDuration;

		if (overallProgress < sceneStart || overallProgress > sceneEnd) {
			visibility.set(0);
		} else {
			const sceneProgress = (overallProgress - sceneStart) / sceneDuration;
			visibility.set(1 - Math.abs(2 * sceneProgress - 1));
		}

		const localProgress = (overallProgress - sceneStart) / sceneDuration;
		waterOpacity.set(localProgress * 10);
		waterScale.set(1 + localProgress * 0.5);
		waterColor.set({
			r: 0 + localProgress * 0.2,
			g: 0.5 + localProgress * 0.3,
			b: 1 - localProgress * 0.2
		});
	}

	function animate() {
		time += 0.01;
		animationFrame = requestAnimationFrame(animate);
	}

	onMount(() => {
		animate();
	});

	onDestroy(() => {
		if (animationFrame) {
			cancelAnimationFrame(animationFrame);
		}
	});
</script>

<T.Group visible={$visibility > 0}>
	<T.Mesh scale={[$waterScale, $waterScale, 1]}>
		<T.PlaneGeometry args={[20, 20, 32, 32]} />
		<T.ShaderMaterial
			transparent
			blending={AdditiveBlending}
			uniforms={{
				uTime: { value: time },
				uColor: { value: new Vector3($waterColor.r, $waterColor.g, $waterColor.b) },
				uOpacity: { value: $waterOpacity * $visibility }
			}}
			vertexShader={`
                uniform float uTime;
                varying vec2 vUv;
                void main() {
                    vec3 pos = position;
                    float wave = sin(pos.x * 5.0 + uTime) * 0.1 
                               + cos(pos.y * 5.0 + uTime) * 0.1;
                    pos.z += wave;
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `}
			fragmentShader={`
                uniform vec3 uColor;
                uniform float uOpacity;
                varying vec2 vUv;
                void main() {
                    gl_FragColor = vec4(uColor, uOpacity);
                }
            `}
		/>
	</T.Mesh>

	<T.Mesh scale={[$waterScale, $waterScale, $waterScale]}>
		<T.SphereGeometry args={[3, 64, 64]} />
		{#await useTexture('/water_normal.jpeg') then texture}
			<T.MeshStandardMaterial
				normalMap={texture}
				color="#ff0000"
				metalness={0.9}
				roughness={0.1}
				transparent
				opacity={$waterOpacity * $visibility}
			/>
		{/await}
	</T.Mesh>
</T.Group>
