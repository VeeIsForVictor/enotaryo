import { NewDocument } from '$lib/models/document';
import { getDocumentById, getDocuments, getDocumentSignatories } from '$lib/server/db';
import { insertDocument } from '$lib/server/db';
import { error, type RequestHandler } from '@sveltejs/kit';
import { strict } from 'assert';
import { safeParse } from 'valibot';

export const GET: RequestHandler = async ({ locals: { ctx }, request }) => {
	strict(typeof ctx != 'undefined');
	const { db, logger } = ctx;

	const idQueryParameter = new URL(request.url).searchParams.get('id');
	let results: { id: string; title: string | null; file?: string | null }[];
	if (idQueryParameter == null) {
		const start = performance.now();
		logger.info('attempting to retrieve all documents');

		results = await getDocuments(db);
		const docGetTime = performance.now() - start;

		logger.info({ docGetTime }, 'retrieved all documents');
	} else {
		logger.info(
			{ requestQueryParams: idQueryParameter },
			'document GET request with id query received'
		);

		const start = performance.now();

		try {
			results = await getDocumentById(db, idQueryParameter);
			const docGetTime = performance.now() - start;

			logger.info({ docGetTime }, 'retrieved document');
		} catch (errorObj) {
			logger.error(
				{ errorObj, idQueryParameter },
				'error occurred while trying to fetch single document with id'
			);
			return error(
				404,
				`error occurred while trying to fetch single document with id ${idQueryParameter}`
			);
		}
	}

	const documents = [];

	for (const result of results) {
		const { id, title } = result;
		logger.info({ id, title }, 'retrieving auxiliary information for documents');

		const signatories = await getDocumentSignatories(db, id);
		const signatureCount = signatories.filter(({ status }) => status == 'approved').length;
		const signatoryCount = signatories.length;

		if (idQueryParameter != null) {
			const { file } = result;

			documents.push({ id, title, file, signatoryCount, signatureCount, signatories });
		} else {
			documents.push({ id, title, signatoryCount, signatureCount, signatories });
		}
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
