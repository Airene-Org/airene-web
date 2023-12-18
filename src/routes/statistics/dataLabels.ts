export const labels = [
	{ label: 'AQI', name: 'aqi' },
	{ label: 'PM2.5', name: 'pm2_5' },
	{ label: 'PM10', name: 'pm10' },
	{ label: 'CO', name: 'co' },
	{ label: 'NO2', name: 'no2' },
	{ label: 'SO2', name: 'so2' },
	{ label: 'O3', name: 'o3' },
	{ label: 'P1', name: 'p1' },
	{ label: 'P2', name: 'p2' },
	{ label: 'Car', name: 'car' },
	{ label: 'Truck', name: 'heavy' },
	{ label: 'CO AQI', name: 'coAqi' },
	{ label: 'NO2 AQI', name: 'no2Aqi' },
	{ label: 'SO2 AQI', name: 'so2Aqi' },
	{ label: 'O3 AQI', name: 'o3Aqi' },
	{ label: 'PM2.5 AQI', name: 'pm25Aqi' },
	{ label: 'PM10 AQI', name: 'pm10Aqi' }
] as const;

export interface DataPoint {
	hour: number;
	co: number;
	no2: number;
	o3: number;
	so2: number;
	pm2_5: number;
	pm10: number;
	p1: number;
	p2: number;
	car: number;
	heavy: number;
	coAqi: number;
	no2Aqi: number;
	o3Aqi: number;
	so2Aqi: number;
	pm25Aqi: number;
	pm10Aqi: number;
	aqi: number;
}

export interface Data {
	avg: DataPoint[];
	total: DataPoint[];
}
