import { writable } from 'svelte/store';

export const toasts = writable<Toast[]>([]);

interface Toast {
	id: number;
	type: 'info' | 'success' | 'warning' | 'error';
	message: string;
	dismissible: boolean;
	timeout: number;
}

export const addToast = (toast: Partial<Toast>): void => {
	const id = Math.floor(Math.random() * 10000);

	const defaults: Toast = {
		id,
		type: 'info',
		message: '',
		dismissible: true,
		timeout: 3000
	};

	toasts.update((all) => [{ ...defaults, ...toast }, ...all]);

	if (toast.timeout) setTimeout(() => dismissToast(id), toast.timeout);
};

export const dismissToast = (id: number): void => {
	toasts.update((all) => all.filter((t) => t.id !== id));
};
