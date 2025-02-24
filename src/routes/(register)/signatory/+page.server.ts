import { validateIdNumber } from '$lib/models/signatory';
import type { Actions } from '@sveltejs/kit';
import { strict } from 'assert';

export const actions: Actions = {
	default: async ({ request, fetch }) => {
		interface Data {
			id: string;
			name: string;
		}

		const formData = await request.formData();
		const data: Data = { id: formData.get('uid') as string, name: formData.get('name') as string };

		strict(validateIdNumber.test(data.id));

		await fetch('/api/signatory', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});

		return { success: true };
	}
};
