# 3D Scene Generation System

This system provides a structured approach to creating and iterating on 3D scenes using Svelte and Threlte. It bridges the gap between conceptual design and technical implementation, allowing for gradual refinement of complex 3D scenes.

## Getting Started

1. Install dependencies:

2. Familiarize yourself with the key files:

- `src/lib/sectionTemplate.ts`: Initial template for scene description
- `src/lib/sectionDraft.ts`: Draft template for refined scene structure
- `src/lib/components/scenes/WaterDynamicsScene.svelte`: Example scene implementation

## Workflow

1. Create an initial scene description using the structure in `sectionTemplate.ts`.

2. Use the provided prompt (see `PROMPT.md`) with an LLM to generate a refined scene draft based on `sectionDraft.ts`.

3. Review the generated draft, focusing on:

- Accuracy of interpretation
- Completeness of element descriptions
- Appropriateness of animations and timings
- Areas needing clarification

4. Provide feedback and clarifications in the `feedback` section of the draft.

5. Iterate by re-submitting the updated draft to the LLM until satisfied.

6. Implement the final scene as a Svelte component using Threlte, following the example in `WaterDynamicsScene.svelte`.

## Key Concepts

- **Elements**: Persistent or one-off objects in the scene.
- **Triggers**: Events that cause specific animations or state changes.
- **Progress Animations**: Changes that occur based on overall scene progress.
- **Scene Description**: Chronological description of scene events using special syntax.

## Syntax Guide

- `^^^entity_name^^^`: Refers to a specific scene element.
- `||| |||`: Groups simultaneous actions.
- `>`: Indicates a sequential action.
- `+`: Indicates a parallel action.
- `(duration)`: Specifies timing for an action, e.g., `(1s)` or `(500ms)`.

## Best Practices

1. Start with a clear, high-level description of the scene.
2. Break down complex animations into smaller, manageable steps.
3. Consider performance implications, especially for ongoing animations.
4. Use Svelte springs for smooth transitions where appropriate.
5. Implement cleanup logic for scene elements when visibility changes or the component is destroyed.
6. Write idiomatic Svelte code with reactive statements and compact ES6 style.

## Troubleshooting

If you encounter issues:

1. Check that all required properties are specified in the scene draft.
2. Ensure that the scene description syntax is correctly formatted.
3. Verify that all referenced elements are defined in the `elements` section.
4. Review the `clarificationNeeded` section for potential ambiguities.

For further assistance, please refer to the documentation or reach out to the development team.
