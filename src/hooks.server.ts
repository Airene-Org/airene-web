import { KEYCLOAK_CLIENT_ID, KEYCLOAK_CLIENT_SECRET, KEYCLOAK_ISSUER } from '$env/static/private';

import type { Handle, HandleFetch } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { redirect } from '@sveltejs/kit';
import { SvelteKitAuth } from '@auth/sveltekit';
import Keycloak from '@auth/core/providers/keycloak';

const handleAuth = SvelteKitAuth({
	providers: [
		Keycloak({
			clientId: KEYCLOAK_CLIENT_ID,
			clientSecret: KEYCLOAK_CLIENT_SECRET,
			issuer: KEYCLOAK_ISSUER
		})
	],
	callbacks: {
		jwt: async ({ token, account }) => {
			if (account) {
				token.access_token = account.access_token;
			}
			return token;
		},
		session: async ({ session, token }) => {
			if (session) {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				session.access_token = token.access_token;
			}
			return session;
		}
	},
	trustHost: true
});

const isAuthenticatedUser: Handle = async ({ event, resolve }) => {
	const session = await event.locals.getSession();
	if (!session?.user && event.url.pathname !== '/') {
		throw redirect(302, '/auth/signin');
	}
	return resolve(event);
};

export const handleFetch: HandleFetch = async ({ request, event }) => {
	const session = await event.locals.getSession();
	const token = session?.access_token;
	if (!token) {
		return fetch(request);
	}
	request.headers.set('Authorization', `Bearer ${token}`);
	return fetch(request);
};

export const handle = sequence(handleAuth, isAuthenticatedUser);
