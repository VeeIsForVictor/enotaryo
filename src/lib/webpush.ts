import { env } from '$env/dynamic/private';
import * as public_env from '$env/dynamic/public';
import webpush from 'web-push';

export async function sendNotification(
	subscription: PushSubscriptionJSON,
	title: string = 'Hello, world!',
	body: string = 'Hello from ENotaryo!'
) {
	webpush.setVapidDetails(
		'mailto:vereyes2+push-notifs@up.edu.ph',
		public_env.env.PUBLIC_VAPID_KEY,
		env.PRIVATE_VAPID_KEY
	);

	const notification = JSON.stringify({
		title,
		options: {
			body
		}
	});

	// ignore the error that arises here
	return (
		webpush
			// @ts-expect-error: webpush doesn't provide good type definitions for PushSubscription vs PushSubscriptionJSON
			.sendNotification(subscription, notification)
	);
}
