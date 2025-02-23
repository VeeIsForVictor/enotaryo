import { object, optional, pipe, regex, string, type InferOutput } from 'valibot';

const validatePhilSysNumber = () => regex(/\d{4}-\d{4}-\d{4}-\d{4}/, 'invalid philsys number');

export const Signatory = object({
	id: pipe(string(), validatePhilSysNumber()),
	name: optional(string())
});

export const NewSignatory = Signatory;

export type Signatory = InferOutput<typeof Signatory>;
export type NewSignatory = InferOutput<typeof NewSignatory>;
