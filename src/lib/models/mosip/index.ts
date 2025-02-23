import { object, optional, pipe, regex, string } from "valibot";

export const validateMosipNumber = () => regex(/hello, world!/, 'invalid mosip number');

export const MosipSignatory = object({
    id: pipe(string(), validateMosipNumber()),
    name: optional(string())
});

export const MosipNewSignatory = MosipSignatory;