import { env } from '$env/dynamic/public';
import { SignatureId } from '$lib/models/signature';
import {
	completeOtpTransaction,
	deleteOtpTransaction,
	getOtpTransaction,
	getOtpTransactions,
	getSignatoryIdFromSignature,
	getSignatureStatus,
	insertOtpTransaction,
	verifySignature
} from '$lib/server/db';
import { error, type RequestHandler } from '@sveltejs/kit';
import { strict } from 'assert';
import { safeParse } from 'valibot';

// Get all OTP transactions for a user
export const GET: RequestHandler = async ({ locals }) => {
	strict(typeof locals.ctx != 'undefined');
	const { db, logger } = locals.ctx;

	if (!locals.user) {
		error(401, 'unidentified user');
	}
	const start = performance.now();
	const results = await getOtpTransactions(db, locals.user.signatoryId);
	const otpGetTime = performance.now() - start;

	logger.info({ results, otpGetTime }, 'retrieved otp transactions');

	return new Response(JSON.stringify({ results }));
};

// Create a new OTP transaction
export const POST: RequestHandler = async ({ locals: { ctx }, request }) => {
	strict(typeof ctx != 'undefined');
	const { db, logger } = ctx;

	const requestJson = await request.json();
	const signatureIdResult = safeParse(SignatureId, requestJson);

	if (!signatureIdResult.success) {
		logger.error({ requestJson }, 'malformed transaction request');
		return error(400, { message: 'malformed transaction request' });
	}

	const { id: signatureId } = signatureIdResult.output as SignatureId;

	strict(signatureId != null && typeof signatureId == 'string');

	logger.info({ sessionId: signatureId }, 'session status check attempt');

	try {
		const start = performance.now();

		// check session status
		const [sessionStatus, ...rest] = await getSignatureStatus(db, signatureId);
		strict(rest.length == 0);

		// 	does it actually exist?
		strict(sessionStatus);
		strict(sessionStatus.id);

		// 	is it already verified?
		if (sessionStatus.status == 'approved' || sessionStatus.txnId) {
			logger.warn({ sessionStatus }, 'session transaction already issued');
			return new Response(
				JSON.stringify({
					txnId: sessionStatus.txnId,
					isVerified: sessionStatus.status == 'approved'
				})
			);
		}

		const statusCheckTime = performance.now() - start;
		logger.info({ statusCheckTime });
	} catch (error1) {
		logger.error({ error1 }, 'an error occurred while trying to check session status');
		return error(500, 'an internal error occurred');
	}

	logger.info({ sessionId: signatureId }, 'session transaction creation attempt');

	try {
		const start = performance.now();

		// issue the transaction
		// TODO: stub issuing the otp transaction
		const [{ signatoryId }, ...rest] = await getSignatoryIdFromSignature(db, signatureId);
		strict(rest.length == 0);

		const routineA8Start = performance.now();
		const otpResponse = await fetch(`${env.PUBLIC_MOSIP_API}/otp/`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ uin: signatoryId })
		});

		const responseBody = await otpResponse.json();
		const routineA8Elapsed = performance.now() - routineA8Start;
		logger.info({ routine: 'a8', elapsedTime: routineA8Elapsed }, 'routine a8');

		const { txn_id: transactionId } = responseBody;

		const routineA9Start = performance.now();
		// 	save the transaction id to the database
		await insertOtpTransaction(db, transactionId, signatureId);
		const otpInsertTime = performance.now() - start;
		const routineA9Elapsed = performance.now() - routineA9Start;
		logger.info({ routine: 'a9', elapsedTime: routineA9Elapsed }, 'routine a9');

		logger.info({ otpInsertTime }, 'successful transaction insertion');

		// return the txn id
		return new Response(
			JSON.stringify({
				txnId: transactionId,
				isVerified: false
			})
		);
	} catch (error2) {
		logger.error({ error2 }, 'an error occurred while trying to issue the transaction');
		return error(500, 'an internal error occurred');
	}
};

// Update the OTP transaction by verifying a candidate OTP code
export const PATCH: RequestHandler = async ({ locals: { ctx }, request }) => {
	strict(typeof ctx != 'undefined');
	const { db, logger } = ctx;

	const { txnId, otp } = await request.json();

	const start = performance.now();

	const routineB3Start = performance.now();

	// TODO: validate OTP via a MOSIP SDK call
	const { isCompleted, signatureId } = await getOtpTransaction(db, txnId);
	strict(signatureId !== null);

	const routineB3Elapsed = performance.now() - routineB3Start;
	logger.info({ routine: 'b3', elapsedTime: routineB3Elapsed }, 'routine b3');

	const [{ signatoryId }, ...others] = await getSignatoryIdFromSignature(db, signatureId);
	strict(others.length == 0);

	if (isCompleted) {
		return new Response(
			JSON.stringify({
				txnId,
				isCorrect: true
			})
		);
	}

	const body = JSON.stringify({
		uin: signatoryId,
		txn_id: txnId,
		otp_value: otp
	});

	const routineB4Start = performance.now();

	const otpResponse = await fetch(`${env.PUBLIC_MOSIP_API}/otp/`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body
	});

	const routineB4Elapsed = performance.now() - routineB4Start;
	logger.info({ routine: 'b4', elapsedTime: routineB4Elapsed }, 'routine b4');

	const otpJson = await otpResponse.json();

	const { authStatus } = otpJson;

	logger.info({ otpJson, authStatus }, 'otp verification response');

	if (authStatus) {
		logger.info({ txnId, otp }, 'correct otp, attempting to complete txn');
		db.transaction(async (tx) => {
			const routineB51Start = performance.now();
			const [result, ...rest] = await completeOtpTransaction(tx, Number(txnId));
			strict(rest.length == 0);
			strict(result.sessionId);
			const routineB51Elapsed = performance.now() - routineB51Start;
			logger.info({ routine: 'b5.1', elapsedTime: routineB51Elapsed }, 'routine b5.1');

			const routineB52Start = performance.now();
			const { sessionId } = result;
			const [session, ...others] = await verifySignature(tx, sessionId);
			strict(others.length == 0);
			strict(session);
			const routineB52Elapsed = performance.now() - routineB52Start;
			logger.info({ routine: 'b5.2', elapsedTime: routineB52Elapsed }, 'routine b5.2');

			const otpVerificationTime = performance.now() - start;
			logger.info({ otpVerificationTime }, 'successful transaction verification');
		});

		return new Response(
			JSON.stringify({
				txnId,
				isCorrect: true
			})
		);
	}

	logger.warn({ txnId, otp }, 'incorrect otp, attempting to update txn');

	const otpUpdateTime = performance.now() - start;
	logger.info({ otpUpdateTime }, 'successful transaction update');

	return new Response(
		JSON.stringify({
			txnId,
			isCorrect: false
		})
	);
};

// Delete the OTP transaction if it is true
export const DELETE: RequestHandler = async ({ locals: { ctx }, request }) => {
	strict(typeof ctx != 'undefined');
	const { db, logger } = ctx;

	const { txnId } = await request.json();

	try {
		const start = performance.now();

		const [{ sessionId: signatureId }, ...rest] = await deleteOtpTransaction(db, txnId);
		strict(rest.length == 0);

		const deleteTime = performance.now() - start;

		logger.info({ deleteTime, txnId }, 'successful transaction deletion');
		logger.info({ routine: 'c3', elapsedTime: deleteTime }, 'routine c3');
		return new Response(JSON.stringify({ txnId, signatureId }));
	} catch (e) {
		logger.error({ e }, 'an error occurred while trying to delete the transaction');
		return error(500, 'an internal error occurred');
	}
};
