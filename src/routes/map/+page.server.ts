import type { PageServerLoad } from './$types';
import type { MapboxGeoJSONFeature } from 'mapbox-gl';
import { BACKEND_URL } from '$env/static/private';
import { dev } from '$app/environment';
import { error } from '@sveltejs/kit';

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

export const load: PageServerLoad = async ({ fetch }) => {
	const res = await fetch(
		dev ? 'http://localhost:8080/api/locations' : `${BACKEND_URL}/api/locations`
	);

	if (res.status === 401) {
		throw error(401, 'Unauthorized');
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
