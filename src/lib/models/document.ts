import { object, pipe, string, uuid, type InferOutput } from "valibot";

export const Document = object({
    id: pipe(string(), uuid()),
    title: string()
})

export type Document = InferOutput<typeof Document>