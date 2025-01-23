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
	<input name="uid" pattern="\d{4}-\d{4}-\d{4}-\d{4}" required />
	<label class="block" for="doc_id"> Document Identifier: </label>
	<input name="doc_id" type="text" required />
	<input
		class="block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
		type="submit"
	/>
</form>

<div>
	<canvas bind:this={outputCanvas}></canvas>
</div>
