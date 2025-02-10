import { getSessionStatus } from '$lib/server/db';
import { error, type RequestHandler } from '@sveltejs/kit';
import { strict } from 'assert';

// Get all OTP transactions for a user
export const GET: RequestHandler = async ({ locals: { ctx }, request }) => {
	return new Response();
};

// Create a new OTP transaction
export const POST: RequestHandler = async ({ locals: { ctx }, request }) => {
	
	strict(typeof ctx != 'undefined');
	const { db, logger } = ctx;

	const { sessionId } = await request.json();
	strict(sessionId != null && typeof sessionId == 'string');

	try {
		// check session status
		const [sessionStatus, ...rest] = await getSessionStatus(db, sessionId);
		strict(rest.length == 0);

		// 	does it actually exist?
		strict(sessionStatus);
		strict(sessionStatus.id);
		
		// 	is it already verified?
		if (sessionStatus.isVerified || sessionStatus.txnId) {
			return new Response(JSON.stringify({
				txnId: sessionStatus.txnId,
				isVerified: sessionStatus.isVerified
			}));
		}
	}
	catch (e) {
		logger.error({ e });
		return error(500, 'an internal error occurred');
	}

	// issue the transaction
	// 	save the transaction id to the database
	// return the txn id
	
	return new Response(JSON.stringify({ transactionId }));
};

// Update the OTP transaction by verifying a candidate OTP code
export const PATCH: RequestHandler = async ({ locals: { ctx }, request }) => {
	return new Response();
};

// Delete the OTP transaction if it is true
