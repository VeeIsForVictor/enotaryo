import cron from 'node-cron';
import {
	deleteOtpTransactionsForSignature,
	denySignature,
	getDocuments,
	getDocumentSignatories,
	type Interface
} from '$lib/server/db';
import type { Logger } from 'pino';

export function setupCronExpire(db: Interface, logger: Logger) {
	cron.schedule('0 0 * * *', async () => {
		logger.warn('cron job to check for expired documents running');

		const docGetStart = performance.now();
		const documents =  await getDocuments(db);
		const docGetTime = performance.now() - docGetStart;

		logger.info({ routine: "d1", elapsedTime: docGetTime }, 'routine d1');

		for (const document of documents) {
			const { id, title } = document;
			logger.info({ id, title }, 'checking document if expired');
			if (document.uploadTime < new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)) {
				logger.warn({ id, title }, 'document expired');

				const sigGetStart = performance.now();
				const signatories = await getDocumentSignatories(db, id);
				const sigGetTime = performance.now() - sigGetStart;

				logger.info({ routine: "d2", elapsedTime: sigGetTime }, 'routine d2')

				for (const signatory of signatories) {
					logger.warn({ signatory, id }, 'denying signature for expired document');

					timedDenySignature(db, logger, signatory.id);

					timedDeleteOtpTransactionsForSignature(db, logger, signatory.id);
				}
			}
		}
	});
}

async function timedDenySignature(db: Interface, logger: Logger, signatoryId: string) {
	const sigDenyStart = performance.now();	
	const deniedSignature = await denySignature(db, signatoryId);
	const sigDenyTime = performance.now() - sigDenyStart;

	logger.info({ routine: "d3", elapsedTime: sigDenyTime }, 'routine d3');
	return deniedSignature;
}

async function timedDeleteOtpTransactionsForSignature(db: Interface, logger: Logger, signatoryId: string) {
	const otpDeleteStart = performance.now();
	const deletedOtpTransaction = await deleteOtpTransactionsForSignature(db, signatoryId);
	const otpDeleteTime = performance.now() - otpDeleteStart;

	logger.info({ routine: "d4", elapsedTime: otpDeleteTime }, 'routine d4');
	return deletedOtpTransaction;
}