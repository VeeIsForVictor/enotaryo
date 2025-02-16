import { insertDocument } from '$lib/server/db';
import type { RequestHandler } from '@sveltejs/kit';
import { strict } from 'assert';

export const POST: RequestHandler = async ({ locals: { ctx }, request }) => {
	const { title } = await request.json();
	console.log(title);

	strict(typeof ctx != 'undefined');

	ctx.logger.info({ title });

	const start = performance.now();
	insertDocument(ctx.db, title);
	const documentHandlingTime = performance.now() - start;

	ctx.logger.info({ documentHandlingTime });

	return new Response();
};
