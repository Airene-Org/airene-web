import { PUBLIC_BACKEND_URL } from '$env/static/public';
import type { PageServerLoad } from './$types';
import type { ChartDataset, Point } from 'chart.js';
import { fromDate, getLocalTimeZone } from '@internationalized/date';
import { error, redirect } from '@sveltejs/kit';
import { type Data, type Anomaly, labels } from './dataLabels';
import type { LineAnnotationOptions } from "chartjs-plugin-annotation";

export const load: PageServerLoad = async ({ url, fetch }) => {
	const location = url.searchParams.get('location');
	if (!location) {
		return;
	}
	const [lng, lat] = location.split(',').map((v) => Number(v));

	const dateParam = url.searchParams.get('date');
	if (!dateParam) {
		redirect(302, `/statistics?date=${fromDate(new Date(), getLocalTimeZone())}`);
	}
	const date = new Date(Date.parse(dateParam));

	const modeParam = url.searchParams.get('mode') ?? 'avg';
	const mode = modeParam === 'total' ? 'total' : 'avg';

	const distance = Number(url.searchParams.get('distance'));

	const dataUrl = new URL(`${PUBLIC_BACKEND_URL}/api/data`);

	dataUrl.searchParams.set('longitude', lng.toString());
	dataUrl.searchParams.set('latitude', lat.toString());
	dataUrl.searchParams.set('date', date.toISOString().slice(0, 10));
	dataUrl.searchParams.set('radius', distance.toString());

	const anomalyUrl = new URL(`${PUBLIC_BACKEND_URL}/api/anomalies`);

	anomalyUrl.searchParams.set('longitude', lng.toString());
	anomalyUrl.searchParams.set('latitude', lat.toString());
	anomalyUrl.searchParams.set('date', date.toISOString().slice(0, 10));
	anomalyUrl.searchParams.set('radius', distance.toString());

	const [dataRes, anomalyRes] = await Promise.all([fetch(dataUrl), fetch(anomalyUrl)]);

	if (!dataRes.ok) {
		error(500, dataRes.statusText);
	}
	if (!anomalyRes.ok) {
		error(500, anomalyRes.statusText);
	}

	const [fetchedData, fetchedAnomalies]: [fetchedData: Data, fetchedAnomalies: Anomaly[]] =
		await Promise.all([dataRes.json(), anomalyRes.json()]);

	const anomalyData = fetchedAnomalies.reduce<Record<string, Anomaly>>((acc, anomaly) => ({ ...acc, [anomaly.id]: anomaly }), {});

	const anomalyLines = new Set<number>();
	const anomalyAnnotations: LineAnnotationOptions[] =	fetchedAnomalies.map((anomaly, index) => {
		const date = new Date(anomaly.timestamp);
		const hour = date.getHours();
		if (anomalyLines.has(hour)) {
			return {
				type: 'line',
				borderWidth: 0,
				id: anomaly.id,
				scaleID: 'x',
				value: hour - 1, // data value to draw the line at (INDEX, NOT ACTUAL VALUE!)
				label: {
					content: 'Anomaly',
					display: true,
					position: 'start',
					backgroundColor: 'red',
					yAdjust: 35 * index,
					font: {
						size: 14,
						weight: 'bold',
						color: 'red',
					},
				},
			}
		}
		anomalyLines.add(hour);

		return {
			type: 'line',
			borderColor: 'red',
			borderWidth: 2,
			id: anomaly.id,
			scaleID: 'x',
			value: hour - 1, // data value to draw the line at (INDEX, NOT ACTUAL VALUE!)
			label: {
				content: 'Anomaly',
				display: true,
				position: 'start',
				backgroundColor: 'red',
				yAdjust: 35 * index,
				font: {
				 	size: 14,
				 	weight: 'bold',
				 	color: 'red',
				},
			},
		}
	});

	const hourLabels = Array.from({ length: 24 }, (_, i) => i + 1);
	const transformedData = {
		avg: hourLabels.map((hour) => {
			const found = fetchedData.avg.find((item) => item.hour === hour);
			return found || null;
		}),
		total: hourLabels.map((hour) => {
			const found = fetchedData.total.find((item) => item.hour === hour);
			return found || null;
		})
	};

	const dataSets: ChartDataset<'line', (number | Point | undefined)[]>[] = [];
	let hasData = false;

	labels.forEach(({ label, name }, i) => {
		if (mode === 'total' && label.includes('AQI')) {
			return;
		}
		const hidden = mode === 'avg' && !(label.includes('AQI') || ['Car', 'Truck'].includes(label));

		const data = transformedData[mode].map((item) => (item ? item[name] : undefined));
		if (!hasData && data.some((item) => item !== undefined)) {
			hasData = true;
		}
		dataSets.push({
			label: label,
			data,
			tension: 0.3,
			hidden,
			spanGaps: true,
			borderCapStyle: 'butt',
			borderDashOffset: 0.0,
			borderJoinStyle: 'miter',
			pointBorderColor: `hsl(${40 * i}, 70%, 40%)`,
			pointBorderWidth: 10,
			pointHoverRadius: 5,
			pointHoverBackgroundColor: `hsl(${40 * i}, 70%, 20%)`,
			pointHoverBorderWidth: 2,
			pointRadius: 1,
			pointHitRadius: 100,
			backgroundColor: `hsl(${40 * i}, 70%, 50%)`,
			borderColor: `hsl(${40 * i}, 70%, 50%)`
		});
	});
	const data = {
		labels: hourLabels,
		datasets: dataSets
	};

	return { data, anomalyAnnotations, anomalyData, hasData };
};
