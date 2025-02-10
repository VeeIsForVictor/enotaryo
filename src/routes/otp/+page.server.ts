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
    default: async ({ locals, fetch, request }) => {
        strict(typeof locals.ctx != 'undefined');
        const { logger } = locals.ctx;

        const formData = await request.formData();
        const txnId = formData.get('id');
        const otp = formData.get('otp');

        const body = {
            txnId,
            otp
        }

        logger.info({ body }, 'transaction patch attempt')

        const response = await fetch('/api/otpTransaction', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
			const error = await response.json();
			logger.error({ error }, 'form action failed')
			return fail(500, error);
		}

		return await response.json();
    }
}