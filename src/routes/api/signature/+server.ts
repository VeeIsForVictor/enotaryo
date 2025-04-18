import { error, type RequestHandler } from '@sveltejs/kit';
import { strict } from 'assert';
import { denySignature, insertSignature } from '$lib/server/db';
import { NewSignature, SignatureId } from '$lib/models/signature';
import { safeParse } from 'valibot';

export const POST: RequestHandler = async ({ locals: { ctx }, request }) => {
	const routineA6Start = performance.now();
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
		const routineA6Elapsed = performance.now() - routineA6Start;
		ctx.logger.info({ routine: 'a6', elapsedTime: routineA6Elapsed }, 'routine a6');

		return new Response(id);
	} catch (e) {
		ctx.logger.error({ e });
		return error(500, 'an internal server error occurred');
	}
};

// Update a signature to status = 'denied'
export const PATCH: RequestHandler = async ({ locals: { ctx }, request }) => {
	const requestJson = await request.json();
	const signatureIdResult = safeParse(SignatureId, requestJson);

	strict(typeof ctx != 'undefined');
	const { logger, db } = ctx;

	if (!signatureIdResult.success) {
		logger.error({ requestJson }, 'malformed signature denial request');
		return error(400, { message: 'malformed signature denial request' });
	}

	try {
		const { id: sessionId } = signatureIdResult.output as SignatureId;

		logger.info({ sessionId }, 'signature denial attempt');

		const start = performance.now();
		const [{ sessionId: id }, ...rest] = await denySignature(db, sessionId);
		const signatureDenialTime = performance.now() - start;

		logger.info({ routine: 'c5', elapsedTime: signatureDenialTime }, 'routine c5');

		strict(rest.length == 0);

		return new Response(id);
	} catch (e) {
		logger.error({ e });
		return error(500, 'an internal server error occurred');
	}
};
