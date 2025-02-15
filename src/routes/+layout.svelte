<script lang="ts">
	import '../app.css';
	let { children, data } = $props();
	let { user } = data;
</script>

<svelte:head>
	<title>ENotaryo</title>
	<meta name="description" content="The website for the CS199 ENotaryo Project" />
	<meta name="author" content="Manansala, J. A. & Reyes, V. E." />
</svelte:head>

<div class="flex justify-between w-auto my-1 mx-1">
	<p><a href="/">ENotaryo</a></p>
	{#if user}
		<a href="/auth">You are logged in as: {user}</a>
	{:else}
		<a href="/auth">You are not currently logged in</a>
	{/if}
</div>

<div class="mx-8 my-4 w-auto">
	{@render children()}
</div>
