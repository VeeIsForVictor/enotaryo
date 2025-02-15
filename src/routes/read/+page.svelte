<!-- Note: the code for this page was taken, in part from the cozmo/jsQR repository on GitHub -->
<script lang="ts">
	import CameraReader from './CameraReader.svelte';
	import FileReader from './FileReader.svelte';
	import PerfectReader from './PerfectReader.svelte';

	let recognitionOption = $state();
	$effect(() => console.log(recognitionOption));

	let { form } = $props();

	$effect(() => {
		console.log(form);
	});
</script>

{#if form?.txnId}
	<p class="text-green-600">
		OTP Transaction created with ID: {form.txnId}, {form.isVerified ? 'verified' : 'unverified'}
	</p>
{/if}

{#if form?.message}
	<p class="text-red-700">{form.message}</p>
{/if}

<h1>Testing jsQR for reading QR codes</h1>

<select bind:value={recognitionOption}>
	<option value="none">Select an option for QR Recognition</option>
	<option value="camera">Camera</option>
	<option value="file">File Upload</option>
	<option value="perfect">Hypothetical Reader</option>
</select>

{#if recognitionOption == 'camera'}
	<CameraReader />
{:else if recognitionOption == 'file'}
	<FileReader />
{:else if recognitionOption == 'perfect'}
	<PerfectReader />
{/if}
