import type { PageServerLoad } from './$types';
import type { MapboxGeoJSONFeature } from 'mapbox-gl';

interface Data {
	segment_id: string;
	heavy: number;
	car: number;
	v85: number;
	timestamp: string;
	latitude: number;
	longitude: number;
	altitude: number;
	sensor_type: {
		id: number;
		name: string;
		manufacturer: string;
	};
	distance_km: number;
	'current.last_updated': string;
	'current.temp_c': number;
	'current.uv': number;
	'current.gust_kph': number;
	'current.air_quality.co': number;
	'current.air_quality.no2': number;
	'current.air_quality.o3': number;
	'current.air_quality.so2': number;
	'current.air_quality.pm2_5': number;
	'current.air_quality.pm10': number;
	'current.air_quality.us-epa-index': number;
	'current.air_quality.gb-defra-index': number;
	p1: number;
	p2: number;
	id: string;
	air_quality: number;
}

export const load: PageServerLoad = async ({ fetch }) => {
	const res = await fetch('http://localhost:3000/data');
	const data: Data[] = await res.json();

	const features: MapboxGeoJSONFeature[] = data.map((d) => {
		const { latitude, longitude, ...properties } = d;
		properties['total_traffic'] = properties['heavy'] + properties['car'];

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
