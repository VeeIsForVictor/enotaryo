<script lang="ts">
	const { data } = $props();

	const { documents } = data;
</script>

<div class="space-y-1">
	{#each documents as { id, title, signatureCount, signatoryCount }}
		<div class="flex-col border-slate-800 border-solid border-2 p-1">
			<p>Document with id {id}, title: {title}</p>
            <p>{signatureCount} signatures verified / {signatoryCount} signatures required</p>
		</div>
	{/each}
</div>
