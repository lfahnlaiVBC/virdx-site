<script>
	import { reveal } from 'svelte-reveal';
	import { CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';
	import { onMount } from 'svelte';
	import { createScene } from '$lib/scene';

	let el;

	onMount(() => {
		createScene(el);
	});
</script>

<canvas
	bind:this={el}
	class="touch-none fixed top-0 left-0 w-screen h-screen bg-gradient-to-b from-purple-500 to-pink-500"
/>
<div class="flex flex-col items-center gap-y-8 md:gap-y-12">
	<div class="w-full md:w-3/4">
		<div use:reveal={{ transition: 'slide' }} class="section">
			<h2 class="text-3xl md:text-5xl">
				An <em>in vivo</em> spatial microscope for the future of medicine.
			</h2>
			<div class="content">
				<p>What if there was a way to examine <em>living tissues</em> inside our bodies?</p>
				<p>
					Microscopes have opened the door to countless biomedical advances, but they've never been
					able to see inside a living person.
				</p>
				<p>We're building one that <strong>can.</strong></p>
			</div>
		</div>

		<div use:reveal={{ transition: 'slide' }} class="section">
			<h2 class="text-3xl md:text-5xl">Seeing with water</h2>
			<div class="content">
				<p>The human body contains more than one billion billion billion molecules of water.</p>
				<p>
					The architecture of body tissues determines how freely water molecules are able to move
					through them.
				</p>
				<p>
					This gives each tissue a distinct <strong>diffusion signature</strong> recognizable on MRI
					scans—but not by the human eye.
				</p>
				<p>
					We're building an ML-powered, biophysically-grounded <em>in vivo</em> imaging platform that
					combines the promise of microscopy with the safety of MRI, and taps into the world's existing
					MRI infrastructure to help drive the healthcare advances of the 21st century.
				</p>
			</div>
		</div>

		<div
			use:reveal={{ transition: 'slide' }}
			class="section h-[80vh] flex flex-col items-center justify-center transform-gpu mb-8 md:mb-12"
		>
			<h2 class="text-3xl md:text-5xl">How it works</h2>
			<div class="content">
				<p>
					Our <em>in vivo</em> spatial microscopy platform generates pioneering magnetic resonance histology
					brings together a cutting-edge biophysical simulation platform, customized MRI protocols, and
					a rigorous, clinically-validated ground truth framework.
				</p>
			</div>
			<div class="flex flex-col md:flex-row gap-y-4 md:gap-x-6">
				<div use:reveal={{ transition: 'slide', delay: 200, reset: true }} class="sub-section">
					<h3 class="text-2xl md:text-3xl">Biophysical simulation platform</h3>
					<div class="content">
						<h3>Diffusion signature prediction</h3>
						<p>
							Groundbreaking biophysical models simulate the distinct magnetic resonance profiles of
							different tissues.
						</p>
						<h3>Magnetic resonance tissue typing</h3>
						<p>
							Diffusion-aware classifier models resolve MRI signatures into detailed tissue maps
							that reveal salient histological features at the mesoscopic scale.
						</p>
					</div>
				</div>
				<div use:reveal={{ transition: 'slide', delay: 400, reset: true }} class="sub-section">
					<h3 class="text-2xl md:text-3xl">Customized MRI protocols</h3>
					<div class="content">
						<p>
							Our models are honed on data from our proprietary algorithm-ready, information-dense
							MRI protocols, optimized to yield additional data for machine learning in addition to
							contrast visualization.
						</p>
					</div>
				</div>
				<div use:reveal={{ transition: 'slide', delay: 600, reset: true }} class="sub-section">
					<h3 class="text-2xl md:text-3xl">Integrated Ground Truth Framework</h3>
					<div class="content">
						<p>
							Fusing 3D bioengineering and next-generation computational registration, our patented
							ground truth pipeline achieves superior model accuracy and reliability by ensuring
							spatial alignment between histopathology and MRI datasets.
						</p>
					</div>
				</div>
			</div>
		</div>

		<div use:reveal={{ transition: 'slide' }} class="section">
			<h2 class="text-3xl md:text-5xl">Focal Application</h2>
			<div class="content">
				<h3>Non-Invasive Prostate Cancer Diagnostics</h3>
				<p>
					1 in 8 prostate glands will develop cancer at some point, yet prostate biopsies are both
					risky and notoriously inaccurate.
				</p>
				<p>
					Missed tumors, unnecessary treatment, and biopsy complications exact a staggering human
					and economic toll every year.
				</p>
				<p>
					We're working to change that by placing a non-invasive prostate cancer diagnostic tool at
					the heart of our platform development.
				</p>
				<p>
					We're partnering with radiologists and urologists in the U.S. and Germany to collect
					histopathology and MRI data perfectly co-registered using our proprietary ground truth
					framework to fine-tune our models, fix the leaky diagnostic pipeline, and transform
					diagnosis and surveillance for this all-too-common disease.
				</p>
			</div>
		</div>

		<div
			use:reveal={{ transition: 'slide' }}
			class="section h-[80vh] flex flex-col items-center justify-center transform-gpu mb-8 md:mb-12"
		>
			<h2 class="text-3xl md:text-5xl">Possible Futures</h2>
			<div class="content">
				<h3>Mapping the future of digital medicine</h3>
				<p>
					We envision VirDx as the keystone of a patient-centered future, where high-resolution <em
						>in vivo</em
					> spatial imaging anchors the integration of multiple data streams for:
				</p>
			</div>
			<div class="flex flex-col md:flex-row gap-y-4 md:gap-x-6">
				<div use:reveal={{ transition: 'slide', delay: 200, reset: true }} class="sub-section">
					<h3 class="text-2xl md:text-3xl">Precision medicine</h3>
					<div class="content">
						<p>First-class decision support based on a patient's unique internal landscape</p>
					</div>
				</div>
				<div use:reveal={{ transition: 'slide', delay: 400, reset: true }} class="sub-section">
					<h3 class="text-2xl md:text-3xl">Regenerative medicine</h3>
					<div class="content">
						<p>Novel monitoring capabilities for tissue growth and repair</p>
					</div>
				</div>
				<div use:reveal={{ transition: 'slide', delay: 600, reset: true }} class="sub-section">
					<h3 class="text-2xl md:text-3xl">Computational biology</h3>
					<div class="content">
						<p><em>In silico</em> biophysical simulations to unravel complex disease mechanisms</p>
					</div>
				</div>
				<div use:reveal={{ transition: 'slide', delay: 800, reset: true }} class="sub-section">
					<h3 class="text-2xl md:text-3xl">Digital twins</h3>
					<div class="content">
						<p>
							Leveraging MRI scanners as real-world sensors for updating virtual patient models and
							forecasting therapeutic outcomes
						</p>
					</div>
				</div>
			</div>
		</div>

		<div use:reveal={{ transition: 'slide' }} class="section">
			<h2 class="text-3xl md:text-5xl">Who We Are</h2>
			<div class="content">
				<p>
					We are physicians | engineers | physicists | biologists | computer scientists | health
					economists dreaming of a world where seeing the building blocks of the human body opens up
					new pathways to healing it.
				</p>
				<aside>We’re looking for team members+collaborators+funders</aside>
			</div>
		</div>
	</div>
</div>

<style>
	.section {
		@apply h-[80vh] flex items-center justify-center transform-gpu mb-8 md:mb-12;
	}
	.sub-section {
		@apply transform-gpu mb-8 md:mb-12;
	}
</style>
