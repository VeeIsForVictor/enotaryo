import { fail } from '@sveltejs/kit';
import { strict } from 'assert';
import { sendNotification } from '$lib/webpush';
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

		logger.info({ txnId }, 'otp transaction issued')

		// if not error, retrieve push notifier and issue a push notification
		const pushSubscriptionResponse = await fetch('/api/push', {
			method: 'get',
			headers: {
				'Content-Type': 'application/json'
			},
		});

		if (!pushSubscriptionResponse.ok) return await pushSubscriptionResponse.json();

		const pushSubscription = await pushSubscriptionResponse.json();
		strict(pushSubscription);

		// try to send the push notification
		try {
			const sendResult = sendNotification(
				pushSubscription, 
				"New Document for Verification", 
				`A transaction with ID ${txnId} has been filed for your verification.`
			);

			logger.info({ sendResult }, 'push notification dispatched');

			return { txnId };
		}
		catch (e) {
			logger.error({ e }, 'an error occurred while dispatching a push notification');

			return e;
		}
	}
};
