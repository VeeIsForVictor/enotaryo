<script lang="ts">
	import '../app.css';
	let { children, data } = $props();
	let { user } = data;

</script>

<svelte:head>
	<title>ENotaryo</title>
</svelte:head>

<div class="flex justify-between w-auto my-1 mx-1">
	<p>This is a header</p>
	{#if user}
		<p>You are logged in as: {user}</p>
	{:else}
		<a href="/auth">You are not currently logged in</a>
	{/if}
</div>

<div class="mx-8 my-4 w-auto">
	{@render children()}
</div>
