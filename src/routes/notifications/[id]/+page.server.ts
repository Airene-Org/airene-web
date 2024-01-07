import type { PageServerLoad, Actions } from './$types';
import { error, json } from '@sveltejs/kit';
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

	// const [data, anomaly]: [data: Data, anomaly: any] = await Promise.all([
	// 	dataRes.json(),
	// 	anomalyRes.json()
	// ]);

	// console.log({ data, anomaly });

	const res = await fetch(`${PUBLIC_BACKEND_URL}/api/data/${notification.dataId}`);

	const data: Data = await res.json();

	return { notification, data };
};

export const actions: Actions = {
	default: async ({ fetch, request }) => {
		const formData = await request.formData();
		const anomalyId = formData.get('anomalyId');
		const cause = formData.get('cause');
		const description = formData.get('description');
		console.log({ anomalyId, cause, description });

		await fetch(`${PUBLIC_BACKEND_URL}/api/anomalies/${anomalyId}`, {
			method: 'POST',
			body: JSON.stringify({ feedbackReason: cause, description }),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		return;
	}
};
