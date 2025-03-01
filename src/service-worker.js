/// <reference types="@sveltejs/kit" />
import { build, files, version } from '$service-worker';

// Create a unique cache name for this deployment
const CACHE = `cache-${version}`;

const ASSETS = [
	...build, // the app itself
	...files // everything in `static`
];

self.addEventListener('install', (event) => {
	// Create a new cache and add all files to it
	async function addFilesToCache() {
		const cache = await caches.open(CACHE);
		await cache.addAll(ASSETS);
	}

	event.waitUntil(addFilesToCache());
});

self.addEventListener('activate', (event) => {
	// Remove previous cached data from disk
	async function deleteOldCaches() {
		for (const key of await caches.keys()) {
			if (key !== CACHE) await caches.delete(key);
		}
	}

	event.waitUntil(deleteOldCaches());
});

self.addEventListener('fetch', (event) => {
	// ignore POST requests etc
	if (event.request.method !== 'GET') return;

	async function respond() {
		const url = new URL(event.request.url);
		const cache = await caches.open(CACHE);

		// `build`/`files` can always be served from the cache
		if (ASSETS.includes(url.pathname)) {
			const response = await cache.match(url.pathname);

			if (response) {
				return response;
			}
		}

		// for everything else, try the network first, but
		// fall back to the cache if we're offline
		try {
			const response = await fetch(event.request);

			// if we're offline, fetch can return a value that is not a Response
			// instead of throwing - and we can't pass this non-Response to respondWith
			if (!(response instanceof Response)) {
				throw new Error('invalid response from fetch');
			}

			if (response.status === 200) {
				cache.put(event.request, response.clone());
			}

			return response;
		} catch (err) {
			const response = await cache.match(event.request);

			if (response) {
				return response;
			}

			// if there's no cache, then just error out
			// as there is nothing we can do to respond to this request
			throw err;
		}
	}

	event.respondWith(respond());
});

self.addEventListener('push', async (event) => {
	if (!(self.Notification && self.Notification.permission === 'granted')) return;
	console.log(`Received event with data.text ${event.data?.text()}`);

	const data = event.data?.json() ?? {};

	const notificationTitle = data.title ?? 'DeliVault Notification';
	const notificationBody = data.options.body ?? 'With love, from DeliVault!';

	const thisWorker = await self.registration;

	event.waitUntil(
		thisWorker
			.showNotification(notificationTitle, {
				lang: 'en',
				body: notificationBody,
				vibrate: [500, 500, 500],
				icon: 'favicon.png'
			})
			.then(console.log('Notification sent!'))
	);
});

// the above code was taken from https://github.com/CS145-2324B-Preggos/Delivault-Svelte-App

self.addEventListener('pushsubscriptionchange', async (event) => {
	console.log('push subscription expired');

	event.waitUntil(
		self.registration.pushManager.subscribe(event.oldSubscription.options).then((subscription) => {
			fetch('/api/push', {
				method: 'POST',
				headers: {
					'Content-type': 'application/json'
				},
				body: JSON.stringify(subscription)
			});
		})
	);
});
