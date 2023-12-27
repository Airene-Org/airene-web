import type { PageServerLoad, Actions } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { PUBLIC_BACKEND_URL } from '$env/static/public';

export const load: PageServerLoad = async ({ params, parent }) => {
	const { subscriptions } = await parent();

	const subscription = subscriptions.find((subscription) => subscription.id === params.id);

	if (!subscription) {
		error(404, 'Subscription not found');
	}
	return { subscription };
};

export const actions: Actions = {
	delete: async ({ params, fetch, locals }) => {
		const session = await locals.getSession();
		if (!session) redirect(302, 'auth/signin');
		const userId = session.user?.id;
		const res = await fetch(
			`${PUBLIC_BACKEND_URL}/api/users/${userId}/subscriptions/${params.id}`,
			{
				method: 'DELETE'
			}
		);

		if (!res.ok) {
			return {
				success: true,
				error: true,
				errorMessage: 'Unable to delete subscription'
			};
		}
		redirect(302, '/subscriptions');
	}
};
