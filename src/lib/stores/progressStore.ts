import { writable } from 'svelte/store';

export const progressStore = writable({
	overallProgress: 0,
	currentSectionIndex: 0,
	currentProgress: 0,
	totalSections: 1
});

let lastUpdateTime = 0;
const fps = 120;
const fpsInterval = 1000 / fps;

export function updateProgress(
	scrollTop: number,
	scrollHeight: number,
	totalSections: number,
	windowHeight: number
) {
	const currentTime = performance.now();
	if (currentTime - lastUpdateTime >= fpsInterval) {
		const overallProgress = Math.min(Math.max(scrollTop / (scrollHeight - windowHeight), 0), 1);
		const sectionDuration = 1 / totalSections;
		const currentSectionIndex = Math.min(
			Math.floor(overallProgress / sectionDuration),
			totalSections - 1
		);
		const currentProgress =
			(overallProgress - currentSectionIndex * sectionDuration) / sectionDuration;

		progressStore.set({
			overallProgress,
			currentSectionIndex,
			currentProgress,
			totalSections
		});

		lastUpdateTime = currentTime;
	}
}
