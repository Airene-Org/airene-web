import type { PageServerLoad, Actions } from './$types';
import { PUBLIC_BACKEND_URL } from '$env/static/public';
import { redirect } from '@sveltejs/kit';
import type { Data } from '$lib/types';

export const ssr = false;

export const load: PageServerLoad = async ({ fetch }) => {
	const res = await fetch(`${PUBLIC_BACKEND_URL}/api/locations`);

	if (res.status === 401) {
		redirect(302, 'auth/signin');
	}

	const data: Data[] = await res.json();

	const features: GeoJSON.Feature<GeoJSON.Point>[] = data.map((data) => {
		const { latitude, longitude, car, heavy, ...rest } = data;
		const properties = { ...rest, car, heavy, total_traffic: car + heavy };

		return {
			type: 'Feature',
			geometry: {
				type: 'Point',
				coordinates: [longitude, latitude]
			},
			properties
		};
	});

	const timestamp = data[0].timestamp;
	const anomalyRes = await fetch(`${PUBLIC_BACKEND_URL}/api/anomalies/at?timestamp=${timestamp}`);
	const anomalyData: Data[] = await anomalyRes.json();

	const anomalies: GeoJSON.Feature<GeoJSON.Point>[] = anomalyData.map((data) => {
		const { latitude, longitude, car, heavy, ...rest } = data;
		const properties = { ...rest, car, heavy, total_traffic: car + heavy };

		return {
			type: 'Feature',
			geometry: {
				type: 'Point',
				coordinates: [longitude, latitude]
			},
			properties
		};
	});

	const geoJson: GeoJSON.FeatureCollection = {
		type: 'FeatureCollection',
		features
	};

	const anomalyGeoJson: GeoJSON.FeatureCollection = {
		type: 'FeatureCollection',
		features: anomalies
	};

	return { geoJson, anomalies: anomalyGeoJson };
};

export const actions: Actions = {
	subscribe: async ({ fetch, locals, request }) => {
		const session = await locals.getSession();
		const userId = session?.user?.id;
		if (!userId) {
			redirect(302, 'auth/signin');
		}

		const data = await request.formData();

		const latitude = data.get('latitude');
		const longitude = data.get('longitude');
		const address = data.get('address');

		const body = {
			latitude,
			longitude,
			address
		};

		const res = await fetch(`${PUBLIC_BACKEND_URL}/api/users/${userId}/subscriptions`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		});

		if (!res.ok) {
			return { success: true, error: true, errorMessage: "Couldn't subscribe to location" };
		}

		return { success: true, error: false, address };
	}
};
