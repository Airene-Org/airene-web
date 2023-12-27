import type { LayoutServerLoad } from './$types';
import { PUBLIC_BACKEND_URL } from '$env/static/public';
import { redirect } from '@sveltejs/kit';

type Subscription = {
	id: string;
	latitude: number;
	longitude: number;
	address: string;
	pause: boolean;
	createdAt: string;
};

export const load: LayoutServerLoad = async ({ fetch, locals, url }) => {
	const session = await locals.getSession();
	if (!session) redirect(302, 'auth/signin');
	const res = await fetch(`${PUBLIC_BACKEND_URL}/api/users/${session.user?.id}/subscriptions`);

	const subscriptions: Subscription[] = await res.json();

	if (url.pathname === '/subscriptions' && subscriptions.length > 0) {
		redirect(302, `/subscriptions/${subscriptions[0].id}`);
	}

	return { subscriptions };
};
