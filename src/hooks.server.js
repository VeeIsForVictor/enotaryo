import { building } from '$app/environment';

export async function handle({ event, resolve }) {
	if (building) return await resolve(event);

	const [{ db }] = await Promise.all([import('$lib/server/db')]);

	event.locals.ctx = {
		db
	};

	const response = await resolve(event);
	return response;
}
