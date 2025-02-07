import { insertDocument } from '$lib/server/db';
import type { RequestHandler } from '@sveltejs/kit';
import { strict } from 'assert';

export const POST: RequestHandler = async ({ locals: { ctx }, request }) => {
	const { title } = await request.json();
	console.log(title);

	strict(typeof ctx != 'undefined');

	ctx.logger.info({ title });
	insertDocument(ctx.db, title);

	return new Response();
};
