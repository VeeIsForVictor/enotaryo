import { object, pick, picklist, pipe, string, uuid, type InferOutput } from 'valibot';

const SignatureStatus = picklist(['pending', 'approved', 'denied']);

export const Signature = object({
	id: pipe(string(), uuid()),
	signatoryId: string(),
	documentId: string(),
	status: SignatureStatus
});

export const NewSignature = pick(Signature, ['signatoryId', 'documentId']);
export const SignatureId = pick(Signature, ['id']);

export type Signature = InferOutput<typeof Signature>;
export type NewSignature = InferOutput<typeof NewSignature>;
export type SignatureId = InferOutput<typeof SignatureId>;
