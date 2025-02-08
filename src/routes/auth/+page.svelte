<script lang="ts">
	import type { LayoutData } from '../$types';
	import type { ActionData } from './$types';

	let { form, data }: { form: ActionData; data: LayoutData } = $props();
	const { user } = data;
</script>

<div class="flex flex-row w-auto space-x-5">
	<div class="space-y-2">
		{#if !user}
			<h3 class="text-lg">Register</h3>
			<form class="flex flex-col space-y-5" action="?/login" method="post">
				<label class="flex flex-col">
					Signatory ID
					<input name="id" />
				</label>
				<label class="flex flex-col">
					Password
					<input type="password" name="password" />
				</label>
				<button class="block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
					>Login</button
				>
				<button
					class="block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
					formaction="?/register">Register</button
				>
			</form>
		{:else}
			<h3 class="text-lg">Logout</h3>
			<form class="flex flex-col space-y-5" action="?/logout" method="post">
				<button
					class="block bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
					formaction="?/logout">Logout</button
				>
			</form>
		{/if}
	</div>
</div>
<div>
	<p style="color: red">{form?.message ?? ''}</p>
</div>
