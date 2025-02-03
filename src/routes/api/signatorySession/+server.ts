import type { RequestHandler } from "@sveltejs/kit";
import { strict } from 'assert';
import { insertSignatorySession } from '$lib/server/db';

export const POST: RequestHandler = async ({ locals: { ctx }, request }) => {
	const { id } = await request.json();

	strict(typeof ctx != 'undefined');
	await insertSignatorySession(ctx.db, id);

	return new Response();
};
