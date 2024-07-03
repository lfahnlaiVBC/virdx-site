import { writable } from 'svelte/store';
import { progressStore } from './progressStore';
import { browser } from '$app/environment';

type TriggerInfo = {
	event: string;
	phrase: string;
};

function createTriggerStore() {
	const { subscribe, update } = writable<Map<string, TriggerInfo>>(new Map());

	return {
		subscribe,
		addTrigger: (event: string, phrase: string) => {
			update((triggers) => {
				triggers.set(event, { event, phrase });
				return triggers;
			});
			if (browser) {
				progressStore.forceUpdate();
			}
		},
		removeTrigger: (event: string) =>
			update((triggers) => {
				triggers.delete(event);
				return triggers;
			}),
		reset: () => update(() => new Map())
	};
}

export const triggerStore = createTriggerStore();
