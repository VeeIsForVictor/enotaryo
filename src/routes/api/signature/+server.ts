import { error, type RequestHandler } from '@sveltejs/kit';
import { strict } from 'assert';
import { insertSignature } from '$lib/server/db';

export const POST: RequestHandler = async ({ locals: { ctx }, request }) => {
	const { sigId } = await request.json();

	strict(typeof ctx != 'undefined');

	ctx.logger.info({ sigId });

	try {
		const start = performance.now();
		const [{ id }, ...others] = await insertSignature(ctx.db, sigId);
		const signatureInsertTime = performance.now() - start;

		ctx.logger.info({ signatureInsertTime });

		ctx.logger.info({ id });

		strict(others.length == 0);

		return new Response(id);
	} catch (e) {
		ctx.logger.error({ e });
		return error(500, 'an internal server error occurred');
	}
};
