import { fail, type Actions } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';
import { strict } from 'assert';
import { any, array, boolean, object, parse, safeParse } from 'valibot';
import { SignatoryQr } from '$lib/models/signatory';
import type { Logger } from 'pino';
import { sendOtpNotification } from '$lib/server/notifications';
import type { Interface } from '$lib/server/db';
import type { WebPushError } from 'web-push';

const SignatureExtractionResponse = object({
	qrCodeResult: boolean(),
	signatures: array(any())
});

async function handleSignature(
	logger: Logger,
	db: Interface,
	fetch: (input: RequestInfo | URL, init: RequestInit) => Promise<Response>,
	signatoryId: string,
	documentId: string
) {
	const body = { signatoryId, documentId };

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

	const otpBody = JSON.stringify({ id: signatureId });

	const otpResponse = await fetch('/api/otpTransaction', {
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		},
		body: otpBody
	});

	// if error, immediately return error
	if (!otpResponse.ok) return await otpResponse.json();

	const { txnId } = await otpResponse.json();

	logger.info({ txnId }, 'otp transaction issued');

	for (const id of [signatoryId]) {
		sendOtpNotification(db, txnId, id as string)
			.then((statusCode) => {
				logger.info({ statusCode }, 'a notification was dispatched with status code');
			})
			.catch((reason: WebPushError) => {
				logger.error(
					{ reason },
					`an error occurred while dispatching the notification for ${txnId}`
				);

				if (reason.statusCode == 410) {
					logger.info('status code is 410, deleting stored push subscription');

					fetch('/api/push', { method: 'DELETE' });
				}
			});
	}

	return { txnId };
}

export const actions: Actions = {
	default: async ({ request, fetch, locals: { ctx } }) => {
		strict(typeof ctx !== 'undefined');

		interface Data {
			title: string;
			file: string;
		}

		const routineA1Start = performance.now();
		const formData = await request.formData();

		const file = formData.get('file') as File;
		const url = URL.createObjectURL(file);
		const res = await fetch(url);
		const blobFile = await res.blob();

		const blobBytes = Buffer.from(await blobFile.arrayBuffer());
		const blobData = JSON.stringify(blobBytes);

		const data: Data = { title: formData.get('title') as string, file: blobData as string };

		ctx.logger.info({ data }, 'POST-ing new document');

		const routineA2Start = performance.now();
		const documentResponse = await fetch('/api/document', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});
		const routineA2Elapsed = performance.now() - routineA2Start;
		ctx.logger.info({ routine: "a2", elapsedTime: routineA2Elapsed }, 'routine a2');

		const { documentId } = await documentResponse.json();

		ctx.logger.info({ documentId }, 'new document POST-ed');

		ctx.logger.info('retrieving signatures by call');

		const routineA4Start = performance.now();
		// retrieve signatures
		const response = await fetch(`${env.PUBLIC_QR_API}/document/`, {
			method: 'post',
			body: formData
		});
		const routineA4Elapsed = performance.now() - routineA4Start;
		ctx.logger.info({ routine: "a4", elapsedTime: routineA4Elapsed }, 'routine a4');

		const { qrCodeResult, signatures } = parse(SignatureExtractionResponse, await response.json());

		ctx.logger.info({ qrCodeResult, signatures }, 'response received from signature retrieval');

		if (!qrCodeResult) {
			ctx.logger.warn({ qrCodeResult, signatures }, 'no qr codes found, exiting');
			return { success: true };
		}

		ctx.logger.info({ signatures }, 'signatures retrieved from document');

		// store signatures
		for (const signature of signatures) {
			const qrParseResult = safeParse(SignatoryQr, signature);

			if (!qrParseResult.success) {
				ctx.logger.error({ qrParseResult }, 'failed to coerce signatures to recognized qr model');
				return fail(500);
			}

			const qrSignature = qrParseResult.output;

			handleSignature(ctx.logger, ctx.db, fetch, qrSignature.uin, documentId);
		}
		const routineA1Elapsed = performance.now() - routineA1Start;
		ctx.logger.info({ routine: "a1", elapsedTime: routineA1Elapsed }, 'routine a1');

		// issue signature verification

		return { success: true };
	}
};
