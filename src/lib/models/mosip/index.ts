import { object, optional, pipe, regex, string } from "valibot";

export const validateMosipNumber = /\d{10}/;
const fieldValidator = () => regex(validateMosipNumber, 'invalid mosip number');

export const MosipSignatory = object({
    id: pipe(string(), fieldValidator()),
    name: optional(string())
});

export const MosipNewSignatory = MosipSignatory;