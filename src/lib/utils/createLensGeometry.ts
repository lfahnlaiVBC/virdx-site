// src/lib/utils/threeUtils.ts

import * as THREE from 'three';

/**
 * Creates a lens geometry
 * @param radius The radius of the lens
 * @param addedThickness The additional thickness to add to the combined height of both curvatures
 * @param curvature1 The curvature of the first surface (-1 to 1, where 1 is convex, -1 is concave, and 0 is flat)
 * @param curvature2 The curvature of the second surface (-1 to 1, where 1 is convex, -1 is concave, and 0 is flat)
 * @param segments The number of segments to use when creating the geometry
 * @returns THREE.BufferGeometry
 *
 * Example parameters:
 * Cylinder:        (1, 2,  0,   0,   32)
 * Perfect sphere:  (1, 0,  1,   1,   32)
 * Biconvex lens:   (1, 0,  0.2, 0.2, 32)
 * Biconcave lens:  (1, 0, -0.2,-0.2, 32)
 * Meniscus lens:   (1, 0,  0.3,-0.2, 32)
 */
export default function createLensGeometry(
	radius: number,
	addedThickness: number,
	curvature1: number,
	curvature2: number,
	segments: number
): THREE.BufferGeometry {
	const points: THREE.Vector2[] = [];

	// Clamp curvature values between -1 and 1
	curvature1 = Math.max(-1, Math.min(1, curvature1));
	curvature2 = Math.max(-1, Math.min(1, curvature2));

	// Invert the second curvature
	curvature2 = -curvature2;

	// Helper function to calculate y for a given x and curvature
	const getY = (x: number, curvature: number) => {
		if (Math.abs(curvature) < 1e-6) return 0;
		const sign = Math.sign(curvature);
		const absCurvature = Math.abs(curvature);
		const r = radius / absCurvature;
		return -1 * sign * (r - Math.sqrt(Math.max(0, r * r - x * x)));
	};

	// Calculate the height of each curve at x=0
	const h1 = getY(0, curvature1);
	const h2 = getY(0, curvature2);

	// Calculate total thickness
	const totalThickness = Math.abs(h1) + Math.abs(h2) + addedThickness;

	// Calculate vertical offset to center the lens
	const offset = totalThickness / 2;

	// Generate points for the first curve
	for (let i = 0; i <= segments; i++) {
		const x = (i / segments) * radius;
		const y = getY(x, curvature1) + offset;
		points.push(new THREE.Vector2(x, y));
	}

	// Generate points for the second curve (in reverse)
	for (let i = segments; i >= 0; i--) {
		const x = (i / segments) * radius;
		const y = getY(x, curvature2) - offset;
		points.push(new THREE.Vector2(x, y));
	}

	// Create the geometry by rotating the points
	const geometry = new THREE.LatheGeometry(points, 64);
	geometry.computeVertexNormals();

	return geometry;
}
