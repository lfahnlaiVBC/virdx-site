<script lang="ts">
	import { inview } from 'svelte-inview';
	import ScrollWrapper from '$lib/components/ScrollWrapper.svelte';
	import ScrollSection from '$lib/components/ScrollSection.svelte';

	import { onMount } from 'svelte';
	import Team from '$lib/components/Team.svelte';
	import {
		AdditiveBlending,
		Vector3,
		ShaderMaterial,
		SphereGeometry,
		MeshBasicMaterial,
		DoubleSide
	} from 'three';
	import { Canvas, T, useTask } from '@threlte/core';
	import { useTexture } from '@threlte/extras';
	let count, index, offset, zoomLevel, team, scene;
	let blobMaterial;
	let blobGeometry;
	let planeOpacity = 1;
	let blobOpacity = 0;

	let globalProgress = 0;
	let progress1Raw = 0;
	let progress2Raw = 0;
	let progress3Raw = 0;

	$: progress1 = Math.max(0, Math.min(1, progress1Raw));
	$: progress2 = Math.max(0, Math.min(1, progress2Raw));
	$: progress3 = Math.max(0, Math.min(1, progress3Raw));
	$: if (globalProgress > 0.5) {
		planeOpacity = Math.max(0, 1 - (globalProgress - 0.5) * 2);
		blobOpacity = Math.min(1, (globalProgress - 0.5) * 2);
	} else {
		planeOpacity = 1;
		blobOpacity = 0;
	}
	const vertexShader = `
        uniform float time;
        varying vec2 vUv;
        void main() {
            vUv = uv;
            vec3 pos = position;
            pos.x += sin(pos.y * 10.0 + time) * 0.005;
            pos.y += cos(pos.x * 10.0 + time) * 0.005;
            pos.z += sin(pos.x * 10.0 + cos(pos.y * 10.0 + time)) * 0.005;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `;

	const fragmentShader = `
        uniform float opacity;
        varying vec2 vUv;
        void main() {
            vec3 color = vec3(0.2, 0.6, 0.9);
            gl_FragColor = vec4(color, opacity);
        }
    `;

	const sectionH = (nSections) => {
		return `${100 / (nSections - 1)}dvh`;
	};

	$: cubeColor = `hsl(${globalProgress * 360}, 100%, 50%)`;
	$: sphereZoomLevel = 1 + globalProgress * 2;

	$: meshZoomLevel = 1 + globalProgress * 4;
	$: maskZoomLevel =
		globalProgress < 0.45
			? 1
			: globalProgress > 0.5
				? 0.05
				: 1 - ((globalProgress - 0.45) * (1 - 0.05)) / 0.05;
	onMount(async () => {
		const response = await fetch('/api/teamData');
		team = await response.json();
	});
	const totalWrappers = 2;
	const calculateScrollBounds = (sectionIndex, totalWrappers) => {
		const wrapperHeight = 1 / totalWrappers;
		const top = wrapperHeight * sectionIndex;
		const bottom = top + wrapperHeight;
		return { top, bottom };
	};
	$: globalProgress = (progress1 + progress2) / totalWrappers;
	// onMount(() => {
	// 	blobMaterial = new ShaderMaterial({
	// 		uniforms: {
	// 			time: { value: 0 },
	// 			opacity: { value: 0 }
	// 		},
	// 		vertexShader,
	// 		fragmentShader,
	// 		transparent: true
	// 	});

	// 	blobGeometry = new SphereGeometry(0.5, 64, 64);
	// });
	// useTask((delta) => {
	// 	if (blobMaterial) {
	// 		blobMaterial.uniforms.time.value += delta;
	// 		blobMaterial.uniforms.opacity.value = blobOpacity;
	// 	}
	// });

	const sectionTypography = 'font-normal text-xl text-center max-w-prose ';
</script>

<div class="fixed -z-10 w-full h-full">
	<input type="range" min="0" max="1" step="0.01" bind:value={globalProgress} />
	<span>global progress: {globalProgress}</span>
	<p>Section {index + 1} of</p>
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
						color={cubeColor}
						blending={AdditiveBlending}
						transparent
						opacity={planeOpacity}
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

		<!-- <T.Mesh rotation.z={0} scale={[zoomLevel, zoomLevel, 1]}>
			<T.PlaneGeometry args={[15, 15]} />
			{#await useTexture('/BMD_histology.jpg') then texture}
				<T.MeshStandardMaterial
					map={texture}
					color={cubeColor}
					blending={AdditiveBlending}
					transparent
					opacity={planeOpacity}
				/>
			{/await}
		</T.Mesh> -->
		<T.Mesh scale={[sphereZoomLevel, sphereZoomLevel, sphereZoomLevel]} let:ref>
			<T.SphereGeometry args={[0.5, 64, 64]} />
			<T.MeshStandardMaterial color="navy" transparent opacity={blobOpacity} />
			<!-- <T.ShaderMaterial
				{vertexShader}
				{fragmentShader}
				uniforms={{
					time: { value: 0 },
					opacity: { value: blobOpacity }
				}}
				transparent
			/> -->
		</T.Mesh>
	</Canvas>
</div>
<div class="mx-auto w-4/5 md:w-2/3">
	<ScrollWrapper bind:progress={progress1Raw} {...calculateScrollBounds(0, totalWrappers)}>
		<div slot="background" class="h-screen place-content-center" let:index let:count let:progress>
			<h1 class="gridlite" style:--font-wght-g={Math.min(progress * 600, 600)}>
				An <em>in vivo</em> spatial microscope for the future of medicine.
			</h1>
			<p>Progress: {progress.toFixed(2)}, Section: {index + 1} of {count}</p>
		</div>
		<div slot="foreground" class="flex flex-col items-center" let:registerSection let:totalSections>
			<ScrollSection
				{registerSection}
				{totalSections}
				class="bg-red-500 bg-opacity-50 {sectionTypography}"
			>
				What if there was a way to examine <em>living tissues</em> inside our bodies?
			</ScrollSection>
			<ScrollSection
				{registerSection}
				{totalSections}
				class="bg-blue-500 bg-opacity-50 {sectionTypography}"
			>
				MRI scans can non-invasively reveal hidden structures but lack the resolution to positively
				discern specific tissues.
			</ScrollSection>
			<ScrollSection
				{registerSection}
				{totalSections}
				class="bg-green-500 bg-opacity-50 {sectionTypography}"
			>
				Microscopes have opened the door to countless biomedical advances, but they've never been
				able to see inside a living person.
			</ScrollSection>
			<ScrollSection
				{registerSection}
				{totalSections}
				class="bg-yellow-500 bg-opacity-50 {sectionTypography}"
			>
				We're building one that <strong>can.</strong>
			</ScrollSection>
		</div>
	</ScrollWrapper>

	<ScrollWrapper bind:progress={progress2Raw} {...calculateScrollBounds(1, totalWrappers)}>
		<div slot="background" class="h-screen place-content-center" let:index let:count let:progress>
			<h1 class="gridlite" style:--font-wght-g={Math.min(progress * 600, 600)}>
				Seeing with water
			</h1>
			<p>Progress: {progress.toFixed(2)}, Section: {index + 1} of {count}</p>
		</div>
		<div slot="foreground" class="flex flex-col items-center" let:registerSection let:totalSections>
			<ScrollSection
				{registerSection}
				{totalSections}
				class="bg-red-500 bg-opacity-50 {sectionTypography}"
			>
				The human body contains more than one billion billion billion molecules of water.
			</ScrollSection>
			<ScrollSection
				{registerSection}
				{totalSections}
				class="bg-blue-500 bg-opacity-50 {sectionTypography}"
			>
				The architecture of body tissues determines how freely water molecules are able to move
				through them.
			</ScrollSection>
			<ScrollSection
				{registerSection}
				{totalSections}
				class="bg-green-500 bg-opacity-50 {sectionTypography}"
			>
				This gives each tissue a distinct <strong>diffusion signature</strong> recognizable on MRI scans—but
				not by the human eye.
			</ScrollSection>
			<ScrollSection
				{registerSection}
				{totalSections}
				class="bg-yellow-500 bg-opacity-50 {sectionTypography}"
			>
				We're building an ML-powered, biophysically-grounded <em>in vivo</em> imaging platform that combines
				the promise of microscopy with the safety of MRI, and taps into the world's existing MRI infrastructure
				to help drive the healthcare advances of the 21st century.
			</ScrollSection>
		</div>
	</ScrollWrapper>
	<ScrollWrapper bind:progress={progress3Raw} {...calculateScrollBounds(1, totalWrappers)}>
		<div slot="background" class="h-screen place-content-center" let:index let:count let:progress>
			<h1 class="gridlite" style:--font-wght-g={Math.min(progress * 600, 600)}>How it works</h1>
			<p>Progress: {progress.toFixed(2)}, Section: {index + 1} of {count}</p>
		</div>
		<div slot="foreground" class="flex flex-col items-center" let:registerSection let:totalSections>
			<ScrollSection
				{registerSection}
				{totalSections}
				class="bg-red-500 bg-opacity-50 {sectionTypography}"
			>
				Our <em>in vivo</em> spatial microscopy platform combines a cutting-edge biophysical
				simulation platform, customized MRI protocols, and a rigorous, clinically-validated ground
				truth framework to generate pioneering synthetic histology.
				<div class="flex flex-row items-center justify-center transform-gpu">
					<div class="sub-section">
						<h2>Next-Generation MRI sensing</h2>
						<div>
							<p>
								Proprietary MRI protocols are optimized for machine learning and engineered for
								broad compatibility, allowing the vast network of existing MRI scanners to be
								upgraded into real-world histological sensors.
							</p>
						</div>
					</div>
					<div class="flex flex-col items-center justify-center transform-gpu">
						<h2>Biophysical simulation platform</h2>
						<div>
							<h3>Diffusion signature prediction</h3>
							<p>
								Groundbreaking biophysical models simulate the distinct MRI profiles of different
								tissues.
							</p>
							<h3>MRI tissue typing</h3>
							<p>
								Diffusion-aware classifier models resolve MRI signatures into detailed tissue maps
								that reveal salient histological features at the mesoscopic scale.
							</p>
						</div>
					</div>
					<div class="sub-section">
						<h2>Integrated Ground Truth Framework</h2>
						<div>
							<p>
								Fusing 3D bioengineering and next-generation computational registration, our
								patented ground truth pipeline achieves superior model accuracy and reliability by
								ensuring perfect spatial alignment between histopathology and MRI datasets.
							</p>
						</div>
					</div>
				</div>
			</ScrollSection>
		</div>
	</ScrollWrapper>

	<section class="section">
		<h1>Core Application</h1>
		<div>
			<h2>Non-Invasive Prostate Cancer Diagnostics</h2>
			<section style:height={sectionH(5)}>
				1 in 8 prostate glands will develop cancer at some point, but diagnostic biopsies are both
				risky and imprecise.
			</section>
			<section style:height={sectionH(5)}>
				Missed tumors, unnecessary treatment, and biopsy complications exact a staggering human and
				economic toll every year.
			</section>
			<section style:height={sectionH(5)}>
				VirDx is working to change that by developing our platform around a non-invasive prostate
				cancer diagnostic tool.
			</section>
			<section style:height={sectionH(5)}>
				With our partners in radiology and urology across the U.S. and Germany, we're using our
				proprietary ground truth framework to hone our models on the highest possible standard of
				histopathological and MRI data.
			</section>
			<section style:height={sectionH(5)}>
				By creating a non-invasive option for detecting and monitoring tumors, we're helping
				clinicians fix the leaky diagnostic pipeline, improve patients' care experience, and
				transform treatment and surveillance for this all-too-common disease.
			</section>
		</div>
	</section>

	<section
		class="section h-[80vh] flex flex-col items-center justify-center transform-gpu mb-8 md:mb-12"
	>
		<h1>Possible Futures</h1>
		<div>
			<h2>Mapping the future of digital medicine</h2>
			<p>
				We envision VirDx as the keystone of a patient-centered future, where high-resolution <em
					>in vivo</em
				> spatial imaging anchors the integration of multiple data streams for:
			</p>
		</div>
		<div class="flex flex-col md:flex-row gap-y-4 md:gap-x-6">
			<div class="sub-section">
				<h2>Precision medicine</h2>
				<div>
					<p>First-class decision support based on a patient's unique internal landscape</p>
				</div>
			</div>
			<div class="sub-section">
				<h2>Regenerative medicine</h2>
				<div>
					<p>Novel monitoring capabilities for tissue growth and repair</p>
				</div>
			</div>
			<div class="sub-section">
				<h2>Computational biology</h2>
				<div>
					<p>
						<em>In silico</em> biophysical simulations to unravel complex disease mechanisms
					</p>
				</div>
			</div>
			<div class="sub-section">
				<h2>Digital twins</h2>
				<div>
					<p>
						Leveraging MRI scanners as real-world sensors for updating patient models and
						forecasting therapeutic outcomes
					</p>
				</div>
			</div>
		</div>
	</section>

	<section class="section">
		<h1>Who We Are</h1>
		<div>
			<Team items={team} />
			<p>
				We are physicians | engineers | physicists | biologists | computer scientists | health
				economists dreaming of a world where seeing the building blocks of the human body opens up
				new pathways to healing it.
			</p>
			<p>We’re looking for team members+collaborators+funders</p>
		</div>
	</section>
</div>
