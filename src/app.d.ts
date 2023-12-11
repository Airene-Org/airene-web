// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { Session } from '@auth/core/types';

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
		interface Locals {
			getSession(): Promise<(Session & { access_token: string }) | null>;
		}
		interface PageData {
			session?: (Session & { access_token: string }) | null;
		}
	}
}

export {};
