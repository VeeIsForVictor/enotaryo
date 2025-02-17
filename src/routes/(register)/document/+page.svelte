<script lang="ts">
	let inputFiles : FileList | null = $state(null);
	let file: File | null = $state(null);
	
	let imageURL: string | null = $state(null);
	let image: HTMLImageElement;

	let onFileChange = () => {
		if (inputFiles !== null) {
			file = inputFiles.item(0);

			if (file == null) return;
			imageURL = URL.createObjectURL(file);
		}
	};

	let onImageLoad = () => {
		console.log('loaded image');
		image.hidden = false;

	}
</script>

<form class="space-y-2" method="POST">
	<label class="block" for="doc_id"> Document Title: </label>
	<input name="title" type="text" required /><br />

	<input
	name="file"
	type="file"
	id="fileInput"
	accept="image/png,image/jpeg,image/webp"
	bind:files={inputFiles}
	onchange={onFileChange}
	required
	/>

	<input
		class="block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
		type="submit"
	/>
</form>

<img src={imageURL} bind:this={image} id="upload" alt="uploaded by user" onload={onImageLoad} hidden />
