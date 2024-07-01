<script lang="ts">
	import { onMount } from 'svelte';
	import { writable, derived } from 'svelte/store';
	import TextSection from '$lib/components/TextSection.svelte';
	import ThreeScene from '$lib/components/ThreeScene.svelte';
	import { marked } from 'marked';
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
	let teamData;

	const scroll = writable({ top: 0, height: 0 });
	let frameRequest: number;

	const throttledScroll = derived(scroll, ($scroll, set) => {
		if (frameRequest) {
			cancelAnimationFrame(frameRequest);
		}
		frameRequest = requestAnimationFrame(() => {
			set($scroll);
		});
	});

	const sections = [
		{
			title: 'An *in vivo* spatial microscope for the future of medicine.',
			content: [
				'What if there was a way to examine *living tissues* inside our bodies?',
				'MRI scans can non-invasively reveal hidden structures but lack the resolution to positively discern specific tissues.',
				"Microscopes have opened the door to countless biomedical advances, but they've never been able to see inside a living person.",
				"We're building one that **can**."
			],
			animationId: 'introScene'
		},
		{
			title: 'Seeing with water',
			content: [
				'The human body contains more than one billion billion billion molecules of water.',
				'The architecture of body tissues determines how freely water molecules are able to move through them.',
				'This gives each tissue a distinct **diffusion signature** recognizable on MRI scans—but not by the human eye.',
				"We're building an ML-powered, biophysically-grounded *in vivo* imaging platform that combines the promise of microscopy with the safety of MRI, and taps into the world's existing MRI infrastructure to help drive the healthcare advances of the 21st century."
			],
			animationId: 'waterScene'
		},
		{
			title: 'How it works',
			content: [
				'Our *in vivo* spatial microscopy platform combines a cutting-edge biophysical simulation platform, customized MRI protocols, and a rigorous, clinically-validated ground truth framework to generate pioneering synthetic histology.',
				'**Next-Generation MRI sensing**: Proprietary MRI protocols are optimized for machine learning and engineered for broad compatibility, allowing the vast network of existing MRI scanners to be upgraded into real-world histological sensors.',
				'**Biophysical simulation platform**: Groundbreaking biophysical models simulate the distinct MRI profiles of different tissues. Diffusion-aware classifier models resolve MRI signatures into detailed tissue maps that reveal salient histological features at the mesoscopic scale.',
				'**Integrated Ground Truth Framework**: Fusing 3D bioengineering and next-generation computational registration, our patented ground truth pipeline achieves superior model accuracy and reliability by ensuring perfect spatial alignment between histopathology and MRI datasets.'
			],
			animationId: 'workflowScene'
		},
		{
			title: 'Core Application: Non-Invasive Prostate Cancer Diagnostics',
			content: [
				'1 in 8 prostate glands will develop cancer at some point, but diagnostic biopsies are both risky and imprecise.',
				'Missed tumors, unnecessary treatment, and biopsy complications exact a staggering human and economic toll every year.',
				'VirDx is working to change that by developing our platform around a non-invasive prostate cancer diagnostic tool.',
				"With our partners in radiology and urology across the U.S. and Germany, we're using our proprietary ground truth framework to hone our models on the highest possible standard of histopathological and MRI data.",
				"By creating a non-invasive option for detecting and monitoring tumors, we're helping clinicians fix the leaky diagnostic pipeline, improve patients' care experience, and transform treatment and surveillance for this all-too-common disease."
			],
			animationId: 'prostateScene'
		},
		{
			title: 'Possible Futures: Mapping the future of digital medicine',
			content: [
				'We envision VirDx as the keystone of a patient-centered future, where high-resolution *in vivo* spatial imaging anchors the integration of multiple data streams for:',
				"**Precision medicine**: First-class decision support based on a patient's unique internal landscape",
				'**Regenerative medicine**: Novel monitoring capabilities for tissue growth and repair',
				'**Computational biology**: *In silico* biophysical simulations to unravel complex disease mechanisms',
				'**Digital twins**: Leveraging MRI scanners as real-world sensors for updating patient models and forecasting therapeutic outcomes'
			],
			animationId: 'futureScene'
		},
		{
			title: 'Who We Are',
			content: [
				'We are physicians | engineers | physicists | biologists | computer scientists | health economists dreaming of a world where seeing the building blocks of the human body opens up new pathways to healing it.',
				"We're looking for team members + collaborators + funders"
			],
			animationId: 'teamScene'
		}
	];

	function tokenizeParagraph(paragraph) {
		const tokens = [];
		let currentStyle = '';

		const html = marked.parse(paragraph);
		const tempDiv = document.createElement('div');
		tempDiv.innerHTML = html;

		function processNode(node) {
			if (node.nodeType === Node.TEXT_NODE) {
				const words = node.textContent.split(/(\s+)/);
				words.forEach((word) => {
					if (word) {
						tokens.push({ text: word, style: currentStyle.trim() });
					}
				});
			} else if (node.nodeType === Node.ELEMENT_NODE) {
				const oldStyle = currentStyle;
				if (node.tagName === 'EM') {
					currentStyle += ' italic';
				} else if (node.tagName === 'STRONG') {
					currentStyle += ' font-bold';
				}
				Array.from(node.childNodes).forEach(processNode);
				currentStyle = oldStyle;
			}
		}

		Array.from(tempDiv.childNodes).forEach(processNode);
		return tokens;
	}
	const processedSections = sections.map((section) => ({
		...section,
		title: marked.parse(section.title),
		content: section.content.map(tokenizeParagraph)
	}));
	const progressStore = derived(throttledScroll, ($scroll) => {
		const scrollTop = $scroll?.top ?? 0;
		const scrollHeight = ($scroll?.height ?? 0) - window.innerHeight;

		const overallProgress =
			Math.round(Math.min(Math.max(scrollTop / scrollHeight, 0), 1) * 1000) / 1000;

		const sectionHeight = scrollHeight / processedSections.length;
		const currentSectionIndex = Math.min(
			Math.max(Math.floor(scrollTop / sectionHeight), 0),
			processedSections.length - 1
		);
		const currentProgress =
			Math.round(Math.min(Math.max((scrollTop % sectionHeight) / sectionHeight, 0), 1) * 1000) /
			1000;

		return { overallProgress, currentSectionIndex, currentProgress };
	});
	let currentSectionIndex = 0;
	let currentProgress = 0;
	let overallProgress = 0;

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
	$: {
		({ currentSectionIndex, currentProgress, overallProgress } = $progressStore);
	}

	function handleScroll() {
		scroll.set({
			top: window.pageYOffset || document.documentElement.scrollTop,
			height: document.documentElement.scrollHeight
		});
	}

	onMount(() => {
		window.addEventListener('scroll', handleScroll);
		handleScroll(); // Initial call to set correct values
		return () => {
			window.removeEventListener('scroll', handleScroll);
			if (frameRequest) {
				cancelAnimationFrame(frameRequest);
			}
		};
	});

	$: currentAnimationId = processedSections[currentSectionIndex]?.animationId || 'defaultAnimation';

	onMount(async () => {
		const response = await fetch('/api/teamData');
		teamData = await response.json();
	});
	$: console.log(`current: ${currentProgress} `);
</script>

<div class="flex min-h-screen">
	<ThreeScene
		class="w-1/2 fixed h-screen"
		animationId={currentAnimationId}
		progress={currentProgress}
		{overallProgress}
	/>
	<div class="w-1/2 ml-[50%]">
		{#each processedSections as section, index}
			<TextSection
				title={section.title}
				content={section.content}
				active={index === currentSectionIndex}
				progress={index === currentSectionIndex ? currentProgress : 0}
			/>
		{/each}
	</div>
</div>
<!-- <div class="w-full h-screen flex flex-row">
	

		<section class="section">
			<h1>Who We Are</h1>
			<div>
				<Team items={team} />
				<p>
					We are physicians | engineers | physicists | biologists | computer scientists | health
					economists dreaming of a world where seeing the building blocks of the human body opens up
					new pathways to healing it.
				</p>
				<p>We're looking for team members+collaborators+funders</p>
			</div>
		</section>
	</div>
	<div class="w-1/2 flex-shrink-0"></div>
</div> -->
