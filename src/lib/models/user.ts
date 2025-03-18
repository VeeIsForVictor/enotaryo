import { object, pick, string, type InferOutput } from "valibot";

export const User = object({
    id: string(),
    signatoryId: string(),
    passwordHash: string()
});

export type User = InferOutput<typeof User>;

export const PublicUserData = pick(User, ['id', 'signatoryId']);

export type PublicUserData = InferOutput<typeof PublicUserData>;