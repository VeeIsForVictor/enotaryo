import { fail } from '@sveltejs/kit';
import { strict } from 'assert';

export async function load({ locals, fetch }) {
	strict(typeof locals.ctx != 'undefined');
	const { logger } = locals.ctx;

	const response = await fetch('/api/document', {
		method: 'get',
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (!response.ok) {
		const error = await response.json();
		logger.error({ error }, 'document retrieval');
		return fail(500, error);
	}

	return await response.json();
}
