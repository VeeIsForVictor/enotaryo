<script lang="ts">
	import jsQR from 'jsqr';
	import type { Point } from 'jsqr/dist/locator';
	import type { QRCode } from 'qrcode';
	import { onMount } from 'svelte';

	let canvasElement: HTMLCanvasElement;
	let draftCanvasElement: HTMLCanvasElement;
	let blurCanvasElement: HTMLCanvasElement;
	let loadingMessage: HTMLDivElement;
	let outputContainer: HTMLDivElement;
	let outputMessage: HTMLDivElement;
	let outputData: HTMLSpanElement;

	let image: HTMLImageElement;
	let canvas: CanvasRenderingContext2D | null;

	let inputFiles: FileList | null = $state(null);
	let file: File | null = $state(null);
	let imageURL: string | null = $state(null);

	let imageData;
	let blurryData;

	function drawLine(begin: Point, end: Point, color: string) {
		if (canvas == null) return;
		canvas.beginPath();
		canvas.moveTo(begin.x, begin.y);
		canvas.lineTo(end.x, end.y);
		canvas.lineWidth = 4;
		canvas.strokeStyle = color;
		canvas.stroke();
	}

	let onImageLoad = () => {
		console.log('loaded image');
		loadingMessage.hidden = true;
		canvasElement.hidden = false;
		outputContainer.hidden = false;

		canvasElement.height = image.naturalHeight;
		canvasElement.width = image.naturalWidth;

		if (canvas == null) return;
		canvas.drawImage(image, 0, 0, canvasElement.width, canvasElement.height);
		imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
		let codes: any[] = [];

		let draftCanvas = draftCanvasElement.getContext('2d');
		if (draftCanvas == null) return;
		draftCanvasElement.height = canvasElement.height;
		draftCanvasElement.width = canvasElement.width;
		draftCanvas.putImageData(imageData, 0, 0);

		while (true) {
			//first, whole
			let newImageData = draftCanvas.getImageData(
				0,
				0,
				draftCanvasElement.width,
				draftCanvasElement.height
			);
			draftCanvasElement.hidden = false;

			let code = jsQR(newImageData.data, newImageData.width, newImageData.height, {
				inversionAttempts: 'attemptBoth'
			});
			if (code != null) {
				let qrRegion = new Path2D();
				qrRegion.moveTo(code.location.bottomLeftCorner.x, code.location.bottomLeftCorner.y);
				qrRegion.lineTo(code.location.bottomRightCorner.x, code.location.bottomRightCorner.y);
				qrRegion.lineTo(code.location.topRightCorner.x, code.location.topRightCorner.y);
				qrRegion.lineTo(code.location.topLeftCorner.x, code.location.topLeftCorner.y);
				qrRegion.closePath();

				draftCanvas.fillStyle = 'white';
				draftCanvas.fill(qrRegion, 'evenodd');

				codes.push(code);
			} else {
				//break;
				let blurCanvas = blurCanvasElement.getContext('2d');
				if (blurCanvas == null) return;
				blurCanvasElement.height = canvasElement.height;
				blurCanvasElement.width = canvasElement.width;
				blurCanvas.drawImage(
					draftCanvasElement,
					0,
					0,
					draftCanvasElement.width,
					draftCanvasElement.height
				);

				for (let y = 0; y < blurCanvasElement.height; y++) {
					for (let x = 0; x < blurCanvasElement.height; x++) {
						const opacity = Math.floor(Math.random() * 6);

						blurCanvas.fillStyle = 'rgba(255, 255, 255, 0.' + opacity + ')';
						blurCanvas.fillRect(x, y, 1, 1);
					}
				}

				blurryData = blurCanvas.getImageData(
					0,
					0,
					blurCanvasElement.width,
					blurCanvasElement.height
				);
				let code = jsQR(blurryData.data, blurryData.width, blurryData.height, {
					inversionAttempts: 'attemptBoth'
				});
				if (code == null) break;

				let qrRegion = new Path2D();
				qrRegion.moveTo(code.location.bottomLeftCorner.x, code.location.bottomLeftCorner.y);
				qrRegion.lineTo(code.location.bottomRightCorner.x, code.location.bottomRightCorner.y);
				qrRegion.lineTo(code.location.topRightCorner.x, code.location.topRightCorner.y);
				qrRegion.lineTo(code.location.topLeftCorner.x, code.location.topLeftCorner.y);
				qrRegion.closePath();

				draftCanvas.fillStyle = 'white';
				draftCanvas.fill(qrRegion, 'evenodd');

				codes.push(code);
			}
		}

		draftCanvasElement.hidden = true;

		if (outputData.parentElement == null)
			throw Error('parent element for output data is non-existent');
		if (codes.length != 0) {
			outputData.innerText = '';
			for (const code of codes) {
				console.log(code.data);
				if (code == null) return;
				drawLine(code.location.topLeftCorner, code.location.topRightCorner, '#FF3B58');
				drawLine(code.location.topRightCorner, code.location.bottomRightCorner, '#FF3B58');
				drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, '#FF3B58');
				drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, '#FF3B58');
				outputMessage.hidden = true;
				outputData.parentElement.hidden = false;
				outputData.innerText += code.data + '\n';
			}
			console.log(codes);
		} else {
		}
		codes = [];
	};

	let onFileChange = () => {
		if (inputFiles !== null) {
			file = inputFiles.item(0);

			if (file == null) return;
			imageURL = URL.createObjectURL(file);
		}
	};

	onMount(() => {
		canvas = canvasElement.getContext('2d');
	});

	function clearOutputData() {
		if (outputData.parentElement == null)
			throw Error('parent element for output data is non-existent');
		outputData.innerText = '';
		outputMessage.hidden = false;
		outputData.parentElement.hidden = true;
	}
</script>

<canvas bind:this={canvasElement} id="canvas" hidden></canvas>
<div id="loadingMessage" bind:this={loadingMessage}></div>
<img src={imageURL} bind:this={image} alt="ignore me" onload={onImageLoad} hidden />
<input
	type="file"
	accept="image/png,image/jpeg,image/webp"
	bind:files={inputFiles}
	onchange={onFileChange}
/>
<canvas bind:this={draftCanvasElement} id="draftCanvas" hidden></canvas>
<canvas bind:this={blurCanvasElement} id="blurCanvas" hidden></canvas>
<div id="output" bind:this={outputContainer} hidden>
	<div id="outputMessage" bind:this={outputMessage}>No QR code detected.</div>
	<div hidden><b>Data:</b> <span id="outputData" bind:this={outputData}></span></div>
	<button
		class="block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-sm"
		onclick={clearOutputData}>Clear Output</button
	>
</div>
