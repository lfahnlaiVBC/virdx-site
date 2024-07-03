<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { useTexture } from '@threlte/extras';
	import { AdditiveBlending, DoubleSide, Color, Vector3 } from 'three';
	import { spring } from 'svelte/motion';

	export let sceneProgress: number;
	export let visibility: number;

	const rgbBlobOpacity = spring(1);
	const histologyOpacity = spring(0);
	const sceneZoom = spring(1);
	const logoMaskZoom = spring(0);

	$: {
		rgbBlobOpacity.set(Math.max(0, 1 - sceneProgress * 2.5));
		histologyOpacity.set(Math.min(1, sceneProgress * 2.5));
		sceneZoom.set(1 + sceneProgress * 0.5);
		logoMaskZoom.set(sceneProgress > 0.9 ? 20 : 0.01);
	}

	const blobColors = ['red', 'green', 'blue'];

	const blobPositions = [
		[-0.7, 0.4, 0],
		[0.7, 0.4, 0],
		[0, -0.6, 0]
	];

	const blobSizes = [0.7, 0.75, 0.85];

	const blobUniforms = blobColors.map((color) => ({
		time: { value: 0 },
		color: { value: new Color(color) },
		opacity: { value: 1 }
	}));

	useTask(() => {
		blobUniforms.forEach((uniform, i) => {
			uniform.time.value += 0.001 * (i + 1);
			uniform.opacity.value = $rgbBlobOpacity;
		});
	});
</script>

<T.Group visible={sceneProgress === 0 || visibility !== 0} scale={[$sceneZoom, $sceneZoom, 1]}>
	{#each blobUniforms as uniforms, i}
		<T.Mesh position={blobPositions[i]} scale={blobSizes[i]}>
			<T.SphereGeometry args={[1, 64, 64]} />
			<T.ShaderMaterial
				blending={AdditiveBlending}
				transparent={true}
				{uniforms}
				vertexShader={`
						varying vec2 vUv;
						uniform float time;
						void main() {
							vUv = uv;
							vec3 pos = position;
							float factor = ${i + 1}.0;
							pos.x += sin(pos.y * 3.0 + time * factor) * 0.15;
							pos.y += cos(pos.x * 3.0 + time * factor) * 0.15;
							pos.z += sin(pos.x * pos.y + time * factor) * 0.15;
							gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
						}
					`}
				fragmentShader={`
						varying vec2 vUv;
						uniform vec3 color;
						uniform float opacity;
						void main() {
							gl_FragColor = vec4(color, opacity);
						}
					`}
			/>
		</T.Mesh>
	{/each}

	<T.Mesh>
		<T.CircleGeometry args={[2, 64]} />
		{#await useTexture('/BMD_histology.jpg') then texture}
			<T.MeshBasicMaterial map={texture} transparent={true} opacity={$histologyOpacity} />
		{/await}
	</T.Mesh>

	<T.Group scale={[$logoMaskZoom, $logoMaskZoom, 1]}>
		<T.Mesh>
			<T.PlaneGeometry args={[4, 4]} />
			{#await useTexture('/logo_white.svg') then logo}
				<T.ShaderMaterial
					transparent={true}
					depthTest={false}
					depthWrite={false}
					side={DoubleSide}
					uniforms={{
						logoTexture: { value: logo }
					}}
					vertexShader={`
							varying vec2 vUv;
							void main() {
								vUv = uv;
								gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
							}
						`}
					fragmentShader={`
							uniform sampler2D logoTexture;
							varying vec2 vUv;
							void main() {
								vec4 texColor = texture2D(logoTexture, vUv);
								float alpha = 1.0 - texColor.r;
								gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
							}
						`}
				/>
			{/await}
		</T.Mesh>
	</T.Group>
</T.Group>
