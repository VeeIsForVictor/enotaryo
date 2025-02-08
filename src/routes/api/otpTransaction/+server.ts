import type { RequestHandler } from "@sveltejs/kit";

// Create a new OTP transaction
export const POST: RequestHandler = async ({ locals: { ctx }, request }) => {
    return new Response();
}

// Update the OTP transaction by verifying a candidate OTP code
export const PATCH: RequestHandler = async ({ locals: { ctx }, request }) => {
    return new Response();
}

// Delete the OTP transaction if it is true