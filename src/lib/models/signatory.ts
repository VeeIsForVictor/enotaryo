import { env } from '$env/dynamic/public';
import { type InferOutput } from 'valibot';
import {
	PhilSysSignatory,
	PhilSysNewSignatory,
	validatePhilSysNumber,
	philSysSignatoryIdLength,
	PhilSysQrModel
} from './philsys';
import {
	MosipSignatory,
	MosipNewSignatory,
	validateMosipNumber,
	mosipSignatoryIdLength,
	MosipQrModel
} from './mosip';

if (!env.PUBLIC_ID_MODEL) throw new Error('PUBLIC_ID_MODEL is not set');

let signatory;
let newSignatory;
let exportedIdValidator;
let exportedIdLength;
let exportedQrModel;

if (env.PUBLIC_ID_MODEL == 'philsys') {
	signatory = PhilSysSignatory;
	newSignatory = PhilSysNewSignatory;
	exportedIdValidator = validatePhilSysNumber;
	exportedIdLength = philSysSignatoryIdLength;
	exportedQrModel = PhilSysQrModel;
} else if (env.PUBLIC_ID_MODEL == 'mosip') {
	signatory = MosipSignatory;
	newSignatory = MosipNewSignatory;
	exportedIdValidator = validateMosipNumber;
	exportedIdLength = mosipSignatoryIdLength;
	exportedQrModel = MosipQrModel;
} else {
	throw new Error('unknown value for PUBLIC_ID_MODEL');
}

export const Signatory = signatory;
export const NewSignatory = newSignatory;
export const validateIdNumber = exportedIdValidator;
export const SignatoryQr = exportedQrModel;

export const signatoryIdLength = exportedIdLength;

export type Signatory = InferOutput<typeof Signatory>;
export type NewSignatory = InferOutput<typeof NewSignatory>;
export type SignatoryQr = InferOutput<typeof SignatoryQr>;