import type { StorybookConfig } from '@storybook/sveltekit';

const config: StorybookConfig = {
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
	addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@chromatic-com/storybook',
        '@storybook/addon-interactions',
        '@storybook/addon-svelte-csf',
        '@storybook/addon-controls',
        '@storybook/addon-designs',
        '@storybook/addon-viewport',
        '@storybook/addon-docs',
        '@storybook/addon-actions',
        '@storybook/addon-toolbars',
        '@storybook/addon-measure',
        '@storybook/addon-outline',
        '@storybook/addon-highlight',
        '@storybook/addon-themes'
    ],
	framework: {
		name: '@storybook/sveltekit',
		options: {}
	},
	staticDirs: ['../static']
};
export default config;
