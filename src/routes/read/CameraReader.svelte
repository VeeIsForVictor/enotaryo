<script lang="ts">
    import jsQR from 'jsqr';
	import type { Point } from 'jsqr/dist/locator';
	import { onMount } from 'svelte';

	let canvasElement: HTMLCanvasElement;
	let draftCanvasElement: HTMLCanvasElement;
	let loadingMessage: HTMLDivElement;
	let outputContainer: HTMLDivElement;
	let outputMessage: HTMLDivElement;
	let outputData: HTMLSpanElement;

	let imageData;

	onMount(() => {
		let video = document.createElement('video');
		let canvas = canvasElement.getContext('2d');

		function drawLine(begin: Point, end: Point, color: string) {
			if (canvas == null) return;
			canvas.beginPath();
			canvas.moveTo(begin.x, begin.y);
			canvas.lineTo(end.x, end.y);
			canvas.lineWidth = 4;
			canvas.strokeStyle = color;
			canvas.stroke();
		}

		// Use facingMode: environment to attemt to get the front camera on phones
		navigator.mediaDevices
			.getUserMedia({ video: { facingMode: 'environment' } })
			.then(function (stream) {
				video.srcObject = stream;
				video.setAttribute('playsinline', 'true'); // required to tell iOS safari we don't want fullscreen
				video.play();
				requestAnimationFrame(tick);
			});

		function tick() {
			if (canvas == null) return;
			loadingMessage.innerText = '⌛ Loading video...';
			if (video.readyState === video.HAVE_ENOUGH_DATA) {
				loadingMessage.hidden = true;
				canvasElement.hidden = false;
				outputContainer.hidden = false;

				canvasElement.height = video.videoHeight;
				canvasElement.width = video.videoWidth;
				canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
				imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
				let codes: any[] = [];

				let draftCanvas = draftCanvasElement.getContext('2d');
				if (draftCanvas == null) return;
				draftCanvasElement.height = canvasElement.height;
				draftCanvasElement.width = canvasElement.width;
				draftCanvas.putImageData(imageData, 0, 0);

				while (true) {
					let newImageData = draftCanvas.getImageData(
						0,
						0,
						draftCanvasElement.width,
						draftCanvasElement.height
					);
					draftCanvasElement.hidden = false;

					let code = jsQR(newImageData.data, newImageData.width, newImageData.height, {
						inversionAttempts: 'dontInvert'
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
			}
			requestAnimationFrame(tick);
		}
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
<div id="loadingMessage" bind:this={loadingMessage}>
	🎥 Unable to access video stream (please make sure you have a webcam enabled)
</div>
<canvas bind:this={draftCanvasElement} id="draftCanvas" hidden></canvas>
<div id="output" bind:this={outputContainer} hidden>
	<div id="outputMessage" bind:this={outputMessage}>No QR code detected.</div>
	<div hidden><b>Data:</b> <span id="outputData" bind:this={outputData}></span></div>
	<button
		class="block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
		onclick={clearOutputData}>Clear Output</button
	>
</div>