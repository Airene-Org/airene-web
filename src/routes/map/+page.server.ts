import type { PageServerLoad, Actions } from './$types';
import type { MapboxGeoJSONFeature } from 'mapbox-gl';
import { PUBLIC_BACKEND_URL } from '$env/static/public';
import { redirect } from "@sveltejs/kit";


interface Data {
    id: string;
    segment_id: string;
    heavy: number;
    car: number;
    v85: number;
    latitude: number;
    longitude: number;
    timestamp: string;
    altitude: number;
    sensor_type: {
        sensor_id: number;
        name: string;
        manufacturer: string;
    };
    distanceKm: number;
    currentLastUpdated: string;
    currentTemperature: number;
    currentUv: number;
    currentGustKph: number;
    currentCo: number;
    currentNo2: number;
    currentO3: number;
    currentSo2: number;
    currentPm2_5: number;
    currentPm10: number;
    currentUsEpaIndex: number;
    currentGbDefraIndex: number;
    p1: number;
    p2: number;
    airQuality: number;
    co_aqi: number;
    no2_aqi: number;
    o3_aqi: number;
    so2_aqi: number;
    pm25_aqi: number;
    pm10_aqi: number;
    aqi: number;
}

export const ssr = false;

export const load: PageServerLoad = async ({ fetch }) => {
    const res = await fetch(`${PUBLIC_BACKEND_URL}/api/locations`);

    if (res.status === 401) {
        redirect(302, 'auth/signin');
    }

    const data: Data[] = await res.json();

    const features: Omit<MapboxGeoJSONFeature, 'layer' | 'source' | 'sourceLayer' | 'state'>[] =
        data.map((data) => {
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

    const geoJson = {
        type: 'FeatureCollection' as const,
        features
    };
    return { geoJson };
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
