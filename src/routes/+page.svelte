<script lang="ts">
	import type { LayoutData } from './$types';

	const { data }: { data: LayoutData } = $props();
	const { user } = data;
</script>

<div class="prose">
	<h3 class="h3">Hello, world! Welcome to the ENotaryo Frontend!</h3>
	<!-- <a href="/document">Register Documents</a><br /> -->
	<a href="/signatory">Register Signatories</a><br />
	<a href="/generate">Generate a QR</a><br />
	<a href="/read">Read a QR</a><br />
	{#if user}
		<a href="/otp">Check pending transactions</a>
	{/if}
</div>
