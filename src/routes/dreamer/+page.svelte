<!-- src/routes/dreamer/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import type { InitialSection } from '$lib/dreamer/templates/sectionTemplate';
	import type { SectionDraft } from '$lib/dreamer/templates/sectionDraft';
	import { generateScene } from '$lib/dreamer/utils/generateScene';

	let initialSection: InitialSection = {
		title: '',
		content: [''],
		sceneSetup: '',
		elements: {},
		progressAnimations: '',
		triggers: {}
	};

	let contentInput = '';
	let generatedDraft: SectionDraft | null = null;
	let isGenerating = false;
	let error = '';

	function parseContent(input: string): string[] {
		const lines = input.split('\n');

		const processedLines = lines.flatMap((line) => {
			line = line.trim();
			if (line === '') return [];

			if (!line.startsWith('`')) {
				return line
					.split(',')
					.map((item) => item.trim())
					.filter((item) => item !== '');
			}

			const regex = /(`[^`]*`|[^,]+)(?=\s*,|\s*$)/g;
			const matches = Array.from(line.matchAll(regex), (m) => m[0]);

			return matches
				.map((item) => {
					item = item.trim();
					if (item.startsWith('`') && item.endsWith('`')) {
						item = item.slice(1, -1);
					}
					return item.trim();
				})
				.filter((item) => item !== '');
		});

		return processedLines;
	}

	function camelCase(str: string): string {
		return str
			.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
				return index === 0 ? word.toLowerCase() : word.toUpperCase();
			})
			.replace(/\s+/g, '');
	}

	$: {
		if (typeof contentInput === 'string') {
			initialSection.content = parseContent(contentInput);
		}
	}

	function updateContentInput() {
		contentInput = initialSection.content
			.map((line) => {
				if (line.includes(',') || line.includes('`')) {
					return `\`${line.replace(/`/g, '\\`')}\``;
				}
				return line;
			})
			.join('\n');
	}

	function addContentLine() {
		initialSection.content = [...initialSection.content, ''];
		updateContentInput();
	}

	function removeContentLine(index: number) {
		initialSection.content = initialSection.content.filter((_, i) => i !== index);
		updateContentInput();
	}

	function addTrigger() {
		const key = `trigger${Object.keys(initialSection.triggers).length + 1}`;
		initialSection.triggers[key] = { phrase: '', detail: '' };
		initialSection = { ...initialSection };
	}

	function removeTrigger(key: string) {
		const { [key]: _, ...rest } = initialSection.triggers;
		initialSection.triggers = rest;
		initialSection = { ...initialSection };
	}

	function updateTriggers() {
		const updatedTriggers = {};
		Object.values(initialSection.triggers).forEach((trigger) => {
			if (trigger.phrase) {
				updatedTriggers[trigger.phrase] = {
					event: `${camelCase(trigger.phrase)}Event`,
					detail: trigger.detail
				};
			}
		});
		initialSection.triggers = updatedTriggers;
		initialSection = { ...initialSection };
	}

	function addElement() {
		const key = `element${Object.keys(initialSection.elements).length + 1}`;
		initialSection.elements[key] = { name: '', description: '' };
		initialSection = { ...initialSection };
	}

	function removeElement(key: string) {
		const { [key]: _, ...rest } = initialSection.elements;
		initialSection.elements = rest;
		initialSection = { ...initialSection };
	}

	function updateElements() {
		const updatedElements = {};
		Object.values(initialSection.elements).forEach((element) => {
			if (element.name) {
				updatedElements[camelCase(element.name)] = {
					description: element.description
				};
			}
		});
		initialSection.elements = updatedElements;
		initialSection = { ...initialSection };
	}

	async function handleSubmit() {
		if (
			initialSection.content.length === 0 ||
			initialSection.content.every((line) => line.trim() === '')
		) {
			error = 'Content cannot be empty';
			return;
		}

		isGenerating = true;
		error = '';
		try {
			generatedDraft = await generateScene(initialSection);
		} catch (e) {
			error = e.message || 'An error occurred while generating the scene';
		} finally {
			isGenerating = false;
		}
	}

	function handleFeedback() {
		if (generatedDraft) {
			generatedDraft.version += 1;
			console.log('Updated draft:', generatedDraft);
		}
	}

	onMount(() => {
		// Any initialization logic can go here
	});
</script>

<div class="container mx-auto p-4">
	<h1 class="text-2xl font-bold mb-4">Dreamer: 3D Scene Generator</h1>

	<form on:submit|preventDefault={handleSubmit} class="mb-8">
		<div class="mb-4">
			<label for="title" class="block mb-2">Title:</label>
			<p class="text-sm text-gray-600 mb-1">Provide a concise, descriptive title for your scene.</p>
			<input id="title" bind:value={initialSection.title} class="w-full p-2 border rounded" />
		</div>

		<div class="mb-4">
			<label class="block mb-2">Content:</label>
			<p class="text-sm text-gray-600 mb-1">
				Describe the key points of your scene. Each line or comma-separated value will be treated as
				a separate point. Use backticks (`) for values containing commas or quotes.
			</p>
			<textarea
				bind:value={contentInput}
				on:blur={updateContentInput}
				class="w-full p-2 border rounded mb-2"
				rows="4"
				placeholder="Enter content here. Each line or comma-separated value will be treated as a separate point."
			></textarea>
			{#each initialSection.content as line, i}
				<div class="flex mb-2">
					<input
						bind:value={initialSection.content[i]}
						on:blur={updateContentInput}
						class="flex-grow p-2 border rounded mr-2"
					/>
					<button
						type="button"
						on:click={() => removeContentLine(i)}
						class="bg-red-500 text-white px-4 py-2 rounded">Remove</button
					>
				</div>
			{/each}
			<button
				type="button"
				on:click={addContentLine}
				class="bg-blue-500 text-white px-4 py-2 rounded">Add Line</button
			>
		</div>

		<div class="mb-4">
			<label for="sceneSetup" class="block mb-2">Scene Setup:</label>
			<p class="text-sm text-gray-600 mb-1">
				Describe the initial setup and overall flow of your scene. Use ||| for simultaneous actions,
				> for sequential actions, + for parallel actions, and (duration) for timing.
			</p>
			<textarea
				id="sceneSetup"
				bind:value={initialSection.sceneSetup}
				class="w-full p-2 border rounded"
				rows="4"
			></textarea>
		</div>

		<div class="mb-4">
			<label class="block mb-2">Elements:</label>
			<p class="text-sm text-gray-600 mb-1">
				List the persistent objects in your scene. Describe their appearance and any ongoing
				animations. Names will be automatically camelCased.
			</p>
			{#each Object.entries(initialSection.elements) as [key, value]}
				<div class="flex flex-col mb-2">
					<input
						bind:value={value.name}
						placeholder="Element name"
						class="w-full p-2 border rounded mb-2"
						on:blur={updateElements}
					/>
					<textarea
						bind:value={value.description}
						placeholder="Element description and animations"
						class="w-full p-2 border rounded mb-2"
						rows="2"
						on:blur={updateElements}
					></textarea>
					<button
						type="button"
						on:click={() => removeElement(key)}
						class="bg-red-500 text-white px-4 py-2 rounded self-start">Remove</button
					>
				</div>
			{/each}
			<button type="button" on:click={addElement} class="bg-blue-500 text-white px-4 py-2 rounded"
				>Add Element</button
			>
		</div>

		<div class="mb-4">
			<label for="progressAnimations" class="block mb-2">Progress Animations:</label>
			<p class="text-sm text-gray-600 mb-1">
				Describe how elements change over the course of the scene. Specify which properties change,
				their start and end values, and any easing functions.
			</p>
			<textarea
				id="progressAnimations"
				bind:value={initialSection.progressAnimations}
				class="w-full p-2 border rounded"
				rows="4"
			></textarea>
		</div>

		<div class="mb-4">
			<label class="block mb-2">Triggers:</label>
			<p class="text-sm text-gray-600 mb-1">
				Specify key phrases that will trigger animations or state changes. Include a detailed
				description of what should happen. Event names will be automatically camelCased.
			</p>
			{#each Object.entries(initialSection.triggers) as [key, value]}
				<div class="flex flex-col mb-2">
					<input
						bind:value={value.phrase}
						placeholder="Trigger phrase"
						class="w-full p-2 border rounded mb-2"
						on:blur={updateTriggers}
					/>
					<textarea
						bind:value={value.detail}
						placeholder="Detailed description of trigger effect"
						class="w-full p-2 border rounded mb-2"
						rows="2"
						on:blur={updateTriggers}
					></textarea>
					<button
						type="button"
						on:click={() => removeTrigger(key)}
						class="bg-red-500 text-white px-4 py-2 rounded self-start">Remove</button
					>
				</div>
			{/each}
			<button type="button" on:click={addTrigger} class="bg-blue-500 text-white px-4 py-2 rounded"
				>Add Trigger</button
			>
		</div>

		<button
			type="submit"
			class="bg-green-500 text-white px-6 py-2 rounded"
			disabled={isGenerating || initialSection.content.length === 0}
		>
			{isGenerating ? 'Generating...' : 'Generate Scene'}
		</button>
	</form>

	{#if error}
		<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
			<strong class="font-bold">Error:</strong>
			<span class="block sm:inline">{error}</span>
		</div>
	{/if}

	{#if generatedDraft}
		<div class="bg-gray-100 p-4 rounded">
			<h2 class="text-xl font-bold mb-2">Generated Draft (Version {generatedDraft.version}):</h2>
			<pre class="whitespace-pre-wrap">{JSON.stringify(generatedDraft, null, 2)}</pre>

			<div class="mt-4">
				<label for="feedback" class="block mb-2">Feedback:</label>
				<p class="text-sm text-gray-600 mb-1">
					Provide feedback on the generated scene. Suggest adjustments to timing, behaviors, or
					clarify specific interactions.
				</p>
				<textarea
					id="feedback"
					bind:value={generatedDraft.feedback}
					class="w-full p-2 border rounded"
					rows="4"
				></textarea>
			</div>

			<button on:click={handleFeedback} class="mt-4 bg-purple-500 text-white px-6 py-2 rounded">
				Submit Feedback
			</button>
		</div>
	{/if}
</div>
