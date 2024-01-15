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

	const res = await fetch(`${PUBLIC_BACKEND_URL}/api/data/${notification.dataId}`);

	const data: Data = await res.json();

	notification.anomaly.feedback = notification.anomaly.feedback.slice(0, 3);

	return { notification, data };
};

export const actions: Actions = {
	default: async ({ fetch, request, params }) => {
		const formData = await request.formData();
		const anomalyId = formData.get('anomalyId');
		const cause = formData.get('cause');
		const description = formData.get('description');

		await fetch(`${PUBLIC_BACKEND_URL}/api/notifications/${params.id}`, {
			method: 'POST',
			body: JSON.stringify({ feedbackReason: cause, description, anomalyId }),
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
};
