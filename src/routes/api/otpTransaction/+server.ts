import type { RequestHandler } from '@sveltejs/kit';

// Get all OTP transactions for a user
export const GET: RequestHandler = async ({ locals: { ctx }, request }) => {
	return new Response();
};

// Create a new OTP transaction
export const POST: RequestHandler = async ({ locals: { ctx: { db, logger } }, request }) => {
	
	// check session status
	// 	does it actually exist?
	// 	is it already being verified?
	// 	is it already verified?

	// issue the transaction
	// 	save the transaction id to the database
	
	return new Response();
};

// Update the OTP transaction by verifying a candidate OTP code
export const PATCH: RequestHandler = async ({ locals: { ctx }, request }) => {
	return new Response();
};

// Delete the OTP transaction if it is true
