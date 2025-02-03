import { unique, text, uuid, pgSchema, boolean, char } from 'drizzle-orm/pg-core';

export const app = pgSchema('app');

export const document = app.table('document', {
	id: uuid('id').notNull().primaryKey().defaultRandom(),
	title: text('title')
});

export const signatory = app.table('signatory', {
	id: char('id', { length: 19 }).notNull().primaryKey(),
	name: text('name')
});

export const signatorySession = app.table('signatory_session', {
	id: uuid('id').notNull().primaryKey().defaultRandom(), 
	signatoryId: text('signatory_id')
		.notNull()
		.references(() => signatory.id),
})

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
