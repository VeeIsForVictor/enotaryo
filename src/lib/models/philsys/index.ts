import { object, optional, pipe, regex, string } from 'valibot';

export const validatePhilSysNumber = () => regex(/\d{4}-\d{4}-\d{4}-\d{4}/, 'invalid philsys number');

export const PhilSysSignatory = object({
	id: pipe(string(), validatePhilSysNumber()),
	name: optional(string())
});

export const PhilSysNewSignatory = PhilSysSignatory;
