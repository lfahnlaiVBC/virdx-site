// src/lib/stores/progressStore.ts
import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { throttle } from 'lodash-es';
import sections from '$lib/sections';

type ProgressData = {
	overallProgress: number;
	currentSectionIndex: number;
	currentProgress: number;
	totalSections: number;
	scroll: { x: number; y: number };
};

function calculateProgress(
	scrollTop: number,
	scrollHeight: number,
	windowHeight: number
): ProgressData {
	const totalSections = sections.length;
	const denominator = Math.max(scrollHeight - windowHeight, 1);
	const overallProgress = Math.min(Math.max(scrollTop / denominator, 0), 1);

	const sectionDuration = 1 / totalSections;
	const currentSectionIndex = Math.min(
		Math.floor(overallProgress / sectionDuration),
		totalSections - 1
	);
	const currentProgress =
		sectionDuration !== 0
			? (overallProgress - currentSectionIndex * sectionDuration) / sectionDuration
			: 0;

	return {
		overallProgress: isNaN(overallProgress) ? 0 : overallProgress,
		currentSectionIndex: isNaN(currentSectionIndex) ? 0 : currentSectionIndex,
		currentProgress: isNaN(currentProgress) ? 0 : currentProgress,
		totalSections,
		scroll: { x: window.scrollX, y: scrollTop }
	};
}

function createProgressStore() {
	const { subscribe, set } = writable<ProgressData>({
		overallProgress: 0,
		currentSectionIndex: 0,
		currentProgress: 0,
		totalSections: sections.length,
		scroll: { x: 0, y: 0 }
	});
	if (browser) {
		const update = throttle(() => {
			set(
				calculateProgress(window.scrollY, document.documentElement.scrollHeight, window.innerHeight)
			);
		}, 1000 / 120);

		window.addEventListener('scroll', update);
		window.addEventListener('resize', update);
		window.addEventListener('load', update);

		update();

		return {
			subscribe,
			forceUpdate: () => {
				if (browser) {
					set(
						calculateProgress(
							window.scrollY,
							document.documentElement.scrollHeight,
							window.innerHeight
						)
					);
				}
			},
			destroy: () => {
				window.removeEventListener('scroll', update);
				window.removeEventListener('resize', update);
			}
		};
	}

	return {
		subscribe,
		forceUpdate: () => {}
	};
}

export const progressStore = createProgressStore();

export function calculateVisibility(
	sceneIndex: number,
	sceneDuration: number,
	overallProgress: number,
	totalSections: number
): number {
	const sceneStart = sceneIndex / totalSections;
	const sceneEnd = (sceneIndex + sceneDuration) / totalSections;

	if (overallProgress < sceneStart || overallProgress > sceneEnd) {
		return 0;
	} else {
		const localProgress = (overallProgress - sceneStart) / (sceneEnd - sceneStart);
		return 1 - Math.abs(2 * localProgress - 1);
	}
}
