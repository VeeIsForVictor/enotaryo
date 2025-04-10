// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			ctx?: {
				db: import('$lib/server/db').Database;
				logger: import('pino').Logger;
			};
			user: import('$lib/server/auth').SessionValidationResult['user'];
			session: import('$lib/server/auth').SessionValidationResult['session'];
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
