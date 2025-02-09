<script lang="ts">
	import { enhance } from '$app/forms';
	import QRCode from 'qrcode';

	let outputCanvas: HTMLCanvasElement;

	let { form, data } = $props();
	const { user } = data;

	$effect(() => {
		if (form) QRCode.toCanvas(outputCanvas, form.qrData);
	});
</script>

<form class="space-y-2" method="POST" use:enhance>
	<label class="block" for=""> UID: </label>
	<input
		name="uid"
		pattern={'[a-Z0-9]{4}-[a-Z0-9]{4}-[a-Z0-9]{4}-[a-Z0-9]{4}'}
		required
		disabled
		class="valid:text-green-500 invalid:text-gray-500"
		value={user}
	/>
	<input
		class="block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
		type="submit"
	/>
</form>

<div>
	<canvas bind:this={outputCanvas}></canvas>
</div>
