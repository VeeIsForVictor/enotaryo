import { hash, verify } from '@node-rs/argon2';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { fail, redirect } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';
import { strict } from 'assert';
import { getUserBySignatory, insertUser } from '$lib/server/db';
import { validateIdNumber } from '$lib/models/signatory';

export const load: PageServerLoad = async () => {
	return {};
};

export const actions: Actions = {
	login: async (event) => {
		const formData = await event.request.formData();
		const signatoryId = formData.get('id');
		const password = formData.get('password');

		strict(event.locals.ctx);
		const { db, logger } = event.locals.ctx;

		logger.info({ signatoryId }, 'login attempt');

		if (!validateId(signatoryId)) {
			return fail(400, {
				message: 'Invalid signatory id (please refer to the prescribed ID format)'
			});
		}
		if (!validatePassword(password)) {
			return fail(400, { message: 'Invalid password (min 6, max 255 characters)' });
		}

		const results = await getUserBySignatory(db, signatoryId);

		const existingUser = results.at(0);
		if (!existingUser) {
			return fail(400, { message: 'Incorrect signatory id or password' });
		}

		logger.info({ signatoryId }, 'validation attempt');

		const validPassword = await verify(existingUser.passwordHash, password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});
		if (!validPassword) {
			return fail(400, { message: 'Incorrect signatory id or password' });
		}

		logger.info({ signatoryId }, 'session generation attempt');
		const sessionToken = auth.generateSessionToken();

		strict(typeof event.locals.ctx != 'undefined');
		const session = await auth.createSession(event.locals.ctx.db, sessionToken, existingUser.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		return redirect(302, '/');
	},
	register: async (event) => {
		const formData = await event.request.formData();
		const signatoryId = formData.get('id');
		const password = formData.get('password');

		strict(event.locals.ctx);
		const { db, logger } = event.locals.ctx;

		logger.info({ signatoryId }, 'registration attempt');

		if (!validateId(signatoryId)) {
			return fail(400, { message: 'Invalid signatory id' });
		}
		if (!validatePassword(password)) {
			return fail(400, { message: 'Invalid password' });
		}

		logger.info({ signatoryId }, 'id validation attempt');
		// TODO: validate if a signatory ID exists
		// issue an OTP flow to accept the signatory as a user

		const userId = generateUserId();
		const passwordHash = await hash(password, {
			// recommended minimum parameters
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		try {
			logger.info({ signatoryId }, 'attempting to insert new user');
			await insertUser(db, userId, signatoryId, passwordHash);

			const sessionToken = auth.generateSessionToken();

			strict(typeof event.locals.ctx != 'undefined');
			const session = await auth.createSession(event.locals.ctx.db, sessionToken, userId);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} catch (e) {
			logger.error(e, 'error while attempting to insert user');
			return fail(500, { message: 'An error has occurred' });
		}
		return redirect(302, '/');
	},
	logout: async (event) => {
		strict(event.locals.ctx);
		const { db } = event.locals.ctx;

		if (!event.locals.session) {
			return fail(401);
		}
		await auth.invalidateSession(db, event.locals.session.id);
		auth.deleteSessionTokenCookie(event);

		return redirect(302, '/auth');
	}
};

function generateUserId() {
	// ID with 120 bits of entropy, or about the same as UUID v4.
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	const id = encodeBase32LowerCase(bytes);
	return id;
}

function validateId(id: unknown): id is string {
	return typeof id === 'string' && validateIdNumber.test(id);
}

function validatePassword(password: unknown): password is string {
	return typeof password === 'string' && password.length >= 6 && password.length <= 255;
}
