import { object, optional, pipe, regex, string } from 'valibot';

export const validatePhilSysNumber = /\d{4}-\d{4}-\d{4}-\d{4}/
const fieldValidator = () => regex(validatePhilSysNumber, 'invalid philsys number');

export const PhilSysSignatory = object({
	id: pipe(string(), fieldValidator()),
	name: optional(string())
});

export const PhilSysNewSignatory = PhilSysSignatory;
