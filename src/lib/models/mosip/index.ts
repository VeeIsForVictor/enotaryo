import { object, optional, pipe, regex, string } from 'valibot';

export const validateMosipNumber = /[A-z0-9]{10}/;
const fieldValidator = () => regex(validateMosipNumber, 'invalid mosip number');

export const MosipSignatory = object({
	id: pipe(string(), fieldValidator()),
	name: optional(string())
});

export const MosipNewSignatory = MosipSignatory;
export const mosipSignatoryIdLength = 10;

export const MosipQrModel = object({
	name: string(),
	uin: string(),
	gender: string(),
	dob: string(),
})