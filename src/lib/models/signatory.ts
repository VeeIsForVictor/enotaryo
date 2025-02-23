import { env } from '$env/dynamic/private'
import { type InferOutput } from 'valibot';
import { validateMosipNumber } from './mosip';

if (!env.ID_MODEL) throw new Error("ID_MODEL is not set");

let signatory;
let newSignatory;
let exportedIdValidator;

if (env.ID_MODEL == 'mosip') {
	let { PhilSysSignatory, PhilSysNewSignatory, validatePhilSysNumber } = await import('./philsys');
	signatory = PhilSysSignatory;
	newSignatory = PhilSysNewSignatory;
	exportedIdValidator = validatePhilSysNumber;
}
else if (env.ID_MODEL == 'philsys') {
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
