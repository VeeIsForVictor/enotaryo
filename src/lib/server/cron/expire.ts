import cron from 'node-cron';
import {
    deleteOtpTransactionsForSignature,
	denySignature,
	getDocuments,
	getDocumentSignatories,
	type Interface
} from '$lib/server/db';
import type { Logger } from 'pino';

export async function setupCronExpire(db: Interface, logger: Logger) {
	cron.schedule('0 0 * * *', async () => {
		logger.warn('cron job to check for expired documents running');
		for (const document of await getDocuments(db)) {
			const { id, title } = document;
			logger.info({ id, title }, 'checking document if expired');
			if (document.uploadTime < new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)) {
				logger.warn({ id, title }, 'document expired');
				for (const signatory of await getDocumentSignatories(db, id)) {
					logger.warn({ signatory, id }, 'denying signature for expired document');
					denySignature(db, signatory.id);
                    deleteOtpTransactionsForSignature(db, signatory.id);
				}
			}
		}
	});
}
