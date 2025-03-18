<script lang="ts">
	import type { LayoutData } from './$types';

	const { data }: { data: LayoutData } = $props();
	const { user } = data;
</script>

<div class="flex flex-col items-center justify-center gap-y-5 my-auto">
	<img src="/enotaryo-logo.png" alt="logo of the app" class="bg-purple-300 rounded-3xl" height=256 width=256/>
	<div class="prose flex flex-col items-center">
		<h1>Welcome to ENotaryo</h1>
		<a href="/signatory">Register Signatories</a>
		<a href="/document">Upload a Document</a>
		{#if user}
			<a href="/otp">Check pending transactions</a>
		{/if}
		<a href="/public">View Documents</a>
	</div>
</div>
