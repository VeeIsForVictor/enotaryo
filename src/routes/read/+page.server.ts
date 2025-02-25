import { fail, type Actions } from '@sveltejs/kit';
import { strict } from 'assert';
import { sendOtpNotification } from '$lib/server/notifications';
import type { WebPushError } from 'web-push';


export const actions: Actions = {
	default: async ({ request, fetch, locals: { ctx } }) => {
		const formData = await request.formData();
		const signatoryId = formData.get('signatoryId');

		strict(typeof ctx !== 'undefined');
		const { logger } = ctx;

		strict(signatoryId != null);

		const readData = { signatoryId };
		const body = JSON.stringify(readData);

		const response = await fetch('/api/signature', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body
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
			sendOtpNotification(ctx.db, txnId, id as string).then(
				(statusCode) => {
					logger.info({ statusCode }, 'a notification was dispatched with status code')
				}
			).catch(
				(reason: WebPushError) => {
					logger.error({ reason }, `an error occurred while dispatching the notification for ${txnId}`)

					if (reason.statusCode == 410) {
						logger.info('status code is 410, deleting stored push subscription');

						fetch('/api/push', { method: 'DELETE' });
					}
				}
			);
		}

		return { txnId };
	}
};
