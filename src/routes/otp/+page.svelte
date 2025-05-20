<script lang="ts">
	import { enhance } from '$app/forms';

	const { data } = $props();

	const { results, form } = data;

	$effect(() => console.log(form));
</script>

<div class="space-y-1">
	{#each results as { id, status, documentTitle }}
		{@const testId = documentTitle.replace(/\s+/g, '-').toLowerCase()}
		{@const txnId = id}
		<div
			class="flex-col border-slate-800 border-solid border-2 p-1"
			data-testId="doc-{testId}"
		>
			<p>Transaction with id {id} for <strong>"{documentTitle}"</strong>, status: {status}</p>
			{#if status == 'pending'}
				<form
					class="flex flex-col space-y-2 my-4 max-w-md"
					method="post"
					action="?/approve"
					use:enhance
				>
					<input type="text" name="id" id="id" readonly hidden value={txnId} />
					<label for="otp">
						One-time Password
						<input type="text" name="otp" id="otp" />
					</label>
					<input
						class="block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-sm"
						type="submit"
						data-testid="approve-{testId}"
					/>
					<button
						class="block bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-sm"
						formaction="?/deny"
						data-testid="deny-{testId}"
					>
						Deny
					</button>
				</form>
			{/if}
			{#if form?.txnId == txnId}
				<p>isCorrect: {form.isCorrect}</p>
			{/if}
		</div>
	{/each}
</div>
