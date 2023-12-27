import type { Actions } from './$types';
import { PUBLIC_BACKEND_URL } from '$env/static/public';

export const actions: Actions = {
	default: async ({ fetch }) => {
		const res = await fetch(`${PUBLIC_BACKEND_URL}/api/anomalies`);
		console.log(res.status);
		if (res.status === 200) {
			return { success: true };
		}
		return { success: false };
	}
};
