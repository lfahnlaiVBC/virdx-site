export type InitialSection = {
	title: string;
	content: string[];
	triggers: Record<string, { phrase: string; detail: string }>;
	elements: Record<string, string>;
	sceneSetup: string;
	progressAnimations?: string;
};

const initialSection: InitialSection = {
	title: 'Water Dynamics',
	content: [
		'Water molecules exhibit unique behavior at the microscopic level.',
		'Their movement is influenced by various factors including temperature and pressure.',
		'Understanding these dynamics is crucial for many biological processes.'
	],
	triggers: {
		'microscopic level':
			'Zoom into the molecular structure of water, showing vibrating water molecules',
		'temperature and pressure':
			'Show temperature and pressure indicators affecting water molecule movement',
		'biological processes': 'Introduce a cell membrane and show water molecules interacting with it'
	},
	elements: {
		water_molecules: 'Small spheres representing water molecules, constantly vibrating',
		temperature_indicator: 'A horizontal bar gradient from blue (cold) to red (hot)',
		pressure_indicator: 'A circular gauge showing pressure levels',
		cell_membrane: 'A large, undulating surface representing a cell membrane'
	},
	sceneSetup:
		'Start with a wide view, then zoom in to show water molecules. Introduce temperature and pressure indicators, then show a cell membrane.',
	progressAnimations:
		'Gradually increase water molecule vibration and cell membrane undulation as the scene progresses.'
};

export default initialSection;
