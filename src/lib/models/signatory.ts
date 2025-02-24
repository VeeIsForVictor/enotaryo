import { PUBLIC_ID_MODEL } from '$env/static/public';
import { type InferOutput } from 'valibot';
import { PhilSysSignatory, PhilSysNewSignatory, validatePhilSysNumber } from './philsys';
import { MosipSignatory, MosipNewSignatory, validateMosipNumber } from './mosip';

if (!PUBLIC_ID_MODEL) throw new Error('PUBLIC_ID_MODEL is not set');

let signatory;
let newSignatory;
let exportedIdValidator;

if (PUBLIC_ID_MODEL == 'philsys') {
	signatory = PhilSysSignatory;
	newSignatory = PhilSysNewSignatory;
	exportedIdValidator = validatePhilSysNumber;
} else if (PUBLIC_ID_MODEL == 'mosip') {
	signatory = MosipSignatory;
	newSignatory = MosipNewSignatory;
	exportedIdValidator = validateMosipNumber;
} else {
	throw new Error('unknown value for PUBLIC_ID_MODEL');
}

export const Signatory = signatory;
export const NewSignatory = newSignatory;
export const validateIdNumber = exportedIdValidator;

export type Signatory = InferOutput<typeof Signatory>;
export type NewSignatory = InferOutput<typeof NewSignatory>;
