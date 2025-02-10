import { getSessionStatus, insertOtpTransaction } from '$lib/server/db';
import { error, type RequestHandler } from '@sveltejs/kit';
import { strict } from 'assert';
import { randomInt } from 'crypto';

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

	logger.info({ sessionId }, 'session status check attempt');

	try {
		// check session status
		const [sessionStatus, ...rest] = await getSessionStatus(db, sessionId);
		strict(rest.length == 0);

		// 	does it actually exist?
		strict(sessionStatus);
		strict(sessionStatus.id);
		
		// 	is it already verified?
		if (sessionStatus.isVerified || sessionStatus.txnId) {
			logger.warn({ sessionStatus }, 'session transaction already issued')
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

	logger.info({ sessionId }, 'session transaction creation attempt');

	try {
		// issue the transaction
		// TODO: stub issuing the otp transaction
		const transactionId = randomInt(123456789);

		// 	save the transaction id to the database
		insertOtpTransaction(db, transactionId, sessionId);

		// return the txn id
		return new Response(JSON.stringify({
			txnId: transactionId,
			isVerified: false,
		}));
	}
	catch (e) {
		logger.error({ e });
		return error(500, 'an internal error occurred');
	}
};

// Update the OTP transaction by verifying a candidate OTP code
export const PATCH: RequestHandler = async ({ locals: { ctx }, request }) => {
	return new Response();
};

// Delete the OTP transaction if it is true
