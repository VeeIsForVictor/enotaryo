import { env } from '$env/dynamic/public'
import { type InferOutput } from 'valibot';

if (!env.PUBLIC_ID_MODEL) throw new Error("PUBLIC_ID_MODEL is not set");

let signatory;
let newSignatory;
let exportedIdValidator;

if (env.PUBLIC_ID_MODEL == 'philsys') {
	let { PhilSysSignatory, PhilSysNewSignatory, validatePhilSysNumber } = await import('./philsys');
	signatory = PhilSysSignatory;
	newSignatory = PhilSysNewSignatory;
	exportedIdValidator = validatePhilSysNumber;
}
else if (env.PUBLIC_ID_MODEL == 'mosip') {
	let { MosipSignatory, MosipNewSignatory, validateMosipNumber } = await import('./mosip');
	signatory = MosipSignatory;
	newSignatory = MosipNewSignatory;
	exportedIdValidator = validateMosipNumber;
}
else {
	throw new Error("unknown ID_MODEL")
}

export const Signatory = signatory;
export const NewSignatory = newSignatory;
export const validateIdNumber = exportedIdValidator;

export type Signatory = InferOutput<typeof Signatory>;
export type NewSignatory = InferOutput<typeof NewSignatory>;
