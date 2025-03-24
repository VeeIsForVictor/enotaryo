<script lang="ts">
	const { data } = $props();

	const { documents } = data;
</script>

<div class="space-y-1">
	{#each documents as { id, title, signatureCount, signatoryCount, denyingCount }}
		<a href="/public/{id}">
			{#if signatureCount == signatoryCount}
				<div
					class="flex-col border-green-800 text-green-900 bg-green-300 border-solid border-2 p-1 hover:bg-green-400"
				>
					<p>Document with id {id}, title: {title}</p>
				</div>
			{:else if denyingCount > 0}
				<div
					class="flex-col border-red-800 text-red-900 bg-red-300 border-solid border-2 p-1 hover:bg-red-400"
				>
					<p>Document with id {id}, title: {title}</p>
				</div>
			{:else}
				<div class="flex-col border-slate-800 border-solid border-2 p-1 hover:bg-gray-400">
					<p>Document with id {id}, title: {title}</p>
				</div>
			{/if}
		</a>
	{/each}
</div>
