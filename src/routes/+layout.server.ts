import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const pushSubscriptionRequest = await event.fetch('/api/push');
	const { pushSubscription } = await pushSubscriptionRequest.json();

	if (event.locals.user) {
		return { user: event.locals.user.signatoryId, pushSubscription };
	} else {
		return { user: null, pushSubscription: null };
	}
};
