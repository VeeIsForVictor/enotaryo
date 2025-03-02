import { error, type RequestHandler } from '@sveltejs/kit';
import { strict } from 'assert';
import { insertSignature } from '$lib/server/db';
import { NewSignature } from '$lib/models/signature';
import { safeParse } from 'valibot';

export const POST: RequestHandler = async ({ locals: { ctx }, request }) => {
	const requestJson = await request.json();
	const newSignatureResult = safeParse(NewSignature, requestJson);

	strict(typeof ctx != 'undefined');

	if (!newSignatureResult.success) {
		ctx.logger.error({ requestJson }, 'malformed new signature request');
		return error(400, { message: 'malformed new signature request' });
	}

	const { signatoryId: sigId, documentId: docId } = newSignatureResult.output as NewSignature;

	ctx.logger.info({ sigId });

	try {
		const start = performance.now();
		const [{ id }, ...others] = await insertSignature(ctx.db, sigId, docId);
		const signatureInsertTime = performance.now() - start;

		ctx.logger.info({ signatureInsertTime });

		ctx.logger.info({ id });

		strict(others.length == 0);

		return new Response(id);
	} catch (e) {
		ctx.logger.error({ e });
		return error(500, 'an internal server error occurred');
	}
};
