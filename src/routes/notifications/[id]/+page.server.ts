import type { PageServerLoad, Actions } from './$types';
import { error } from '@sveltejs/kit';
import { PUBLIC_BACKEND_URL } from '$env/static/public';
import type { Data } from '$lib/types';

export const load: PageServerLoad = async ({ params, parent, fetch }) => {
	const { notifications } = await parent();

	const notification = notifications.find((subscription) => subscription.id === params.id);

	if (!notification) {
		error(404, 'Subscription not found');
	}

	// const [dataRes, anomalyRes] = await Promise.all([
	// 	fetch(`${PUBLIC_BACKEND_URL}/api/data/${notification.dataId}`),
	// 	fetch(`${PUBLIC_BACKEND_URL}/api/anomalies/${notification.anomalyId}`)
	// ]);

	const res = await fetch(`${PUBLIC_BACKEND_URL}/api/data/${notification.dataId}`)

	const data: Data = await res.json();

	return { notification, data };
};

export const actions: Actions = {
};
