import { insertSignatory } from '$lib/server/db';
import type { RequestHandler } from '@sveltejs/kit';
import { strict } from 'assert';

export const POST: RequestHandler = async ({ locals: { ctx }, request }) => {
	const { id } = await request.json();

	strict(typeof ctx != 'undefined');

	ctx.logger.info({ id })

	insertSignatory(ctx.db, id);

	return new Response();
};
