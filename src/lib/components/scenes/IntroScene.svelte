<script lang="ts">
	import { T } from '@threlte/core';
	import { useTexture } from '@threlte/extras';
	import { AdditiveBlending, DoubleSide } from 'three';
	import { spring } from 'svelte/motion';

	export let sceneProgress: number;
	export let visibility: number;

	const planeOpacity = spring(1);
	const cubeColor = spring({ r: 0.2, g: 0.6, b: 0.9 });
	const histoZoom = spring(1);
	const logoMaskZoom = spring(1);

	$: {
		planeOpacity.set(1 - sceneProgress * 0.6);
		cubeColor.set({
			r: 0.2 + sceneProgress * 0.3,
			g: 0.6 - sceneProgress * 0.3,
			b: 0.9 - sceneProgress * 0.3
		});
		histoZoom.set(1 + sceneProgress * 4);
		logoMaskZoom.set(
			sceneProgress < 0.45 ? 1 : sceneProgress > 0.5 ? 0.05 : 1 - (sceneProgress - 0.45) * 20
		);
	}
</script>

<T.Group visible={sceneProgress === 0 || visibility !== 0}>
	<T.Group scale={[$histoZoom, $histoZoom, 1]}>
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

	<T.Group scale={[$logoMaskZoom, $logoMaskZoom, 1]}>
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
</T.Group>
