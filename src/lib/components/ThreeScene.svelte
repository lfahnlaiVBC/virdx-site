<script>
	import { Canvas, T } from '@threlte/core';
	import { useTexture } from '@threlte/extras';
	import { AdditiveBlending, DoubleSide } from 'three';
	import { spring } from 'svelte/motion';

	export let animationId;
	export let progress;
	export let overallProgress = 0;
	export let index = 0;
	export let count = 1;

	// Create spring stores for smooth animations
	const planeOpacity = spring(1);
	const blobOpacity = spring(0);
	const cubeColor = spring({ r: 0.2, g: 0.6, b: 0.9 });
	const sphereZoom = spring(1);

	$: {
		updateAnimation(animationId, progress);
	}

	function updateAnimation(id, prog) {
		switch (id) {
			case 'introScene':
				planeOpacity.set(1 - prog * 0.6);
				blobOpacity.set(prog * 0.6);
				cubeColor.set({ r: 0.2 + prog * 0.3, g: 0.6 - prog * 0.3, b: 0.9 - prog * 0.3 });
				sphereZoom.set(1 + prog * 0.6);
				break;
			case 'waterScene':
				planeOpacity.set(1 - prog * 0.6);
				blobOpacity.set(prog * 0.6);
				sphereZoom.set(1 + prog * 0.6);
				break;
			default:
				// Reset to default values
				planeOpacity.set(1);
				blobOpacity.set(0);
				cubeColor.set({ r: 0.2, g: 0.6, b: 0.9 });
				sphereZoom.set(1);
		}
	}

	$: meshZoomLevel = 1 + overallProgress * 4;
	$: maskZoomLevel =
		overallProgress < 0.45 ? 1 : overallProgress > 0.5 ? 0.05 : 1 - (overallProgress - 0.45) * 20;
	$: sphereZoomLevel = 1 + overallProgress * 2;
</script>

<div class={$$restProps.class}>
	<Canvas>
		<T.OrthographicCamera makeDefault position={[0, 0, 10]} zoom={100} />
		<T.DirectionalLight position={[5, 5, 5]} intensity={1} />
		<T.AmbientLight intensity={0.5} />

		<T.Group scale={[meshZoomLevel, meshZoomLevel, 1]}>
			<T.Mesh rotation.z={0}>
				<T.PlaneGeometry args={[20, 20]} />
				{#await useTexture('/BMD_histology.jpg') then texture}
					<T.MeshStandardMaterial
						map={texture}
						color={$cubeColor}
						blending={AdditiveBlending}
						transparent
						opacity={$planeOpacity}
					/>
				{/await}
			</T.Mesh>
		</T.Group>

		<T.Group scale={[maskZoomLevel, maskZoomLevel, 1]}>
			<T.Mesh rotation.z={0}>
				<T.PlaneGeometry args={[15, 15]} />
				{#await useTexture('/logo_white.svg') then logo}
					<T.ShaderMaterial
						transparent
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
                                float alpha = 1.0 - texColor.r; // Invert the alpha
                                gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
                            }
                        `}
					/>
				{/await}
			</T.Mesh>
		</T.Group>

		<T.Mesh scale={[$sphereZoom, $sphereZoom, $sphereZoom]} let:ref>
			<T.SphereGeometry args={[0.5, 64, 64]} />
			<T.MeshStandardMaterial color="navy" transparent opacity={$blobOpacity} />
		</T.Mesh>
	</Canvas>
</div>
