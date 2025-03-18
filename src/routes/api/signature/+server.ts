import { error, type RequestHandler } from '@sveltejs/kit';
import { strict } from 'assert';
import { insertSignature } from '$lib/server/db';
import { NewSignature } from '$lib/models/signature';
import { safeParse } from 'valibot';
import { getUserSignatures } from '$lib/server/db';

export const GET: RequestHandler = async ({ locals: { ctx, user } }) => {
	strict(typeof ctx != 'undefined');

	if (!user) {
		return error(401, 'unidentified user');
	}

	const start = performance.now();
	const results = await getUserSignatures(ctx.db, user.signatoryId);
	const signaturesGetTime = performance.now() - start;

	ctx.logger.info({ results, signaturesGetTime }, 'retrieved signatures for user');

	return new Response(JSON.stringify({ results }));
}

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
