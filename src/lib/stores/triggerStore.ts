import { writable } from 'svelte/store';

type TriggerInfo = {
	event: string;
	phrase: string;
};

function createTriggerStore() {
	const { subscribe, update } = writable<Map<string, TriggerInfo>>(new Map());

	return {
		subscribe,
		addTrigger: (event: string, phrase: string) =>
			update((triggers) => {
				triggers.set(event, { event, phrase });
				return triggers;
			}),
		removeTrigger: (event: string) =>
			update((triggers) => {
				triggers.delete(event);
				return triggers;
			}),
		reset: () => update(() => new Map())
	};
}

export const triggerStore = createTriggerStore();
