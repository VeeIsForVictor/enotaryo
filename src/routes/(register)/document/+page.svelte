<script lang="ts">
	import { enhance } from "$app/forms";

	let inputFiles: FileList | null = $state(null);
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
	};
</script>

<form class="flex flex-col space-y-2 max-w-md" method="post" enctype="multipart/form-data" use:enhance>
	<label class="block" for="doc_id"> Document Title: 
		<input name="title" type="text" required />
	</label>

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
		type="submit"
		class="block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
	/>
</form>

<img
	src={imageURL}
	bind:this={image}
	id="upload"
	alt="uploaded by user"
	onload={onImageLoad}
	hidden
/>
