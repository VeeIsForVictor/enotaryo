<script lang="ts">
	import { error } from '@sveltejs/kit';

	const { data } = $props();

	const { documents } = data;

	const [document, ...rest] = documents;
	if (rest.length != 0) error(421);

	const { id, title, file, signatureCount, signatoryCount, signatories } = document;

	let { data: _data } = $state(JSON.parse(file));
	let objectUrl = $state('');

	$effect(() => {
		let fileData = $derived(new Uint8Array(_data));
		let parsedFile = $derived(new Blob([fileData], { type: 'image/png' }));
		objectUrl = URL.createObjectURL(parsedFile);
	});
</script>

<div class="space-y-1">
	<div class="flex-col border-slate-800 border-solid border-2 p-1">
		<p>Document with id {id}, title: {title}</p>
		<p>{signatureCount} signatures verified / {signatoryCount} signatures required</p>
		{#each signatories as { signatoryId, status }}
			<p>
				{#if status == 'denied'}
					<span class="text-red-500">Denied</span>
				{:else if status == 'pending'}
					<span class="text-yellow-500">Pending</span>
				{:else if status == 'approved'}
					<span class="text-green-500">Approved</span>
				{:else}
					<span class="text-gray-500">Unknown</span>
				{/if}
				{signatoryId}
			</p>
		{/each}
		<img src={objectUrl} alt={title} />
	</div>
</div>
