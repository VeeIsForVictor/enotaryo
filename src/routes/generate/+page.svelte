<script lang="ts">
	import QRCode from 'qrcode';
	import { onMount } from 'svelte';

	let outputCanvas: HTMLCanvasElement;

	let { form } = $props();

	onMount(() => {
		if (form) QRCode.toCanvas(outputCanvas, form.qrData);
	});
</script>

<form class="space-y-2" method="POST">
	<label class="block" for=""> UID: </label>
	<input name="uid" required />
	<label class="block" for="doc_id"> Document Identifier: </label>
	<input name="doc_id" type="text" required />
	<input class="block" type="submit" />
</form>

<div>
	<canvas bind:this={outputCanvas}></canvas>
</div>
