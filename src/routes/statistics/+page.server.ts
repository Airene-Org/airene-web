import { BACKEND_URL } from '$env/static/private';
import type { PageServerLoad } from './$types';
import type { ChartDataset, Point } from 'chart.js';
import { fromDate, getLocalTimeZone } from '@internationalized/date';
import { error, redirect } from '@sveltejs/kit';
import { type Data, labels } from './dataLabels';

export const load: PageServerLoad = async ({ url, fetch }) => {
	const location = url.searchParams.get('location');
	if (!location) {
		return;
	}
	const [lng, lat] = location.split(',').map((v) => Number(v));

	const dateParam = url.searchParams.get('date');
	if (!dateParam) {
		throw redirect(302, `/statistics?date=${fromDate(new Date(), getLocalTimeZone())}`);
	}
	const date = new Date(Date.parse(dateParam));

	const modeParam = url.searchParams.get('mode') ?? 'avg';
	const mode = modeParam === 'total' ? 'total' : 'avg';

	const distance = Number(url.searchParams.get('distance'));

	const dataUrl = new URL(`${BACKEND_URL}/api/data`);

	dataUrl.searchParams.set('longitude', lng.toString());
	dataUrl.searchParams.set('latitude', lat.toString());
	dataUrl.searchParams.set('date', date.toISOString().slice(0, 10));
	dataUrl.searchParams.set('radius', distance.toString());

	const anomalyUrl = new URL(`${BACKEND_URL}/api/anomalies`);

	anomalyUrl.searchParams.set('longitude', lng.toString());
	anomalyUrl.searchParams.set('latitude', lat.toString());
	anomalyUrl.searchParams.set('date', date.toISOString().slice(0, 10));
	anomalyUrl.searchParams.set('radius', distance.toString());

	const [dataRes, anomalyRes] = await Promise.all([fetch(dataUrl), fetch(anomalyUrl)]);

	if (!dataRes.ok) {
		throw error(dataRes.status, dataRes.statusText);
	}
	if (!anomalyRes.ok) {
		throw error(anomalyRes.status, anomalyRes.statusText);
	}

	// TODO: update type of fetchedAnomalies
	const [fetchedData, fetchedAnomalies]: [fetchedData: Data, fetchedAnomalies: unknown] =
		await Promise.all([dataRes.json(), anomalyRes.json()]);

	console.log(fetchedAnomalies);
	// TODO: do necessary transformations on fetchedAnomalies (shape below)
	// {
	// 	`anomaly${index}`: { // => map over anomalies and draw a line for each here
	// 		type: 'line',
	// 			borderColor: 'red',
	// 			borderWidth: 2,
	// 			click: (e) => {
	// 				const index = e.element.options.value;
	// 				// create a mapping of the dataset labels to the data values
	// 				const data = e.chart.data.datasets.map(d => ( {[d.label]: d.data[index]} ))
	// 				console.log(data);
	// 			},
	// 			scaleID: 'x',
	// 			value: 9, // data value to draw the line at (INDEX, NOT ACTUAL VALUE!)
	// 			label: {
	// 			content: 'Anomaly',
	// 				display: true,
	// 				position: 'start',
	// 				backgroundColor: 'red',
	// 				xAdjust: 25,
	// 				yAdjust: 25,
	// 				font: {
	// 				size: 14,
	// 					weight: 'bold',
	// 					color: 'red',
	// 			},
	// 		},
	// 	},
	// }

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

	labels.forEach(({ label, name }, i) => {
		if (mode === 'total' && label.includes('AQI')) {
			return;
		}
		const hidden = mode === 'avg' && !(label.includes('AQI') || ['Car', 'Truck'].includes(label));
		dataSets.push({
			label: label,
			data: transformedData[mode].map((item) => (item ? item[name] : undefined)),
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

	return { data, anomalies: fetchedAnomalies };
};
