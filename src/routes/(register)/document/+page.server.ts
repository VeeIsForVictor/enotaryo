import type { Actions } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';
import { strict } from 'assert';

export const actions: Actions = {
	default: async ({ request, fetch, locals: { ctx } }) => {
		strict(typeof ctx !== 'undefined');

		interface Data {
			title: string;
			file: string;
		}

		const formData = await request.formData();

		const file = formData.get('file') as File;
		const url = URL.createObjectURL(file);
		const res = await fetch(url);
		const blobFile = await res.blob();
		
		const blobBytes = await blobFile.text();
		const blobData = await JSON.stringify(blobBytes);

		const data: Data = { title: formData.get('title') as string, file: blobData as string }

		const documentId = await fetch('/api/document', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});

		ctx.logger.info({ documentId }, 'new document POST-ed')

		// retrieve signatures
		const response = await fetch(`${env.PUBLIC_QR_API}/document/`, {
			method: 'post',
			body: formData
		});

		let signatures: string[] | object[] = await response.json()

		signatures = signatures.map((str) => JSON.stringify(str))

		ctx.logger.info({ signatures }, 'signatures retrieved from document');

		// store signatures

		// issue signature verification

		return { success: true };
	}
};
