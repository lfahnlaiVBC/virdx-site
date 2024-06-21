<script>
	import { onMount } from 'svelte';
	import * as PIXI from 'pixi.js';

	let app;
	let squares = [];

	onMount(() => {
		app = new PIXI.Application({
			width: 700,
			height: 700,
			backgroundColor: 0xf0f0f0
		});
		document.body.appendChild(app.view);

		for (let i = 0; i < 30000; i++) {
			addSquare();
		}

		app.ticker.add(() => {
			if (Math.random() < 0.5) {
				addSquare();
			} else {
				removeSquare();
			}
		});
	});

	function easeInCubic(x) {
		return x * x * x;
	}

	function createSquare(x, y, size) {
		let graphics = new PIXI.Graphics();
		graphics.beginFill(0x000000, 0.08);
		graphics.drawRect(0, 0, size, size);
		graphics.endFill();
		graphics.x = x;
		graphics.y = y;
		return graphics;
	}

	function addSquare() {
		let x = PIXI.utils.map(Math.random(), 0, 1, -20, app.screen.width + 20);
		let y = easeInCubic(Math.random()) * app.screen.height;
		let size = PIXI.utils.map(Math.random(), 0, 1, 5, 30);
		let square = createSquare(x, y, size);
		app.stage.addChild(square);
		squares.push(square);
	}

	function removeSquare() {
		if (squares.length > 0) {
			let square = squares.pop();
			app.stage.removeChild(square);
		}
	}
</script>

<style>
	body {
		margin: 0;
		padding: 0;
	}
	canvas {
		display: block;
	}
</style>
