<script lang="ts">
	import { useThrelte, useTask } from '@threlte/core';
	import { onMount } from 'svelte';
	import { EffectComposer, RenderPass, ShaderPass } from 'postprocessing';
	import { Vector2, ShaderMaterial } from 'three';

	const { scene, renderer, camera, size } = useThrelte();

	let composer: EffectComposer;
	let dotScreenPass: ShaderPass | null = null;

	export let angle = 0.5;
	export let scale = 1.0;
	export let disable = false;

	const DotScreenShader = {
		uniforms: {
			tDiffuse: { value: null },
			angle: { value: 0.5 },
			scale: { value: 1.0 },
			resolution: { value: new Vector2() }
		},
		vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
		fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform float angle;
      uniform float scale;
      uniform vec2 resolution;
      varying vec2 vUv;

      float pattern(vec2 uv) {
        float s = sin(angle), c = cos(angle);
        vec2 tex = uv * resolution;
        vec2 point = vec2(
          c * tex.x - s * tex.y,
          s * tex.x + c * tex.y
        ) * scale;
        return (sin(point.x) * sin(point.y)) * 4.0;
      }

      void main() {
        vec4 color = texture2D(tDiffuse, vUv);
        float average = (color.r + color.g + color.b) / 3.0;
        float dot = pattern(vUv);
        gl_FragColor = vec4(vec3(1.0 - smoothstep(dot, dot + 0.1, average)), 1.0);
      }
    `
	};

	const setupEffectComposer = (camera) => {
		if (composer) {
			composer.removeAllPasses();
		} else {
			composer = new EffectComposer(renderer);
		}

		composer.addPass(new RenderPass(scene, camera));

		const dotScreenMaterial = new ShaderMaterial({
			uniforms: DotScreenShader.uniforms,
			vertexShader: DotScreenShader.vertexShader,
			fragmentShader: DotScreenShader.fragmentShader
		});

		dotScreenPass = new ShaderPass(dotScreenMaterial, 'tDiffuse');
		composer.addPass(dotScreenPass);

		updateUniforms();
	};

	const updateUniforms = () => {
		if (dotScreenPass && dotScreenPass.material instanceof ShaderMaterial) {
			dotScreenPass.material.uniforms.angle.value = angle;
			dotScreenPass.material.uniforms.scale.value = scale;
			if ($size) {
				dotScreenPass.material.uniforms.resolution.value.set($size.width, $size.height);
			}
		}
	};

	$: if (dotScreenPass) {
		updateUniforms();
	}

	$: if ($camera) setupEffectComposer($camera);
	$: if (composer && $size) {
		composer.setSize($size.width, $size.height);
		updateUniforms();
	}

	const { renderStage, autoRender } = useThrelte();

	onMount(() => {
		let before = autoRender.current;
		autoRender.set(false);
		return () => autoRender.set(before);
	});

	useTask(
		(delta) => {
			if (composer && !disable) {
				composer.render(delta);
			}
		},
		{ stage: renderStage, autoInvalidate: false }
	);
</script>
