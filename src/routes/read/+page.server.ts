import { strict } from 'assert';
export const actions = {
	default: async ({ request, fetch, locals: { ctx } }) => {

		const formData = await request.formData();
		const sessionId = formData.get('sessionId');
		
		strict(typeof ctx !== 'undefined');
		strict(sessionId != null);

		const readData = { sessionId };
		const body = JSON.stringify(readData);
		const response = await fetch('/otpTransaction', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body
		});

		if (!response.ok) {
			return response.body;
		}

		return {};
	}
};
