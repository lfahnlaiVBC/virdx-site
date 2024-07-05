<script lang="ts">
	import { T, useFrame } from '@threlte/core';
	import { useTexture } from '@threlte/extras';
	import { onMount, onDestroy } from 'svelte';
	import {
		Vector3,
		MeshStandardMaterial,
		Color,
		DoubleSide,
		AdditiveBlending,
		MeshPhysicalMaterial,
		Group,
		Box3
	} from 'three';
	import createLensGeometry from '$lib/utils/createLensGeometry';
	let microscopeGroup: Group;

	export let sceneProgress: number;
	export let visibility: number;

	let time = 0;
	let animationFrame: number;

	// // const microscopePosition = spring({ x: 0, y: 0, z: 0 });
	// const microscopeRotation = spring({ x: 0, y: 0, z: 0 });
	const microscopeSeparation = 1;

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

	// $: {
	// 	if (sceneProgress <= 0.25) {
	// 		const progress = sceneProgress / 0.25;
	// 		microscopeRotation.set({ x: 90 * progress, y: 0, z: 30 * progress });
	// 		microscopeSeparation.set(1 + 0.5 * progress);
	// 	} else if (sceneProgress <= 0.5) {
	// 		const progress = (sceneProgress - 0.25) / 0.25;
	// 		mriScannerScale.set(0.5 + 0.5 * progress);
	// 		tissueModelOpacity.set(progress);
	// 	} else if (sceneProgress <= 0.75) {
	// 		const progress = (sceneProgress - 0.5) / 0.25;
	// 		inputLensOpacity.set(progress);
	// 		outputLensOpacity.set(progress);
	// 	} else {
	// 		const progress = (sceneProgress - 0.75) / 0.25;
	// 		histologySlideOpacity.set(progress);
	// 	}

	// 	backgroundWaveIntensity.set(sceneProgress);
	// }

	// useFrame((_, delta) => {
	// 	time += delta;
	// 	microscopePosition.update(($p) => ({ ...$p, y: $p.y + Math.sin(time * 0.5) * 0.001 }));
	// 	microscopeSeparation.update(($s) => $s + Math.sin(time) * 0.0005);
	// });

	const histologyTexture = useTexture('/BMD_histology.jpg');

	// let dataPulses: { position: Vector3; scale: number; color: Color }[] = [];
	// for (let i = 0; i < 50; i++) {
	// 	dataPulses.push({
	// 		position: new Vector3(
	// 			(Math.random() - 0.5) * 10,
	// 			(Math.random() - 0.5) * 10,
	// 			(Math.random() - 0.5) * 10
	// 		),
	// 		scale: 0.05 + Math.random() * 0.05,
	// 		color: new Color().setHSL(Math.random() * 0.1 + 0.6, 1, 0.5)
	// 	});
	// }
	const biconvexGeometry = createLensGeometry(1, 0.3, 0.2, 0.2, 32);
	function adjustPivot(group: Group) {
		const offset = new Vector3(0, 2 * microscopeSeparation, 0);
		console.log(offset);
		group.position.add(offset);
		group.children.forEach((child) => {
			child.position.sub(offset);
		});
	}
	$: if (microscopeGroup && microscopeSeparation) {
		adjustPivot(microscopeGroup);
	}
	let composer;
</script>

<T.Group visible={visibility !== 0}>
	<!-- Background -->
	<T.Mesh visible={false}>
		<T.PlaneGeometry args={[20, 20]} />
		<T.ShaderMaterial
			transparent={true}
			side={DoubleSide}
			uniforms={{
				uTime: { value: time },
				uColorA: { value: new Color('#000066') },
				uColorB: { value: new Color('#9900cc') },
				uWaveIntensity: { value: sceneProgress }
			}}
			vertexShader={`
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `}
			fragmentShader={`
                uniform float uTime;
                uniform vec3 uColorA;
                uniform vec3 uColorB;
                uniform float uWaveIntensity;
                varying vec2 vUv;
                void main() {
                    vec3 color = mix(uColorA, uColorB, vUv.y + sin(vUv.x * 10.0 + uTime) * 0.1 * uWaveIntensity);
                    gl_FragColor = vec4(color, 1.0);
                }
            `}
		/>
	</T.Mesh>

	<T.Group position={[0, 0, 0]} rotation={[0, 0, 0]} bind:ref={microscopeGroup}>
		{#each Array(5) as _, i}
			<!-- <T.Mesh position={[0, i * microscopeSeparation, 0]}>
				<T.CylinderGeometry args={[0.5, 0.5, 0.1, 32]} />
				<T.MeshStandardMaterial transparent={true} metalness={0.3} roughness={0.2} />
			</T.Mesh> -->
			<T.Mesh
				geometry={biconvexGeometry}
				position={[0, i * microscopeSeparation, 0]}
				rotation={[-0.25 * sceneProgress, 0, 0]}
			>
				<T.MeshPhysicalMaterial
					color={0xffffff}
					transparent={true}
					opacity={0.5}
					roughness={0.1}
					transmission={0.9}
					thickness={0.2}
				/>
			</T.Mesh>
		{/each}
	</T.Group>

	<!-- Histology Slide -->
	<!-- <T.Mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
		<T.PlaneGeometry args={[2, 2]} />
		<T.MeshStandardMaterial map={$histologyTexture} transparent opacity={sceneProgress} />
	</T.Mesh> -->

	<!-- Data Pulses -->
	<!-- {#each dataPulses as pulse}
		<T.Mesh position={pulse.position} scale={pulse.scale}>
			<T.SphereGeometry args={[1, 16, 16]} />
			<T.MeshStandardMaterial
				color={pulse.color}
				emissive={pulse.color}
				emissiveIntensity={2}
				transparent={true}
				opacity={0.7}
				blending={AdditiveBlending}
			/>
		</T.Mesh>
	{/each} -->
</T.Group>
