import { object, pick, pipe, string, uuid, type InferOutput } from 'valibot';

export const Document = object({
	id: pipe(string(), uuid()),
	title: string()
});

export const NewDocument = pick(Document, ['title'])

export type Document = InferOutput<typeof Document>;
export type NewDocument = InferOutput<typeof NewDocument>;
