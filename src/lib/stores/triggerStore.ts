import { writable } from 'svelte/store';

const createTriggerStore = () => {
	const { subscribe, set, update } = writable<string | null>(null);

	return {
		subscribe,
		addTrigger: (event: string) => set(event),
		removeTrigger: () => set(null),
		reset: () => set(null)
	};
};

export const triggerStore = createTriggerStore();
