<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import { error } from '@sveltejs/kit';
	import { env } from '$env/dynamic/public';

	// @ts-expect-error
	import toUint8Array from 'urlb64touint8array';

	let { children, data } = $props();
	let { user, pushSubscription: retrievedSubscription } = data;

	async function askPermission(): Promise<boolean> {
		const permissionResult = await Notification.requestPermission();
		return permissionResult == 'granted';
	}

	onMount(async () => {
		if (!user) {
			return;
		}

		// request push notif permission if not yet granted for a logged-in user
		if (Notification.permission != 'granted') await askPermission();

		const registration = await navigator.serviceWorker.getRegistration();
		const pushSubscription = await registration?.pushManager.getSubscription();

		// grab a service worker registration and create a push subscription if non-existent
		if (
			!pushSubscription ||
			!retrievedSubscription ||
			pushSubscription.endpoint != retrievedSubscription?.endpoint
		) {
			console.log('attempting to generate push subscription!');
			if (!registration) error(400, 'Service worker not properly registered');
			const newSubscription = await registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: toUint8Array(env.PUBLIC_VAPID_KEY)
			});
			fetch('/api/push', {
				method: 'POST',
				headers: {
					'Content-type': 'application/json'
				},
				body: JSON.stringify(newSubscription)
			});
		}

		console.log(pushSubscription);
		console.log(retrievedSubscription);
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

<div class="flex flex-col container justify-between mx-8 w-auto h-dvh">
	{@render children()}
</div>
