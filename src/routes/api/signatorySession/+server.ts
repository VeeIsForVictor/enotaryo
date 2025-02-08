import type { RequestHandler } from '@sveltejs/kit';
import { strict } from 'assert';
import { insertSignatorySession } from '$lib/server/db';

export const POST: RequestHandler = async ({ locals: { ctx }, request }) => {
	const { sigId } = await request.json();

	strict(typeof ctx != 'undefined');

	ctx.logger.info({ sigId });

	const [{ id }, ...others] = await insertSignatorySession(ctx.db, sigId);

	ctx.logger.info({ id });

	strict(others.length == 0);

	return new Response(id);
};
