import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '$env/dynamic/private';
import * as schema from './schema';
import { and, eq } from 'drizzle-orm';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
const client = postgres(env.DATABASE_URL);
export const db = drizzle(client, { schema });

export type Database = typeof db;
export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
export type Interface = Database | Transaction;

export async function insertDocument(db: Interface, title: string) {
	return await db.insert(schema.document).values({ title });
}

export async function insertSignatory(db: Interface, id: string) {
	return await db.insert(schema.signatory).values({ id });
}

export async function insertSignatorySession(db: Interface, sigId: string) {
	return await db
		.insert(schema.signatorySession)
		.values({ signatoryId: sigId })
		.returning({ id: schema.signatorySession.id });
}

export async function verifySignatorySession(db: Interface, sessionId: string) {
	return await db
		.update(schema.signatorySession)
		.set({ isVerified: true })
		.where(and(eq(schema.signatorySession.id, sessionId)));
}

export async function getDocumentSignatory(db: Interface, sessionId: string) {
	return await db
		.select({ identifier: schema.signatorySession.id })
		.from(schema.signatorySession)
		.where(eq(schema.signatorySession.id, sessionId));
}

export async function insertOtpTransaction(db: Interface, txnId: number, sessionId: string) {
	return await db
		.insert(schema.otpTransaction)
		.values({ id: txnId, sigSessionId: sessionId })
		.returning({ id: schema.otpTransaction.id });
}

export async function completeOtpTransaction(db: Interface, txnId: number) {
	return await db
		.update(schema.otpTransaction)
		.set({ isCompleted: true })
		.where(and(eq(schema.otpTransaction.id, txnId)));
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
