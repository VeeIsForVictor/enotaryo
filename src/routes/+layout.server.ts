import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	if (event.locals.user) {
		return { user: event.locals.user.signatoryId, pushSubscription: null };
	} else {
		return { user: null, pushSubscription: null };
	}
};
