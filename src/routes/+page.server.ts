import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ fetch }) => {
		const res = await fetch('http://localhost:8080/api/anomalies');
		console.log(res.status);
		if (res.status === 200) {
			return { success: true };
		}
		return { success: false };
	}
};
