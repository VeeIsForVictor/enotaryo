import { redirect, fail } from '@sveltejs/kit';
import { strict } from 'assert';

export async function load({ locals, fetch }) {
	strict(typeof locals.ctx != 'undefined');
	const { logger } = locals.ctx;

	if (!locals.user) redirect(303, '/');

	const response = await fetch('/api/otpTransaction', {
		method: 'get',
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (!response.ok) {
		const error = await response.json();
		logger.error({ error }, 'form action failed');
		return fail(500, error);
	}

	return await response.json();
}

export const actions = {
	approve: async ({ locals, fetch, request }) => {
		strict(typeof locals.ctx != 'undefined');
		const { logger } = locals.ctx;

		const formData = await request.formData();
		const txnId = formData.get('id');
		const otp = formData.get('otp');

		const body = {
			txnId,
			otp
		};

		logger.info({ body }, 'transaction patch attempt');

		const response = await fetch('/api/otpTransaction', {
			method: 'PATCH',
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

		return await response.json();
	},

	deny: async ({ locals, fetch, request }) => {
		const c1Start = performance.now();

		strict(typeof locals.ctx != 'undefined');
		const { logger } = locals.ctx;

		const formData = await request.formData();
		const txnId = formData.get('id');

		const body = {
			txnId
		};

		logger.info({ body }, 'transaction delete attempt');

		const c2Start = performance.now();
		const response = await fetch('/api/otpTransaction', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		});
		const c2Time = performance.now() - c2Start;
		logger.info({ routine: "c2", elapsedTime: c2Time }, 'routine c2');

		if (!response.ok) {
			const error = await response.json();
			logger.error({ error }, 'form action failed');
			return fail(500, error);
		}

		const result = await response.json();
		logger.info({ result }, 'transaction delete success');

		const signatureResponse = await fetch('/api/signature', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ id: result.signatureId })
		});

		if (!signatureResponse.ok) {
			const error = await signatureResponse.json();
			logger.error({ error }, 'form action failed');
			return fail(500, error);
		}

		const signatureResult = await signatureResponse.text();
		logger.info({ signatureResult }, 'signature update success');

		const c1Time = performance.now() - c1Start;
		logger.info({ routine: "c1", elapsedTime: c1Time }, 'routine c1')

		return signatureResult;
	}
};
