<script lang="ts">
	import { validateIdNumber } from '$lib/models/signatory';
	import env from '$lib/env';
	import type { ActionData, LayoutData } from './$types';

	const { data, form }: { data: LayoutData, form: ActionData } = $props();
	const { user } = data;

	const validationString = validateIdNumber.source;
</script>

<div class="flex flex-col items-center justify-center gap-y-5 my-auto">
	<img src="/enotaryo-logo.png" alt="logo of the app" class="bg-purple-300 rounded-3xl" height=256 width=256/>
	<div class="prose flex flex-col items-center">
		<h1>Welcome to ENotaryo</h1>
		<div class="flex flex-row w-auto space-x-5">
			<div class="space-y-2">
				{#if !user}
					<form class="flex flex-col space-y-5" action="?/login" method="post">
						<label class="flex flex-col">
							{env.ID_MODEL.toUpperCase()} Signatory ID
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
						<button
							class="block bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded-sm"
							>Login</button
						>
						<button
							class="block bg-purple-400 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-sm"
							formaction="?/register">Register</button
						>
					</form>
				{:else}
				<h3 class="text-lg">You are logged in as {user}</h3>
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
	</div>
</div>
