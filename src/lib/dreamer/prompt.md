# Scene Generation Prompt

Given the initial section template (src/lib/sectionTemplate.ts) and the draft template (src/lib/sectionDraft.ts), generate a refined 3D scene description for a Svelte component using Threlte. Your task is to:

1. Interpret the loose descriptions from the initial template and expand them into detailed animations and behaviors.
2. Structure the information into triggers, elements, and an overall scene description using the draft template structure.
3. Use the ^^^entity_name^^^ syntax for scene elements in animations and descriptions.
4. Specify precise timings for animations where appropriate, using milliseconds (e.g., 1000ms) or seconds (e.g., 2s).
5. Infer appropriate shaders and initial states for elements based on their descriptions.
6. Create a chronological sceneDescription using the provided syntax: ||| ||| for grouping simultaneous actions, > for sequential actions, + for parallel actions, and (duration) for specifying timing.
7. Translate loose progress animation descriptions into specific instructions using the Animation type structure.
8. Identify and list areas where more clarification is needed from the user in the clarificationNeeded array.
9. Include placeholders for user feedback in the feedback string, with commented instructions on how to use it.
10. Incorporate any one-off elements mentioned in the initial input's sceneSetup or progressAnimations into the elements object, noting that they are one-off.

Your output should follow the SectionDraft type structure in src/lib/sectionDraft.ts, including:

- title: string
- content: string[]
- triggers: Record<string, Trigger>
- elements: Record<string, Element>
- sceneDescription: string
- progressAnimations: Animation[]
- clarificationNeeded: string[]
- feedback: string
- version: number
- initialInput: InitialSection

Ensure that all animations and behaviors can be easily translated into a Svelte component using Threlte, as demonstrated in the example scene (src/lib/components/scenes/WaterDynamicsScene.svelte).

Remember these key requirements for the final scene implementation:

- The outermost element should have a visibility prop: <T.Group visible={visibility !== 0}>
- Use TypeScript and export two let props: sceneProgress: number and visibility: number
- Use Svelte springs for smooth transitions where appropriate
- Write idiomatic Svelte code with reactive statements and compact ES6 style (arrow functions, ternaries)
- Implement cleanup logic for when visibility changes or the component is destroyed
- Consider performance implications, especially for ongoing animations

For each element, consider:

- Its initial state and how it enters the scene
- Any ongoing animations or behaviors (e.g., vibration, rotation)
- How it interacts with other elements or responds to triggers
- How its properties change based on overall scene progress

For triggers, detail:

- The exact visual changes that occur
- Which elements are affected and how
- The timing and nature of the animations involved

For progress-based animations, specify:

- Which properties of which elements change over the course of the scene
- The start and end values for these properties
- Any easing functions that should be applied

Highlight any assumptions made or areas where more information would be beneficial. The goal is to create a comprehensive scene description that can be iteratively refined and easily implemented as a Svelte/Threlte component.

After generating the scene description, provide a brief explanation of your choices and any areas you think might need special attention during implementation.
