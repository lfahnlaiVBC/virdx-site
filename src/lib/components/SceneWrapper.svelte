<script lang="ts">
	import { onMount } from 'svelte';
	import { addToast } from '$lib/stores/toastStore';
	import { triggerStore } from '$lib/stores/triggerStore';
	import sections from '$lib/sections';

	let previousTriggers = new Map<string, { event: string; phrase: string }>();

	function findDetailForTrigger(event: string, phrase: string): string {
		for (const section of sections) {
			if (section.triggers && section.triggers[phrase]) {
				if (section.triggers[phrase] === event) {
					return section.triggers[phrase].detail;
				}
			}
		}
		return '';
	}

	$: {
		const currentTriggers = $triggerStore;

		for (const [event, triggerInfo] of currentTriggers) {
			if (!previousTriggers.has(event)) {
				const detail = findDetailForTrigger(event, triggerInfo.phrase);
				addToast({
					message: `Triggered on phrase: "${triggerInfo.phrase}"`,
					type: 'success',
					dismissible: true,
					timeout: 3000
				});
				if (detail) {
					addToast({
						message: `Description: "${detail}"`,
						type: 'info',
						dismissible: true,
						timeout: 5000
					});
				}
			}
		}

		// Check if any triggers were removed
		for (const [event] of previousTriggers) {
			if (!currentTriggers.has(event)) {
				// Optionally, you could add a toast for deactivation here
			}
		}

		previousTriggers = new Map(currentTriggers);
	}

	onMount(() => {
		return () => {
			triggerStore.reset();
		};
	});
</script>

<slot />
