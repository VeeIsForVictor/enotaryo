import { getPushSubscription, upsertPushSubscription } from '$lib/server/db/index.js';
import { error, type RequestHandler } from '@sveltejs/kit';
import { strict } from 'assert';

export const GET: RequestHandler = async ({ locals: { ctx, user } }) => {
    strict(typeof ctx !== 'undefined');
    if (!user) return error(401, 'unidentified user');
    
    const subscription = await getPushSubscription(ctx.db, user.id);

    return new Response(JSON.stringify(subscription));
}

export const POST: RequestHandler = async ({ locals: { ctx, user }, request }) => {
    strict(typeof ctx !== 'undefined');
    if (!user) return error(401, 'unidentified user');

    const subscription = await upsertPushSubscription(ctx.db, user.id, await request.json());

    return new Response(JSON.stringify(subscription));
}