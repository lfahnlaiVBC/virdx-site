import IntroScene from '$lib/components/scenes/IntroScene.svelte';
import WaterScene from '$lib/components/scenes/WaterScene.svelte';
const sections = [
	{
		title: 'An *in vivo* spatial microscope for the future of medicine.',
		content: [
			'What if there was a way to examine *living tissues* inside our bodies?',
			'MRI scans can non-invasively reveal hidden structures but lack the resolution to positively discern specific tissues.',
			"Microscopes have opened the door to countless biomedical advances, but they've never been able to see inside a living person.",
			"We're building one that **can**."
		],
		scene: IntroScene,
		triggers: {
			'living tissues': 'revealEvent',
			'biomedical advances': 'biomedicalEvent'
		}
	},
	{
		title: 'Seeing with water',
		content: [
			'The human body contains more than one billion billion billion molecules of water.',
			'The architecture of body tissues determines how freely water molecules are able to move through them.',
			'This gives each tissue a distinct **diffusion signature** recognizable on MRI scans—but not by the human eye.',
			"We're building an ML-powered, biophysically-grounded *in vivo* imaging platform that combines the promise of microscopy with the safety of MRI, and taps into the world's existing MRI infrastructure to help drive the healthcare advances of the 21st century."
		],
		scene: WaterScene,
		triggers: {
			'billion billion': 'waterEvent',
			'diffusion signature': 'diffusionEvent'
		}
	},
	{
		title: 'How it works',
		content: [
			'Our *in vivo* spatial microscopy platform combines a cutting-edge biophysical simulation platform, customized MRI protocols, and a rigorous, clinically-validated ground truth framework to generate pioneering synthetic histology.',
			'**Next-Generation MRI sensing**: Proprietary MRI protocols are optimized for machine learning and engineered for broad compatibility, allowing the vast network of existing MRI scanners to be upgraded into real-world histological sensors.',
			'**Biophysical simulation platform**: Groundbreaking biophysical models simulate the distinct MRI profiles of different tissues. Diffusion-aware classifier models resolve MRI signatures into detailed tissue maps that reveal salient histological features at the mesoscopic scale.',
			'**Integrated Ground Truth Framework**: Fusing 3D bioengineering and next-generation computational registration, our patented ground truth pipeline achieves superior model accuracy and reliability by ensuring perfect spatial alignment between histopathology and MRI datasets.'
		]
	},
	{
		title: 'Core Application: Non-Invasive Prostate Cancer Diagnostics',
		content: [
			'1 in 8 prostate glands will develop cancer at some point, but diagnostic biopsies are both risky and imprecise.',
			'Missed tumors, unnecessary treatment, and biopsy complications exact a staggering human and economic toll every year.',
			'VirDx is working to change that by developing our platform around a non-invasive prostate cancer diagnostic tool.',
			"With our partners in radiology and urology across the U.S. and Germany, we're using our proprietary ground truth framework to hone our models on the highest possible standard of histopathological and MRI data.",
			"By creating a non-invasive option for detecting and monitoring tumors, we're helping clinicians fix the leaky diagnostic pipeline, improve patients' care experience, and transform treatment and surveillance for this all-too-common disease."
		]
	},
	{
		title: 'Possible Futures: Mapping the future of digital medicine',
		content: [
			'We envision VirDx as the keystone of a patient-centered future, where high-resolution *in vivo* spatial imaging anchors the integration of multiple data streams for:',
			"**Precision medicine**: First-class decision support based on a patient's unique internal landscape",
			'**Regenerative medicine**: Novel monitoring capabilities for tissue growth and repair',
			'**Computational biology**: *In silico* biophysical simulations to unravel complex disease mechanisms',
			'**Digital twins**: Leveraging MRI scanners as real-world sensors for updating patient models and forecasting therapeutic outcomes'
		]
	},
	{
		title: 'Who We Are',
		content: [
			'We are physicians | engineers | physicists | biologists | computer scientists | health economists dreaming of a world where seeing the building blocks of the human body opens up new pathways to healing it.',
			"We're looking for team members + collaborators + funders"
		]
	}
];

export default sections;
