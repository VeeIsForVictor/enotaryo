export const actions = {
	default: async ({ request, fetch }) => {
		const formData = await request.formData();
		const data = { title: formData.get('title') };

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
