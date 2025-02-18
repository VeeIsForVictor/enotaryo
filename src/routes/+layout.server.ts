import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const pushSubscriptionRequest = await fetch('/api/push');
	const pushSubscription: PushSubscriptionJSON | null = await pushSubscriptionRequest.json();

	if (event.locals.user) {
		return { user: event.locals.user.signatoryId, pushSubscription };
	} else {
		return { user: null, pushSubscription: null };
	}
};
