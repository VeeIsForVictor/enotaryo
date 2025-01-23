import { insertSignatory } from '$lib/server/db';
import type { RequestHandler } from '@sveltejs/kit';
import { strict } from 'assert';

export const POST: RequestHandler = async ({ locals: { ctx }, request }) => {
	const { id, name } = await request.json();

	strict(typeof ctx != 'undefined');
	insertSignatory(ctx.db, id, name);

	return new Response();
};
