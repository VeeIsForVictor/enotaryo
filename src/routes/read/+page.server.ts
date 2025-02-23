import { fail } from '@sveltejs/kit';
import { strict } from 'assert';
import { sendOtpNotification } from '$lib/server/notifications';

export const actions = {
	default: async ({ request, fetch, locals: { ctx } }) => {
		const formData = await request.formData();
		const signatoryId = formData.get('signatoryId');

		strict(typeof ctx !== 'undefined');
		const { logger } = ctx;

		strict(signatoryId != null);

		const readData = { sigId: signatoryId };
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

		const otpBody = JSON.stringify({ signatureId });

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
			sendOtpNotification(ctx.db, ctx.logger, txnId, id as string);
		}

		return { txnId };
	}
};
