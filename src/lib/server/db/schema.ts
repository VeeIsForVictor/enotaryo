import { text, uuid, pgSchema, boolean, timestamp, bigint, json } from 'drizzle-orm/pg-core';

export const app = pgSchema('app');

export const document = app.table('document', {
	id: uuid('id').notNull().primaryKey().defaultRandom(),
	title: text('title'),
	uploadTime: timestamp('upload_time', { withTimezone: true, mode: 'date' }).notNull().defaultNow()
});

export const documentFile = app.table('document_file', {
	documentId: uuid('document_id')
		.notNull()
		.references(() => document.id),
	file: text('file').notNull()
});

export const signatory = app.table('signatory', {
	id: text('id').notNull().primaryKey()
});

export const statusEnum = app.enum('status', ['pending', 'approved', 'denied']);

export const signature = app.table('signature', {
	id: uuid('id').notNull().primaryKey().defaultRandom(),
	signatoryId: text('signatory_id')
		.notNull()
		.references(() => signatory.id),
	documentId: uuid('document_id').references(() => document.id),
	status: statusEnum('status_enum').notNull().default('pending')
});

export const otpTransaction = app.table('otp_transaction', {
	id: bigint('id', { mode: 'number' }).notNull().primaryKey(),
	signatureId: uuid('signature_id').references(() => signature.id),
	isCompleted: boolean('is_completed').default(false)
});

export const user = app.table('user', {
	id: text('id').primaryKey(),
	signatoryId: text('signatory_id')
		.notNull()
		.unique()
		.references(() => signatory.id),
	passwordHash: text('password_hash').notNull()
});

export const session = app.table('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const pushSubscriptions = app.table('push_subscription', {
	userId: text('user_id')
		.primaryKey()
		.references(() => user.id),
	pushSubscription: json('push_subscription')
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;
