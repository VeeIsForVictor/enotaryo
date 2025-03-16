<script lang="ts">
	import { error } from '@sveltejs/kit';

	const { data } = $props();

	const { documents } = data;

	const [ document, ...rest ] = documents;
	if (rest.length != 0) error(421);

	const { id, title, file, signatureCount, signatoryCount, signatories } = document;

</script>

<div class="space-y-1">
	<a href="/public/{id}">
		<div class="flex-col border-slate-800 border-solid border-2 p-1">
			<p>Document with id {id}, title: {title}</p>
			<p>{signatureCount} signatures verified / {signatoryCount} signatures required</p>
			{#each signatories as { signatoryId, isVerified }}
				<p>{isVerified ? '✅' : '❎'} {signatoryId}</p>
			{/each}
			{@debug file}
			<p>TODO: Add image of the document here</p>
		</div>
	</a>
</div>
