<!-- Note: the code for this page was taken, in part from the cozmo/jsQR repository on GitHub -->
<script lang="ts">
	import jsQR from 'jsqr';
	import type { Point } from 'jsqr/dist/locator';
	import { onMount } from 'svelte';

	let canvasElement: HTMLCanvasElement;
	let loadingMessage: HTMLDivElement;
	let outputContainer: HTMLDivElement;
	let outputMessage: HTMLDivElement;
	let outputData: HTMLSpanElement;

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
				let imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
				let code = jsQR(imageData.data, imageData.width, imageData.height, {
					inversionAttempts: 'dontInvert'
				});

				if (outputData.parentElement == null) throw Error("parent element for output data is non-existent");
				if (code) {
					drawLine(code.location.topLeftCorner, code.location.topRightCorner, '#FF3B58');
					drawLine(code.location.topRightCorner, code.location.bottomRightCorner, '#FF3B58');
					drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, '#FF3B58');
					drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, '#FF3B58');
					outputMessage.hidden = true;
					outputData.parentElement.hidden = false;
					outputData.innerText = code.data;
				} else {
					outputMessage.hidden = false;
					outputData.parentElement.hidden = true;
				}
			}
			requestAnimationFrame(tick);
		}
	});
</script>

<h1>Testing jsQR for reading QR codes</h1>
<canvas bind:this={canvasElement} id="canvas" hidden></canvas>
<div id="loadingMessage" bind:this={loadingMessage}>
	🎥 Unable to access video stream (please make sure you have a webcam enabled)
</div>
<canvas id="canvas" hidden></canvas>
<div id="output" bind:this={outputContainer} hidden>
	<div id="outputMessage" bind:this={outputMessage}>No QR code detected.</div>
	<div hidden><b>Data:</b> <span id="outputData" bind:this={outputData}></span></div>
</div>
