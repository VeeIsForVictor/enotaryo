<script lang="ts">
	import { validateIdNumber } from '$lib/models/signatory';
	import type { LayoutData } from '../$types';
	import type { ActionData } from './$types';
	import { env } from '$env/dynamic/public';

	let { form, data }: { form: ActionData; data: LayoutData } = $props();
	const { user } = data;

	const validationString = validateIdNumber.source;
</script>

<div class="flex flex-row w-auto space-x-5">
	<div class="space-y-2">
		{#if !user}
			<h3 class="text-lg">Register</h3>
			<form class="flex flex-col space-y-5" action="?/login" method="post">
				<label class="flex flex-col">
					{env.PUBLIC_ID_MODEL.toUpperCase()} Signatory ID
					<input
						name="id"
						pattern={validationString}
						required
						class="valid:text-green-500 invalid:text-gray-500"
					/>
				</label>
				<label class="flex flex-col">
					Password
					<input type="password" name="password" />
				</label>
				<button class="block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-sm"
					>Login</button
				>
				<button
					class="block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-sm"
					formaction="?/register">Register</button
				>
			</form>
		{:else}
			<h3 class="text-lg">Logout</h3>
			<form class="flex flex-col space-y-5" action="?/logout" method="post">
				<button
					class="block bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-sm"
					formaction="?/logout">Logout</button
				>
			</form>
		{/if}
	</div>
</div>
<div>
	<p style="color: red">{form?.message ?? ''}</p>
</div>
