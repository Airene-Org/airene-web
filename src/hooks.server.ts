import { KEYCLOAK_CLIENT_ID, KEYCLOAK_CLIENT_SECRET, KEYCLOAK_ISSUER } from '$env/static/private';

import { error, type Handle, type HandleFetch } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { redirect } from '@sveltejs/kit';
import { SvelteKitAuth } from '@auth/sveltekit';
import Keycloak from '@auth/core/providers/keycloak';
import type { JWT } from '@auth/core/jwt';

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
				token.access_token_expires = Date.now() + (account.expires_in ?? 0) * 1000;
				token.refresh_token = account.refresh_token;
			}
			if (Date.now() < (token.access_token_expires as number) ?? 0) {
				return token;
			}
			return refreshAccessToken(token);
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

async function refreshAccessToken(token: JWT) {
	if (Date.now() > (token.refreshTokenExpired as number) ?? 0)
		throw error(500, 'Refresh token expired');

	const url = new URL(`${KEYCLOAK_ISSUER}/protocol/openid-connect/token`);
	const details = {
		client_id: KEYCLOAK_CLIENT_ID,
		client_secret: KEYCLOAK_CLIENT_SECRET,
		grant_type: ['refresh_token'],
		refresh_token: token.refresh_token
	};
	const body = Object.entries(details)
		.map(([key, value]: [string, any]) => {
			const encodedKey = encodeURIComponent(key);
			const encodedValue = encodeURIComponent(value);
			return `${encodedKey}=${encodedValue}`;
		})
		.join('&');

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
		},
		body
	});

	if (!response.ok) {
		throw error(response.status, response.statusText);
	}

	const refreshedTokens = await response.json();

	return {
		...token,
		access_token: refreshedTokens.access_token,
		access_token_expires: Date.now() + refreshedTokens.expires_in * 1000,
		refresh_token: refreshedTokens.refresh_token ?? token.refresh_token // Fall back to old refresh token
	};
}

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
