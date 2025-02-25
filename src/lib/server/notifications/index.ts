import { sendNotification } from '$lib/webpush';
import { getPushSubscriptionBySignatoryId, type Interface } from '../db';
import { strict, strictEqual } from 'assert';

export async function sendOtpNotification(
	db: Interface,
	transactionId: string,
	signatoryId: string
): Promise<number> {
	const [{ pushSubscription }, ...rest] = await getPushSubscriptionBySignatoryId(db, signatoryId);

	strict(pushSubscription);
	strictEqual(rest.length, 0);

	const sendResult = await sendNotification(
		pushSubscription,
		'New Document for Verification',
		`A transaction with ID ${transactionId} has been filed for your verification.`
	)

	return sendResult.statusCode;
}
