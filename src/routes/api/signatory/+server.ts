import { NewSignatory } from '$lib/models/signatory';
import { insertSignatory } from '$lib/server/db';
import { error, type RequestHandler } from '@sveltejs/kit';
import { strict } from 'assert';
import { safeParse } from 'valibot';

export const POST: RequestHandler = async ({ locals: { ctx }, request }) => {
	const requestJson = await request.json();
	const newSignatoryResult = safeParse(NewSignatory, requestJson);

	strict(typeof ctx != 'undefined');

	if (!newSignatoryResult.success) {
		ctx.logger.error({ requestJson }, 'malformed new signatory request');
		return error(400, { message: 'malformed new signatory request' });
	}

	const { id } = newSignatoryResult.output as NewSignatory;

	ctx.logger.info({ id });

	const start = performance.now();
	insertSignatory(ctx.db, id);
	const signatoryInsertTime = performance.now() - start;

	ctx.logger.info({ signatoryInsertTime });

	return new Response();
};
