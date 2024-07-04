// general defaults:
// assume things are initially invisible with 0 opacity.
// ease-in-out for most transformations, ease-in for opacity.
// transformations are relative to the viewer/screen/camera plane unless otherwise specified. Most rotations are described in terms of a coordinate system that is centered at the element's local (0,0,0), but oriented such that X = screen horizontal, Y = screen vertical, Z = screen depth. Rotations are in degrees
// Assume default screen size of 1024x768, viewed through an OrthographicCamera with position={[0, 0, 10]} and zoom={100}.

export const elements = {
	background: {
		description: `plain white plane`,
		label: ``
	},
	microscope: {
		description: `stack of 5 circular lens elements described in children, equal diameter and approximate thickness, separated by thickness of one lens`,
		animations: [
			{
				timing: `progress 0-0.25 ease-in-out`,
				actions: [
					`rotate stack 90deg around screen-X axis centered on midpoint so it goes from normal to camera plane to perpendicular and vertical`,
					`rotate 30deg around intrinsic Z axis so stack spins around long axis.`,
					`rotate each individual element about its own screen-X axis so that the different discs end up tilted 10deg downwards relative to the camera.`,
					`increase separation between discs by 50% starting value`
				]
			}
		],
		children: {
			inputLens: {
				description: `convex-concave lens, initially invisible`,
				label: `rpe histopathology`,
				animations: [
					{
						timing: `trigger "integrated ground truth"`,
						actions: [`become visible, opacity quick ramp in`]
					},
					{ timing: `hover`, actions: [`quick fade in label`] }
				]
			},
			forwardLens: {
				description: `biconvex lens`,
				label: `diffusion signature prediction`
			},
			centralLens: {
				description: `biconcave lens, 50% thicker than the others`,
				label: `~fusion engine`
			},
			backwardLens: {
				description: `biconvex lens`,
				label: `MRI tissue typing`
			},
			outputLens: {
				description: `concave-convex lens, initially invisible`,
				label: `digital MRI histology`,
				animations: [
					{
						timing: `trigger "integrated ground truth"`,
						actions: [`become visible, opacity quick ramp in`]
					},
					{ timing: `hover`, actions: [`quick fade in label`] }
				]
			}
		}
	},
	slide: {
		description: `circle-cropped plane showing view of end of last scene. https://github.com/mrdoob/three.js/blob/master/examples/webgl_portal.html for portal spec`,
		animations: [
			{
				trigger: `progress 0-0.25 ease-in-out`,
				actions: [`mask transitions from circle to square, rotates 45 degrees around normal`]
			}
		]
	},
	framework: {
		animations: [
			{
				timing: `trigger "Integrated Ground Truth" 250ms ease-in-out`,
				actions: [`becomes visible, opacity quick ramp in`]
			}
		],
		forwardArrow: {
			description: `white arrow consisting of circle extruded along path resembling three sides of a 1:3 aspect ratio rectangle (short long short), with a 1:2 aspect ratio cone with base diameter 1.5x extrusion diameter attached by the base to one end`
		},
		backwardArrow: {
			description: `white arrow consisting of circle extruded along path resembling three sides of a 1:3 aspect ratio rectangle (short long short), with a 1:2 aspect ratio cone with base diameter 1.5x extrusion diameter attached by the base to one end`
		}
	}
};
