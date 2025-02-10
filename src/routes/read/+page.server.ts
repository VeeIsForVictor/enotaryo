import { fail } from '@sveltejs/kit';
import { strict } from 'assert';
export const actions = {
	default: async ({ request, fetch, locals: { ctx } }) => {

		const formData = await request.formData();
		const sessionId = formData.get('sessionId');
		
		strict(typeof ctx !== 'undefined');
		strict(sessionId != null);

		const readData = { sessionId };
		const body = JSON.stringify(readData);
		const response = await fetch('/api/otpTransaction', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body
		});

		if (!response.ok) {
			return fail(500, await response.json());
		}

		return JSON.stringify({ response });
	}
};
