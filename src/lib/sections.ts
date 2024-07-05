import IntroScene from '$lib/components/scenes/IntroScene.svelte';
import WaterScene from '$lib/components/scenes/WaterScene.svelte';
import HowScene from '$lib/components/scenes/HowScene.svelte';
const sections = [
	// {
	// 	title: 'An *in vivo* spatial microscope for the future of medicine.',
	// 	content: [
	// 		'What if there was a way to examine *living tissues* inside our bodies?',
	// 		'MRI scans can non-invasively reveal hidden structures but lack the resolution to positively discern specific tissues.',
	// 		"Microscopes have opened the door to countless biomedical advances, but they've never been able to see inside a living person.",
	// 		"We're building one that **can**."
	// 	],
	// 	scene: IntroScene,
	// 	triggers: {
	// 		'living tissues': {
	// 			event: 'revealEvent',
	// 			detail: 'Living tissues are the building blocks of life.'
	// 		},
	// 		'biomedical advances': {
	// 			event: 'biomedicalEvent',
	// 			detail: 'Biomedical advances have revolutionized healthcare.'
	// 		}
	// 	}
	// },
	{
		title: 'An *in vivo* spatial microscope for the future of medicine.',
		content: [
			'What if there was a way to examine *living tissues* inside our bodies?',
			'MRI scans can non-invasively reveal hidden structures but lack the resolution to positively discern specific tissues.',
			"Microscopes have opened the door to countless biomedical advances, but they've never been able to see inside a living person.",
			"We're building one that **can**."
		],
		triggers: {
			'MRI scans': {
				event: 'mriScansEvent',
				detail:
					'RGB blurs desaturate to different extents over 250ms, transforming into intersecting see-through meshes with grayscale edges and glowing white vertices.'
			},
			'microscopes have': {
				event: 'microscopesHaveEvent',
				detail:
					'RGB blur opacity fades to zero while histology sample becomes visible, with opacity ramping from 0 to 1 over 100ms.'
			},
			'one that **can**': {
				event: 'canEvent',
				detail:
					'A double-sided plane group using logo_white.svg as a reverse alpha mask appears over the entire scene and zooms very quickly towards the camera over 100ms.'
			}
		},
		elements: {
			rgbBlurs: {
				description:
					'Three high-poly deformed spheres with boxblur pass, animated with vertex and fragment shaders to look slightly alive. Initially at the center of the screen.'
			},
			histologySample: {
				description:
					'Circularly-cropped histology bitmap with diffuse overlay, box blur, and color manipulation in postprocessing. Animated using time-varying varyings in shaders. Initially invisible.'
			},
			logoMask: {
				description:
					'Double-sided plane group using logo_white.svg as a reverse alpha mask. Initially invisible.'
			}
		},
		sceneSetup:
			'White background ||| Three RGB blurs centered ||| Invisible histology sample prepared ||| Invisible logo mask prepared',
		progressAnimations:
			'RGB blurs lose opacity (0 to 0.6 progress) ||| Whole scene zooms in slightly (0 to 0.6 progress) ||| Histology sample fills the screen (0 to 0.6 progress)',
		scene: IntroScene
	},

	{
		title: 'Seeing with water',
		content: [
			'The human body contains more than one billion billion billion molecules of water.',
			'The architecture of body tissues determines how freely water molecules are able to move through them.',
			'This gives each tissue a distinct **diffusion signature** recognizable on MRI scans—but not by the human eye.',
			"We're building an ML-powered, biophysically-grounded *in vivo* imaging platform that combines the promise of microscopy with the safety of MRI, and taps into the world's existing MRI infrastructure to help drive the healthcare advances of the 21st century."
		],
		triggers: {
			'billion billion': {
				event: 'billionEvent',
				detail:
					'Grouped smaller duplicates of the main water droplet that were previously hidden behind it quickly disperse in nearly random directions across the screen, with slightly varying displacements (500ms). After a short delay (250ms) the subgroups then disperse again to fill space in the screen (500ms). ',
				animations: []
			},
			'diffusion signature': {
				event: 'diffusionEvent',
				detail:
					'divider becomes visible, opacity fades in (100ms) and moves vertically up from offscreen to bisect the screen left and right starting from the bottom. right after this happens all droplets are sorted into two groups and move randomly to either the left or the right half of the screen, and their sizes and distances from the camera (along camera axis) become homogenized to intermediate value so they all appear approximately 10% the size of the main initial droplet, with natural-seeming variation.',
				animations: []
			}
		},
		elements: {
			element1: {
				description:
					'a water droplet represented as a sphere with shaders that create a ongoing gently rippling effect on the surface using displacement refraction and reflection. should appear glassy against background. gently bobs up and down and a little bit left and right, as if suspended in space.',
				initialState: {},
				ongoingAnimations: []
			},
			element2: {
				description:
					'a white planar or very flat box vertical divider that splits the visible canvas screen into two halves left and right. ',
				initialState: {},
				ongoingAnimations: []
			}
		},
		scene: WaterScene,
		sceneDescription: 'Generated scene description would go here.',
		progressAnimations: [],
		clarificationNeeded: [
			'This is a placeholder. Real implementation would identify areas needing clarification.'
		],
		feedback: '',
		version: 1,
		initialInput: {
			title: 'Seeing with water',
			content: [
				'The human body contains more than one billion billion billion molecules of water.',
				'The architecture of body tissues determines how freely water molecules are able to move through them.',
				'This gives each tissue a distinct **diffusion signature** recognizable on MRI scans—but not by the human eye.',
				"We're building an ML-powered, biophysically-grounded *in vivo* imaging platform that combines the promise of microscopy with the safety of MRI, and taps into the world's existing MRI infrastructure to help drive the healthcare advances of the 21st century."
			],
			triggers: {
				trigger1: {
					phrase: 'billion billion',
					detail:
						'Grouped smaller duplicates of the main water droplet that were previously hidden behind it quickly disperse in nearly random directions across the screen, with slightly varying displacements (500ms). After a short delay (250ms) the subgroups then disperse again to fill space in the screen (500ms). '
				},
				trigger2: {
					phrase: 'diffusion signature',
					detail:
						'divider becomes visible, opacity fades in (100ms) and moves vertically up from offscreen to bisect the screen left and right starting from the bottom. right after this happens all droplets are sorted into two groups and move randomly to either the left or the right half of the screen, and their sizes and distances from the camera (along camera axis) become homogenized to intermediate value so they all appear approximately 10% the size of the main initial droplet, with natural-seeming variation.'
				}
			},
			elements: {
				element1:
					'a water droplet represented as a sphere with shaders that create a ongoing gently rippling effect on the surface using displacement refraction and reflection. should appear glassy against background. gently bobs up and down and a little bit left and right, as if suspended in space.',
				element2:
					'a white planar or very flat box vertical divider that splits the visible canvas screen into two halves left and right. '
			},
			sceneSetup:
				'Background is initially white. Main water droplet is centered in screen taking up half height. Main droplet is a group containing the large sphere hiding 10 smaller duplicates of slightly varying sizes and distances from camera behind it. Each smaller droplet is a subgroup of 11, again with 1 larger and 10 even smaller hiding behind it. intelligently adjust the size and shading detail for subgroups for performance optimization. Divider is initially invisible. All droplets should be individually keyed in some programmatically retrievable way for later manipulation that allows two groups to be made irrespective of initial 1 in 11 hierarchy.',
			progressAnimations:
				'Whole scene zooms slightly by 30% from 0 to 1 progress. Background changes from white to black with steep ramp, starting at 0.25 progress. '
		}
	},
	{
		title: 'How it works',
		content: [
			'Our *in vivo* spatial microscopy platform combines a cutting-edge biophysical simulation platform, customized MRI protocols, and a rigorous, clinically-validated ground truth framework to generate pioneering synthetic histology.',
			'**Next-Generation MRI sensing**: Proprietary MRI protocols are optimized for machine learning and engineered for broad compatibility, allowing the vast network of existing MRI scanners to be upgraded into real-world histological sensors.',
			'**Biophysical simulation platform**: Groundbreaking biophysical models simulate the distinct MRI profiles of different tissues. Diffusion-aware classifier models resolve MRI signatures into detailed tissue maps that reveal salient histological features at the mesoscopic scale.',
			'**Integrated Ground Truth Framework**: Fusing 3D bioengineering and next-generation computational registration, our patented ground truth pipeline achieves superior model accuracy and reliability by ensuring perfect spatial alignment between histopathology and MRI datasets.'
		],
		scene: HowScene
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
