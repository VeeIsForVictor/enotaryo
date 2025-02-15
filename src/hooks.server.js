import { building } from '$app/environment';
import * as auth from '$lib/server/auth';
import pino from 'pino';

const logger = pino({
	transport: {
		target: 'pino-pretty',
		options: {
			colorize: true
		}
	}
});

export async function handle({ event, resolve }) {
	if (building) return await resolve(event);

	const [{ db }] = await Promise.all([import('$lib/server/db')]);

	event.locals.ctx = {
		db,
		logger: logger.child({
			clientAddress: event.getClientAddress(),
			method: event.request.method,
			url: event.url
		})
	};

	const sessionToken = event.cookies.get(auth.sessionCookieName);

	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await auth.validateSessionToken(db, sessionToken);
	if (session) {
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} else {
		auth.deleteSessionTokenCookie(event);
	}

	event.locals.user = user;
	event.locals.session = session;

	const start = performance.now();
	const response = resolve(event);
	const requestHandleTime = performance.now() - start;

	event.locals.ctx.logger.info({ requestHandleTime });

	return response;
}
