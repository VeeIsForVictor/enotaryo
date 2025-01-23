import { object, pipe, regex, string, type InferOutput } from "valibot";

const validatePhilSysNumber = () => regex(/\d{4}-\d{4}-\d{4}-\d{4}/, 'invalid philsys number')

export const Signatory = object({
    id: pipe(string(), validatePhilSysNumber()),
    name: string()
});

export type Signatory = InferOutput<typeof Signatory>