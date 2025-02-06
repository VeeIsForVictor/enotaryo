import {
	unique,
	text,
	uuid,
	pgSchema,
	boolean,
	char,
	pgTable,
	timestamp
} from 'drizzle-orm/pg-core';

export const app = pgSchema('app');

export const document = app.table('document', {
	id: uuid('id').notNull().primaryKey().defaultRandom(),
	title: text('title')
});

export const signatory = app.table('signatory', {
	id: char('id', { length: 19 }).notNull().primaryKey()
});

export const signatorySession = app.table('signatory_session', {
	id: uuid('id').notNull().primaryKey().defaultRandom(),
	signatoryId: text('signatory_id')
		.notNull()
		.references(() => signatory.id)
});

export const documentSignatories = app.table(
	'document_signatory',
	{
		identifier: uuid('identifier').notNull().primaryKey().defaultRandom(),
		documentId: uuid('document_id')
			.notNull()
			.references(() => document.id),
		signatoryId: text('signatory_id')
			.notNull()
			.references(() => signatory.id),
		isVerified: boolean('is_verified').notNull().default(false)
	},
	(table) => [unique('unique_doc_id').on(table.documentId, table.signatoryId)]
);

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	signatoryId: char('id', { length: 19 })
		.notNull()
		.unique()
		.references(() => signatory.id),
	passwordHash: text('password_hash').notNull()
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;
