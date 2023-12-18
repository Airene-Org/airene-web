import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ fetch }) => {
		const res = await fetch('https://airene-backend.sharppy.win/api/anomalies');
		console.log(res.status);
		if (res.status === 200) {
			return { success: true };
		}
		return { success: false };
	}
};
