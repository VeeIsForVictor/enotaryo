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

	ctx.logger.info({ id }, 'attempting to insert signatory with id');

	const start = performance.now();

	try {
		await insertSignatory(ctx.db, id);
	} catch (e) {
		ctx.logger.error({ e }, 'error occurred while trying to insert signatory');

		return error(500, { message: 'signatory insertion failed due to server-side error' });
	}

	const signatoryInsertTime = performance.now() - start;

	ctx.logger.info({ signatoryInsertTime }, 'new signatory inserted');

	return new Response();
};
