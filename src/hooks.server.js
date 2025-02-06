import { building } from '$app/environment';
import * as auth from '$lib/server/auth';
import pino from 'pino';

const logger = pino();

export async function handle ({ event, resolve }) {
	if (building) return await resolve(event);
	
	const [{ db }] = await Promise.all([import('$lib/server/db')]);
	
	event.locals.ctx = {
		db,
		logger
	};
	
	const sessionToken = event.cookies.get(auth.sessionCookieName);
	
	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}
	
	const { session, user } = await auth.validateSessionToken(sessionToken);
	if (session) {
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} else {
		auth.deleteSessionTokenCookie(event);
	}
	
	event.locals.user = user;
	event.locals.session = session;
	
	return resolve(event);
};
