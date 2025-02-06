<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<title>ENotaryo</title>
</svelte:head>

<div class="container mx-8 my-4 w-auto">
	{@render children()}
</div>
