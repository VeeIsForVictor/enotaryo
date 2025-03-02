import { fail, type Actions } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';
import { strict } from 'assert';
import { safeParse } from 'valibot';
import { SignatoryQr } from '$lib/models/signatory';
import type { Logger } from 'pino';

async function handleSignature(logger: Logger, signatoryId: string, documentId: string) {
	const body = { signatoryId, documentId }

	const response = await fetch('/api/signature', {
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	});

	if (!response.ok) {
		const error = await response.json();
		logger.error({ error }, 'form action failed');
		return fail(500, error);
	}

	const signatureId = await response.text();
}

export const actions: Actions = {
	default: async ({ request, fetch, locals: { ctx } }) => {
		strict(typeof ctx !== 'undefined');

		interface Data {
			title: string;
			file: string;
		}

		const formData = await request.formData();

		const file = formData.get('file') as File;
		const url = URL.createObjectURL(file);
		const res = await fetch(url);
		const blobFile = await res.blob();
		
		const blobBytes = await blobFile.text();
		const blobData = await JSON.stringify(blobBytes);

		const data: Data = { title: formData.get('title') as string, file: blobData as string }

		const documentResponse = await fetch('/api/document', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});

		const { documentId } = await documentResponse.json();

		ctx.logger.info({ documentId }, 'new document POST-ed');

		ctx.logger.info('retrieving signatures by call')

		// retrieve signatures
		const response = await fetch(`${env.PUBLIC_QR_API}/document/`, {
			method: 'post',
			body: formData
		});

		let signatures: string[] | object[] = await response.json()

		signatures = signatures.map((str) => JSON.stringify(str))

		ctx.logger.info({ signatures }, 'signatures retrieved from document');

		// store signatures
		for (const signature of signatures) {
			const qrParseResult = safeParse(SignatoryQr, signature);

			if (!qrParseResult.success) {
				ctx.logger.error({ qrParseResult }, 'failed to coerce signatures to recognized qr model');
				return fail(500);
			}

			const qrSignature = qrParseResult.output;

			handleSignature(ctx.logger, qrSignature.uin, documentId);
		}

		// issue signature verification

		return { success: true };
	}
};
