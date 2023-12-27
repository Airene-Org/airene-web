import type { RequestHandler } from './$types';
import { PUBLIC_BACKEND_URL } from "$env/static/public";
import { json, redirect } from "@sveltejs/kit";

export const PATCH: RequestHandler = async ({ locals, params, fetch}) => {
    const session = await locals.getSession();
    if (!session) redirect(302, 'auth/signin');

    const userId = session.user?.id;
    const res = await fetch(
        `${PUBLIC_BACKEND_URL}/api/users/${userId}/subscriptions/${params.id}/pause`,
        {
            method: "PATCH"
        }
    );

    const errorMessage= "Unable to pause subscription"
    if (!res.ok) {
        return json({
            success: false,
            error: true,
            errorMessage,
        }, { status: res.status, statusText: errorMessage })
    }

    const subscription = await res.json();

    return json({
        success: true,
        error: false,
        subscription
    });
}