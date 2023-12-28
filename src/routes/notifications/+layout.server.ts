import type { LayoutServerLoad } from './$types';
import { PUBLIC_BACKEND_URL } from '$env/static/public';
import { redirect } from '@sveltejs/kit';

type Notification = {
	id: string;
	anomalyId: string;
	dataId: string;
	hasProvidedFeedback: boolean;
	timestamp: string;
};

export const load: LayoutServerLoad = async ({ fetch, locals, url }) => {
	const session = await locals.getSession();
	if (!session) redirect(302, 'auth/signin');
	const res = await fetch(`${PUBLIC_BACKEND_URL}/api/users/${session.user?.id}/notifications`);

	const notifications: Notification[] = await res.json();

	if (url.pathname === '/notifications' && notifications.length > 0) {
		redirect(302, `/notifications/${notifications[0].id}`);
	}

	return { notifications };
};
