import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '$env/dynamic/private';
import * as schema from './schema';
import { and, eq } from 'drizzle-orm';
import { strict } from 'assert';
import type { Logger } from 'pino';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
const client = postgres(env.DATABASE_URL);
export const db = drizzle(client, { schema });

export type Database = typeof db;
export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
export type Interface = Database | Transaction;

export async function insertDocument(db: Interface, logger: Logger, title: string, file: string) {
	const routineA31Start = performance.now();
	const [{ documentId }, ...rest] = await db
		.insert(schema.document)
		.values({ title })
		.returning({ documentId: schema.document.id });
	strict(rest.length == 0);
	const routineA31Elapsed = performance.now() - routineA31Start;
	logger.info({ routine: 'a3.1', elapsedTime: routineA31Elapsed }, 'routine a3.1');
	const routineA32Start = performance.now();
	await db.insert(schema.documentFile).values({ documentId, file });
	const routineA32Elapsed = performance.now() - routineA32Start;
	logger.info({ routine: 'a3.2', elapsedTime: routineA32Elapsed }, 'routine a3.2');
	return [{ documentId }, ...rest];
}

export async function getDocuments(db: Interface) {
	return await db
		.select({
			id: schema.document.id,
			title: schema.document.title,
			uploadTime: schema.document.uploadTime
		})
		.from(schema.document);
}

export async function getDocumentById(db: Interface, id: string) {
	return await db
		.select({
			id: schema.document.id,
			title: schema.document.title,
			uploadTime: schema.document.uploadTime,
			file: schema.documentFile.file
		})
		.from(schema.document)
		.leftJoin(schema.documentFile, eq(schema.document.id, schema.documentFile.documentId))
		.where(eq(schema.document.id, id));
}

export async function getDocumentSignatories(db: Interface, documentId: string) {
	return await db
		.select()
		.from(schema.signature)
		.where(eq(schema.signature.documentId, documentId));
}

export async function insertSignatory(db: Interface, id: string) {
	return await db.insert(schema.signatory).values({ id });
}

export async function insertSignature(db: Interface, sigId: string, docId: string) {
	return await db
		.insert(schema.signature)
		.values({ signatoryId: sigId, documentId: docId })
		.returning({ id: schema.signature.id });
}

export async function verifySignature(db: Interface, sessionId: string) {
	return await db
		.update(schema.signature)
		.set({ status: 'approved' })
		.where(and(eq(schema.signature.id, sessionId)))
		.returning({ sessionId: schema.signature.id });
}

export async function denySignature(db: Interface, sessionId: string) {
	return await db
		.update(schema.signature)
		.set({ status: 'denied' })
		.where(and(eq(schema.signature.id, sessionId)))
		.returning({ sessionId: schema.signature.id });
}

export async function getSignatoryIdFromSignature(db: Interface, signatureId: string) {
	return await db
		.select({ signatoryId: schema.signature.signatoryId })
		.from(schema.signature)
		.where(eq(schema.signature.id, signatureId));
}

export async function getDocumentSignatory(db: Interface, sessionId: string) {
	return await db
		.select({ identifier: schema.signature.id })
		.from(schema.signature)
		.where(eq(schema.signature.id, sessionId));
}

export async function getSignatureStatus(db: Interface, sessionId: string) {
	return await db
		.select({
			id: schema.signature.id,
			txnId: schema.otpTransaction.id,
			status: schema.signature.status
		})
		.from(schema.signature)
		.where(eq(schema.signature.id, sessionId))
		.leftJoin(schema.otpTransaction, eq(schema.otpTransaction.signatureId, sessionId));
}

export async function getOtpTransactions(db: Interface, sigId: string) {
	return await db
		.select({
			id: schema.otpTransaction.id,
			status: schema.signature.status,
			sessionId: schema.otpTransaction.signatureId,
			documentTitle: schema.document.title
		})
		.from(schema.signature)
		.where(eq(schema.signature.signatoryId, sigId))
		.rightJoin(schema.otpTransaction, eq(schema.signature.id, schema.otpTransaction.signatureId))
		.innerJoin(schema.document, eq(schema.signature.documentId, schema.document.id));
}

export async function getOtpTransaction(db: Interface, transactionId: string) {
	const [{ isCompleted, signatureId }, ...rest] = await db
		.select({
			isCompleted: schema.otpTransaction.isCompleted,
			signatureId: schema.otpTransaction.signatureId
		})
		.from(schema.otpTransaction)
		.where(eq(schema.otpTransaction.id, Number(transactionId)));
	strict(rest.length == 0);
	return { isCompleted, signatureId };
}

export async function insertOtpTransaction(db: Interface, txnId: number, signatureId: string) {
	return await db
		.insert(schema.otpTransaction)
		.values({ id: txnId, signatureId: signatureId })
		.returning({ id: schema.otpTransaction.id });
}

export async function completeOtpTransaction(db: Interface, txnId: number) {
	return await db
		.update(schema.otpTransaction)
		.set({ isCompleted: true })
		.where(eq(schema.otpTransaction.id, txnId))
		.returning({ sessionId: schema.otpTransaction.signatureId });
}

export async function deleteOtpTransaction(db: Interface, txnId: number) {
	return await db
		.delete(schema.otpTransaction)
		.where(eq(schema.otpTransaction.id, txnId))
		.returning({ sessionId: schema.otpTransaction.signatureId });
}

export async function deleteOtpTransactionsForSignature(db: Interface, signatureId: string) {
	return await db
		.delete(schema.otpTransaction)
		.where(eq(schema.otpTransaction.signatureId, signatureId))
		.returning({ sessionId: schema.otpTransaction.signatureId });
}

export async function getUserBySignatory(db: Interface, sigId: string) {
	return await db.select().from(schema.user).where(eq(schema.user.signatoryId, sigId));
}

export async function insertUser(
	db: Interface,
	userId: string,
	sigId: string,
	passwordHash: string
) {
	return await db.insert(schema.user).values({ id: userId, signatoryId: sigId, passwordHash });
}

export async function upsertPushSubscription(
	db: Interface,
	userId: string,
	pushSubscription: PushSubscriptionJSON
) {
	return await db
		.insert(schema.pushSubscriptions)
		.values({ userId, pushSubscription })
		.returning({ pushSubscription: schema.pushSubscriptions.pushSubscription })
		.onConflictDoUpdate({
			target: schema.pushSubscriptions.userId,
			set: { pushSubscription }
		});
}

export async function getPushSubscriptionByUserId(db: Interface, userId: string) {
	return await db
		.select({ pushSubscription: schema.pushSubscriptions.pushSubscription })
		.from(schema.pushSubscriptions)
		.where(eq(schema.pushSubscriptions.userId, userId));
}

export async function getPushSubscriptionBySignatoryId(db: Interface, sigId: string) {
	return await db
		.select({ pushSubscription: schema.pushSubscriptions.pushSubscription })
		.from(schema.user)
		.where(eq(schema.user.signatoryId, sigId))
		.leftJoin(schema.pushSubscriptions, eq(schema.user.id, schema.pushSubscriptions.userId));
}

export async function deletePushSubscriptionByUserId(db: Interface, userId: string) {
	return await db
		.delete(schema.pushSubscriptions)
		.where(eq(schema.pushSubscriptions.userId, userId))
		.returning({ pushSubscription: schema.pushSubscriptions.pushSubscription });
}
