import { insertSignatory } from '$lib/server/db';
import type { RequestHandler } from '@sveltejs/kit';
import { strict } from 'assert';

export const POST: RequestHandler = async ({ locals: { ctx }, request }) => {
	const { id } = await request.json();

	strict(typeof ctx != 'undefined');

	ctx.logger.info({ id });

	const start = performance.now();
	insertSignatory(ctx.db, id);
	const signatoryInsertTime = performance.now() - start;

	ctx.logger.info({ signatoryInsertTime });

	return new Response();
};
