<script lang="ts">
	import { enhance } from '$app/forms';
	import QRCode from 'qrcode';

	let outputCanvas: HTMLCanvasElement;

	let { form } = $props();

	$effect(() => {
		if (form) QRCode.toCanvas(outputCanvas, form.qrData);
	});
</script>

<form class="space-y-2" method="POST" use:enhance>
	<label class="block" for=""> UID: </label>
	<input
		name="uid"
		pattern={'[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}'}
		required
		class="valid:text-green-500 invalid:text-gray-500"
	/>
</form>

<div>
	<canvas bind:this={outputCanvas}></canvas>
</div>
