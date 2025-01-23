export const actions = {
	default: async ({ request, fetch }) => {
		const formData = await request.formData();
		const qrData = { sigId: formData.get('uid'), docId: formData.get('doc_id') };

		const response = await fetch('/api/documentSignatory', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(qrData)
		});

		return { qrData: JSON.stringify(await response.text()) };
	}
};
