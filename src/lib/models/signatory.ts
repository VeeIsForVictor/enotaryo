import { env } from '$env/dynamic/public';
import { type InferOutput } from 'valibot';
import {
	PhilSysSignatory,
	PhilSysNewSignatory,
	validatePhilSysNumber,
	philSysSignatoryIdLength
} from './philsys';
import {
	MosipSignatory,
	MosipNewSignatory,
	validateMosipNumber,
	mosipSignatoryIdLength
} from './mosip';

if (!env.PUBLIC_ID_MODEL) throw new Error('PUBLIC_ID_MODEL is not set');

let signatory;
let newSignatory;
let exportedIdValidator;
let exportedIdLength;

if (env.PUBLIC_ID_MODEL == 'philsys') {
	signatory = PhilSysSignatory;
	newSignatory = PhilSysNewSignatory;
	exportedIdValidator = validatePhilSysNumber;
	exportedIdLength = philSysSignatoryIdLength;
} else if (env.PUBLIC_ID_MODEL == 'mosip') {
	signatory = MosipSignatory;
	newSignatory = MosipNewSignatory;
	exportedIdValidator = validateMosipNumber;
	exportedIdLength = mosipSignatoryIdLength;
} else {
	throw new Error('unknown value for PUBLIC_ID_MODEL');
}

export const Signatory = signatory;
export const NewSignatory = newSignatory;
export const validateIdNumber = exportedIdValidator;

export const signatoryIdLength = exportedIdLength;

export type Signatory = InferOutput<typeof Signatory>;
export type NewSignatory = InferOutput<typeof NewSignatory>;
