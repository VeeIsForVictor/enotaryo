import { NewDocument } from '$lib/models/document';
import {
	getDocumentById,
	getDocuments,
	getDocumentSignatories,
	getDocumentSignatoriesCount,
	getDocumentSignaturesCount
} from '$lib/server/db';
import { insertDocument } from '$lib/server/db';
import { error, type RequestHandler } from '@sveltejs/kit';
import { strict } from 'assert';
import { safeParse } from 'valibot';

export const GET: RequestHandler = async ({ locals: { ctx }, request }) => {
	strict(typeof ctx != 'undefined');
	const { db, logger } = ctx;
	
	const idQueryParameter = new URL(request.url).searchParams.get('id');
	if (idQueryParameter != null) {
		logger.info({ requestQueryParams: idQueryParameter }, 'document GET request with id query received');

		try {
			const document = await getDocumentById(db, idQueryParameter);
			return new Response(JSON.stringify({ document }));
		}
		catch (errorObj) {
			logger.error({ errorObj, idQueryParameter }, 'error occurred while trying to fetch single document with id');
			return error(404, `error occurred while trying to fetch single document with id ${idQueryParameter}`);
		}
	}
	
	const start = performance.now();
	logger.info('attempting to retrieve all documents')

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
