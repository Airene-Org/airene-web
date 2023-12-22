import type { Actions } from './$types';
import { BACKEND_URL } from '$env/static/private';

export const actions: Actions = {
	default: async ({ fetch }) => {
		const res = await fetch(`${BACKEND_URL}/api/anomalies`);
		console.log(res.status);
		if (res.status === 200) {
			return { success: true };
		}
		return { success: false };
	}
};
