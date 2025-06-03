import { date, object, optional, pick, pipe, string, ulid, uuid, type InferOutput } from 'valibot';

export const Document = object({
	id: pipe(string(), uuid()),
	title: string(),
	file: string(),
	uploadTime: date()
});

export const NewDocument = object({
	...pick(Document, ['title', 'file']).entries,
	transaction: pipe(string(), ulid())
});

export type Document = InferOutput<typeof Document>;
export type NewDocument = InferOutput<typeof NewDocument>;
