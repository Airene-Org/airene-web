import type { CircleLayer } from 'mapbox-gl';

export const layers: CircleLayer[] = [
	{
		id: 'air-quality-points',
		type: 'circle',
		source: 'air-quality',
		layout: {
			visibility: 'visible'
		},
		paint: {
			'circle-radius': 6,
			'circle-color': [
				'interpolate',
				['linear'],
				['get', 'aqi'],
				0,
				'#002FFF',
				6,
				'#0099FF',
				16,
				'#019900',
				26,
				'#00FF02',
				36,
				'#FFFC01',
				46,
				'#FFBB02',
				61,
				'#FF6601',
				71,
				'#FF0000',
				81,
				'#CC0000',
				100,
				'#990099'
			]
		}
	},
	{
		id: 'traffic-points',
		type: 'circle',
		source: 'air-quality',
		layout: {
			visibility: 'none'
		},
		paint: {
			'circle-radius': 6,
			'circle-color': [
				'interpolate',
				['linear'],
				['get', 'total_traffic'],
				0,
				'#00ff00',
				100,
				'#ffff00', // ~ 50th percentile
				250,
				'#ff7f00', // ~ 75th percentile
				2000,
				'#ff0000' // ~ max
			]
		}
	},
	{
		id: 'pm10-quality-points',
		type: 'circle',
		source: 'air-quality',
		layout: {
			visibility: 'none'
		},
		paint: {
			'circle-radius': 6,
			'circle-color': [
				'interpolate',
				['linear'],
				['get', 'pm10_aqi'],
				0,
				'#0000FF',
				11,
				'#0E83FE',
				21,
				'#118B02',
				36,
				'#23FF07',
				46,
				'#FFFF09',
				61,
				'#FEAE08',
				81,
				'#FC4F06',
				96,
				'#FB0006',
				111,
				'#BE0004',
				141,
				'#850087'
			]
		}
	},
	{
		id: 'pm25-quality-points',
		type: 'circle',
		source: 'air-quality',
		layout: {
			visibility: 'none'
		},
		paint: {
			'circle-radius': 6,
			'circle-color': [
				'interpolate',
				['linear'],
				['get', 'pm25_aqi'],
				0,
				'#0000FF',
				3.6,
				'#0E83FE',
				7.6,
				'#118B02',
				11,
				'#23FF07',
				16,
				'#FFFF09',
				21,
				'#FEAE08',
				36,
				'#FC4F06',
				51,
				'#FB0006',
				61,
				'#BE0004',
				76,
				'#850087'
			]
		}
	},
	{
		id: 'o3-quality-points',
		type: 'circle',
		source: 'air-quality',
		layout: {
			visibility: 'none'
		},
		paint: {
			'circle-radius': 6,
			'circle-color': [
				'interpolate',
				['linear'],
				['get', 'o3_aqi'],
				0,
				'#0000FF',
				31,
				'#0E83FE',
				66,
				'#118B02',
				76,
				'#23FF07',
				91,
				'#FFFF09',
				111,
				'#FEAE08',
				151,
				'#FC4F06',
				181,
				'#FB0006',
				211,
				'#BE0004',
				241,
				'#850087'
			]
		}
	},
	{
		id: 'no2-quality-points',
		type: 'circle',
		source: 'air-quality',
		layout: {
			visibility: 'none'
		},
		paint: {
			'circle-radius': 6,
			'circle-color': [
				'interpolate',
				['linear'],
				['get', 'no2_aqi'],
				0,
				'#0000FF',
				11,
				'#0E83FE',
				16,
				'#118B02',
				21,
				'#23FF07',
				31,
				'#FFFF09',
				41,
				'#FEAE08',
				46,
				'#FC4F06',
				51,
				'#FB0006',
				61,
				'#BE0004',
				76,
				'#850087'
			]
		}
	}
];

export type LayerId =
	| 'air-quality-points'
	| 'traffic-points'
	| 'pm10-quality-points'
	| 'pm25-quality-points'
	| 'o3-quality-points'
	| 'no2-quality-points';

export const layerIds: LayerId[] = [
	'air-quality-points',
	'traffic-points',
	'pm10-quality-points',
	'pm25-quality-points',
	'o3-quality-points',
	'no2-quality-points'
];
