import { object } from 'valibot';
import { Document } from './document';
import { Signatory } from './signatory';

export const DocumentSignatory = object({
	docId: Document.entries.id,
	sigId: Signatory.entries.id
});
