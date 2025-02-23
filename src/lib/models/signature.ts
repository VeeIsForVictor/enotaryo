import { boolean, object, pick, pipe, string, uuid, type InferOutput } from "valibot";

export const Signature = object({
    id: pipe(string(), uuid()),
    signatoryId: string(),
    isVerified: boolean()
});

export const NewSignature = pick(Signature, ['signatoryId']);
export const SignatureId = pick(Signature, ['id']);

export type Signature = InferOutput<typeof Signature>;
export type NewSignature = InferOutput<typeof NewSignature>;
export type SignatureId = InferOutput<typeof SignatureId>;