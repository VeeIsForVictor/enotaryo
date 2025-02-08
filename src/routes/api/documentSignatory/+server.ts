import {
	getDocumentSignatory,
	insertDocumentSignatory,
	verifyDocumentSignatory
} from '$lib/server/db';
import type { RequestHandler } from '@sveltejs/kit';
import { strict } from 'assert';

export const POST: RequestHandler = async ({ locals: { ctx }, request }) => {
	const { sigId, docId } = await request.json();

	strict(typeof ctx != 'undefined');
	const [result, ...rest] = await getDocumentSignatory(ctx?.db, docId, sigId);

	strict(rest.length == 0);

	let identifier, others;

	if (result) {
		({ identifier } = result);
	} else {
		[{ identifier }, ...others] = await insertDocumentSignatory(ctx.db, docId, sigId);
		strict(others.length == 0);
	}

	ctx.logger.info({ sigId, docId });
	await verifyDocumentSignatory(ctx.db, identifier);

	return new Response(identifier);
};
