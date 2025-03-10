import { NewDocument } from '$lib/models/document';
import {
	getDocuments,
	getDocumentSignatories,
	getDocumentSignatoriesCount,
	getDocumentSignaturesCount
} from '$lib/server/db';
import { insertDocument } from '$lib/server/db';
import { error, type RequestHandler } from '@sveltejs/kit';
import { strict } from 'assert';
import { safeParse } from 'valibot';

export const GET: RequestHandler = async ({ locals: { ctx, user } }) => {
	strict(typeof ctx != 'undefined');
	const { db, logger } = ctx;

	if (!user) {
		error(401, 'unidentified user');
	}
	const start = performance.now();
	const results = await getDocuments(db);
	const docGetTime = performance.now() - start;

	logger.info({ docGetTime }, 'retrieved all documents');

	const documents = [];

	for (const { id, title } of results) {
		const [{ signatoryCount }, ...rest] = await getDocumentSignatoriesCount(db, id);
		strict(rest.length == 0);

		const [{ signatureCount }, ...others] = await getDocumentSignaturesCount(db, id);
		strict(others.length == 0);

		const signatories = await getDocumentSignatories(db, id);

		documents.push({ id, title, signatoryCount, signatureCount, signatories });
	}

	return new Response(JSON.stringify({ documents }));
};

export const POST: RequestHandler = async ({ locals: { ctx }, request }) => {
	const requestJson = await request.json();
	const newDocumentResult = safeParse(NewDocument, requestJson);

	strict(typeof ctx != 'undefined');

	if (!newDocumentResult.success) {
		ctx.logger.error({ requestJson }, 'malformed new document request');
		return error(400, { message: 'malformed new document request' });
	}

	const { title, file } = newDocumentResult.output as NewDocument;

	ctx.logger.info({ title }, 'new document request received');

	const start = performance.now();
	const [{ documentId }, ...rest] = await insertDocument(ctx.db, title, file);

	strict(rest.length == 0);

	const documentHandlingTime = performance.now() - start;

	ctx.logger.info({ documentHandlingTime });

	return new Response(JSON.stringify({ documentId }));
};
