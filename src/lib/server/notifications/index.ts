import { sendNotification } from '$lib/webpush';
import type { Logger } from 'pino';
import { getPushSubscriptionBySignatoryId, type Interface } from '../db';
import { strict, strictEqual } from 'assert';

export async function sendOtpNotification(
	db: Interface,
	logger: Logger,
	transactionId: string,
	signatoryId: string
): Promise<string> {
	const [{ pushSubscription }, ...rest] = await getPushSubscriptionBySignatoryId(db, signatoryId);

	// try to send the push notification
	try {
		strict(pushSubscription);
		strictEqual(rest.length, 0);

		const sendResult = sendNotification(
			pushSubscription,
			'New Document for Verification',
			`A transaction with ID ${transactionId} has been filed for your verification.`
		);

		logger.info({ sendResult }, 'push notification dispatched');

		return transactionId;
	} catch (e) {
		logger.error({ e }, 'an error occurred while dispatching a push notification');

		throw new Error(`an error occurred while sending a notification for ${transactionId}`);
	}
}
