import { deletePushSubscriptionByUserId, getPushSubscriptionByUserId, upsertPushSubscription } from '$lib/server/db/index.js';
import { error, type RequestHandler } from '@sveltejs/kit';
import { strict } from 'assert';

export const GET: RequestHandler = async ({ locals: { ctx, user } }) => {
	strict(typeof ctx !== 'undefined');
	if (!user) return error(401, 'unidentified user');

	const [subscription, ...rest] = await getPushSubscriptionByUserId(ctx.db, user.id);
	if (rest.length != 0) ctx.logger.warn({ rest }, 'length of rest not zero');

	try {
		const { pushSubscription } = subscription;

		ctx.logger.info({ user, pushSubscription }, 'subscription for user retrieved');

		return new Response(JSON.stringify({ pushSubscription }));
	} catch (e) {
		ctx.logger.warn(
			{ e },
			'an error occurred while trying to coerce pushSubscription out of subscription'
		);

		return new Response(JSON.stringify({ pushSubscription: null }));
	}
};

export const POST: RequestHandler = async ({ locals: { ctx, user }, request }) => {
	strict(typeof ctx !== 'undefined');
	if (!user) return error(401, 'unidentified user');

	const pushSubscription = await request.json();

	ctx.logger.info({ pushSubscription }, 'received subscription for user');

	const subscription = await upsertPushSubscription(ctx.db, user.id, pushSubscription);

	ctx.logger.info({ user }, 'subscription for user generated');

	return new Response(JSON.stringify(subscription));
};

export const DELETE: RequestHandler = async ({ locals: { ctx, user } }) => {
	strict(typeof ctx !== 'undefined');
	if (!user) return error(401, 'unidentiifed user');

	const userId = user.id;
	const subscription = await deletePushSubscriptionByUserId(ctx.db, userId);

	ctx.logger.info({ userId, subscription }, 'subscription for user deleted');

	return new Response(JSON.stringify(subscription));
}