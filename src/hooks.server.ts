import { building, dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { apiSanityCheck } from '$lib/env';
import * as auth from '$lib/server/auth';
import { setupCronExpire } from '$lib/server/cron/expire';
import type { Handle } from '@sveltejs/kit';
import pino from 'pino';

if (!env.LOKI_LOGGER) throw new Error('LOKI_LOGGER is not set');
const lokiTarget = env.LOKI_LOGGER;

const transports = pino.transport({
	targets: [
		{
			target: 'pino-pretty',
			options: {
				colorize: true
			}
		},
		{
			target: 'pino-loki',
			options: {
				labels: { application: 'enotaryo', isDev: dev },
				host: lokiTarget
			}
		}
	]
});

const logger = pino(transports);

try {
	await apiSanityCheck();
} catch (e) {
	logger.error(e, 'pre-startup sanity checks failed, exiting');
	process.exit();
}

logger.info('pre-startup steps done successfully, starting system');

logger.info('setting up cron job to check for expired signatures');
const { db } = await import('$lib/server/db');
setupCronExpire(db, logger.child({ cron: 'expire' }));

export const handle: Handle = async ({ event, resolve }) => {
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
};
