<script>
	import { inview } from 'svelte-inview';
	import { onMount } from 'svelte';
	import { createScene } from '$lib/scene';
	import Team from '$lib/components/Team.svelte';
	const handleChange = ({ detail }) => {
		isInView = detail.inView;
		observer = detail.observer;
	};
	let el;
	let isInView;
	let observer;
	const options = {};
	onMount(() => {
		createScene(el);
	});
	const handleScroll = () => {
		console.log(observer);
		if (isInView && observer) {
			const entries = observer.takeRecords();
			console.log(entries);
			if (entries.length > 0) {
				const ratio = entries[0].intersectionRatio;

				// Map intersectionRatio to desired ranges
				const weight = 1 + ratio * 399; // Range: 1 to 400
				const elsh = 4 - ratio * 3; // Range: 4 to 1

				// Update CSS variables
				document.documentElement.style.setProperty('--font-wght-g', weight);
				document.documentElement.style.setProperty('--font-elsh-g', elsh);
			}
		}
		console.log(ratio);
	};

	onMount(() => {
		createScene(el);
		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});
	const team = [
		{ name: 'Jacob Murray', img: '/images/jacob.png' },
		{ name: 'Thayalini Anthony', img: '/images/thaya.png' },
		{ name: 'Sebastian Voigtländer', img: '/images/sebastian.png' },
		{ name: 'Léon Wiederkehr', img: '/images/leon.png' }
	];
</script>

<canvas
	bind:this={el}
	class="fixed top-0 left-0 w-screen h-screen bg-gradient-to-b from-purple-500 to-pink-500"
/>
<div class="flex flex-col items-center gap-y-8 md:gap-y-12">
	<div class="w-full md:w-3/4">
		<div class="section" use:inview on:inview_change={handleChange}>
			<h1 class="gridlite">
				An <em>in vivo</em> spatial microscope for the future of medicine.
			</h1>
			<div>
				<p>What if there was a way to examine <em>living tissues</em> inside our bodies?</p>
				<p>
					Microscopes have opened the door to countless biomedical advances, but they've never been
					able to see inside a living person.
				</p>
				<p>We're building one that <strong>can.</strong></p>
			</div>
		</div>

		<div class="section">
			<h1>Seeing with water</h1>
			<div>
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
			class="section h-[80vh] flex flex-col items-center justify-center transform-gpu mb-8 md:mb-12"
		>
			<h1>How it works</h1>
			<div>
				<p>
					Our <em>in vivo</em> spatial microscopy platform generates pioneering magnetic resonance histology
					brings together a cutting-edge biophysical simulation platform, customized MRI protocols, and
					a rigorous, clinically-validated ground truth framework.
				</p>
			</div>
			<div class="flex flex-col md:flex-row gap-y-4 md:gap-x-6">
				<div class="sub-section">
					<h2>Biophysical simulation platform</h2>
					<div>
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
				<div class="sub-section">
					<h2>Customized MRI protocols</h2>
					<div>
						<p>
							Our models are honed on data from our proprietary algorithm-ready, information-dense
							MRI protocols, optimized to yield additional data for machine learning in addition to
							contrast visualization.
						</p>
					</div>
				</div>
				<div class="sub-section">
					<h2>Integrated Ground Truth Framework</h2>
					<div>
						<p>
							Fusing 3D bioengineering and next-generation computational registration, our patented
							ground truth pipeline achieves superior model accuracy and reliability by ensuring
							spatial alignment between histopathology and MRI datasets.
						</p>
					</div>
				</div>
			</div>
		</div>

		<div class="section">
			<h1>Focal Application</h1>
			<div>
				<h2>Non-Invasive Prostate Cancer Diagnostics</h2>
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
						<p><em>In silico</em> biophysical simulations to unravel complex disease mechanisms</p>
					</div>
				</div>
				<div class="sub-section">
					<h2>Digital twins</h2>
					<div>
						<p>
							Leveraging MRI scanners as real-world sensors for updating virtual patient models and
							forecasting therapeutic outcomes
						</p>
					</div>
				</div>
			</div>
		</div>

		<div class="section">
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
		</div>
	</div>
</div>
