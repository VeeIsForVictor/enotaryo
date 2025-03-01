import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request, fetch }) => {
		interface Data {
			title: string;
			blob: Blob;
		}

		const formData = await request.formData();

		const file = formData.get('file') as File;
		const url = URL.createObjectURL(file);
		const res = await fetch(url);
		const blobFile = await res.blob();

		const data: Data = { title: formData.get('') as string, blob: blobFile };

		await fetch('/api/document', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});

		return { success: true };
	}
};
