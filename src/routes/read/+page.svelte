<!-- Note: the code for this page was taken, in part from the cozmo/jsQR repository on GitHub -->
<script lang="ts">
	import CameraReader from './CameraReader.svelte';
	import FileReader from './FileReader.svelte';

	let recognitionOption = $state();
	$effect(() => console.log(recognitionOption));
</script>

<h1>Testing jsQR for reading QR codes</h1>

<select bind:value={recognitionOption}>
	<option value="none">Select an option for QR Recognition</option>
	<option value="camera">Camera</option>
	<option value="file">File Upload</option>
</select>

{#if recognitionOption == 'camera'}
	<CameraReader />
{:else if recognitionOption == 'file'}
	<FileReader />
{/if}
