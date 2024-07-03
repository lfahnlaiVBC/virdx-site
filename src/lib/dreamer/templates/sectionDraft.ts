import type { InitialSection } from './sectionTemplate';

export type Animation = {
	target: string;
	property: string;
	from: number;
	to: number;
	duration?: number;
	easing?: string;
};

export type Trigger = {
	event: string;
	detail: string;
	animations: Animation[];
};

export type Element = {
	description: string;
	shader?: string;
	initialState: Record<string, number>;
	ongoingAnimations?: Animation[];
};

export type SectionDraft = {
	title: string;
	content: string[];
	triggers: Record<string, Trigger>;
	elements: Record<string, Element>;
	sceneDescription: string;
	progressAnimations: Animation[];
	clarificationNeeded: string[];
	feedback: string;
	version: number;
	initialInput: InitialSection;
};

const sectionDraft: SectionDraft = {
	title: 'Water Dynamics',
	content: [
		'Water molecules exhibit unique behavior at the microscopic level.',
		'Their movement is influenced by various factors including temperature and pressure.',
		'Understanding these dynamics is crucial for many biological processes.'
	],
	triggers: {
		'microscopic level': {
			event: 'zoomInEvent',
			detail: 'Zoom into the molecular structure of water, showing vibrating water molecules',
			animations: [
				{
					target: 'camera',
					property: 'position.z',
					from: 10,
					to: 2,
					duration: 1000,
					easing: 'easeInOutQuad'
				},
				{ target: 'water_molecules', property: 'scale', from: 0, to: 1, duration: 500 },
				{ target: 'water_molecules', property: 'opacity', from: 0, to: 1, duration: 500 }
			]
		},
		'temperature and pressure': {
			event: 'tempPressureEvent',
			detail: 'Show temperature and pressure indicators affecting water molecule movement',
			animations: [
				{ target: 'temperature_indicator', property: 'opacity', from: 0, to: 1, duration: 500 },
				{ target: 'pressure_indicator', property: 'opacity', from: 0, to: 1, duration: 500 },
				{
					target: 'water_molecules',
					property: 'vibrationFrequency',
					from: 0.5,
					to: 2,
					duration: 1000
				}
			]
		},
		'biological processes': {
			event: 'bioProcessEvent',
			detail: 'Introduce a cell membrane and show water molecules interacting with it',
			animations: [
				{ target: 'cell_membrane', property: 'opacity', from: 0, to: 1, duration: 1000 },
				{ target: 'water_molecules', property: 'position.y', from: 0, to: -1, duration: 2000 }
			]
		}
	},
	elements: {
		water_molecules: {
			description: 'Small spheres representing water molecules, constantly vibrating',
			shader: 'Create a shader that simulates water molecule vibration',
			initialState: { scale: 0, opacity: 0 },
			ongoingAnimations: [
				{
					target: 'water_molecules',
					property: 'position',
					from: { x: 0, y: 0, z: 0 },
					to: { x: 0, y: 0.1, z: 0 },
					duration: 500,
					easing: 'sinusoidal'
				}
			]
		},
		temperature_indicator: {
			description: 'A horizontal bar gradient from blue (cold) to red (hot)',
			initialState: { opacity: 0, position: { x: 0, y: 2, z: 0 } }
		},
		pressure_indicator: {
			description: 'A circular gauge showing pressure levels',
			initialState: { opacity: 0, position: { x: 0, y: -2, z: 0 } }
		},
		cell_membrane: {
			description: 'A large, undulating surface representing a cell membrane',
			shader: 'Create a shader for a semi-transparent, undulating surface',
			initialState: { opacity: 0 },
			ongoingAnimations: [
				{
					target: 'cell_membrane',
					property: 'undulationPhase',
					from: 0,
					to: Math.PI * 2,
					duration: 5000,
					easing: 'linear'
				}
			]
		}
	},
	sceneDescription: `
    // Initial setup
    ^^^camera^^^ positioned for wide view

    // Zoom in to molecular level
    > ^^^camera^^^ zooms in rapidly (1s)
    > ^^^water_molecules^^^ fade in and start vibrating (0.5s)

    // Introduce temperature and pressure effects
    > ^^^temperature_indicator^^^ slides in from top (0.5s)
    + ^^^pressure_indicator^^^ slides in from bottom (0.5s)
    > ^^^water_molecules^^^ vibration and spacing respond to indicators (1s)

    // Show biological context
    > ^^^cell_membrane^^^ fades in (1s)
    > ^^^water_molecules^^^ interact with ^^^cell_membrane^^^ (2s)
  `,
	progressAnimations: [
		{ target: 'water_molecules', property: 'vibrationFrequency', from: 0.5, to: 2 },
		{ target: 'cell_membrane', property: 'undulationAmplitude', from: 0.1, to: 0.5 }
	],
	clarificationNeeded: [
		'What specific range should the temperature indicator show?',
		"How should water molecules' spacing change with pressure?",
		'What does water molecule interaction with the cell membrane look like?'
	],
	feedback: `
    // Add your feedback here. For example:
    // - Adjust timing of animations
    // - Modify element behaviors
    // - Add or remove elements
    // - Clarify specific interactions

    // Example:
    // "Slow down the initial zoom in to 2s"
    // "Add a ripple effect when water molecules interact with the cell membrane"
  `,
	version: 1,
	initialInput: {
		/* Include the initial input here */
	}
};

export default sectionDraft;
