<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import { error } from '@sveltejs/kit';
	import { PUBLIC_VAPID_KEY } from '$env/static/public';

	// @ts-expect-error
	import toUint8Array from 'urlb64touint8array';

	let { children, data } = $props();
	let { user, pushSubscription } = data;

	async function askPermission(): Promise<boolean> {
		const permissionResult = await Notification.requestPermission();
		return permissionResult == 'granted';
	}

	onMount(async () => {
		// request push notif permission if not yet granted for a logged-in user
		if (user) {
			if (Notification.permission != 'granted') await askPermission();
		}

		// grab a service worker registration and create a push subscription if non-existent
		if (!pushSubscription) {
			console.log('attempting to generate push subscription!');
			console.log(`VAPID KEY: ${PUBLIC_VAPID_KEY}`);
			const registration = await navigator.serviceWorker.getRegistration();
			if (!registration) error(400, 'Service worker not properly registered');
			const newSubscription = await registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: toUint8Array(PUBLIC_VAPID_KEY)
			});
			fetch('/api/push', {
				method: 'POST',
				headers: {
					'Content-type': 'application/json'
				},
				body: JSON.stringify(newSubscription)
			});
		}
	});
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
