<script lang="ts">
    import { PUBLIC_MAPBOX_ACCESS_TOKEN } from "$env/static/public"
    import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
    import mapboxgl, { GeolocateControl, Map, Marker, Popup } from "mapbox-gl";
    import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
    import "mapbox-gl/dist/mapbox-gl.css"

    import { onMount, onDestroy } from "svelte";
    import { Button } from "$lib/components/ui/button/index";

    export let data;

    let map: Map;
    let mapContainer: HTMLElement;

    let isAirQualityLayerVisible = true;

    const toggleLayers = () => {
        if (map.getLayoutProperty('air-quality-points', 'visibility') === 'visible') {
            map.setLayoutProperty('air-quality-points', 'visibility', 'none');
            map.setLayoutProperty('traffic-points', 'visibility', 'visible');
            isAirQualityLayerVisible = false;
        } else {
            map.setLayoutProperty('air-quality-points', 'visibility', 'visible');
            map.setLayoutProperty('traffic-points', 'visibility', 'none');
            isAirQualityLayerVisible = true;
        }
    }

    onMount(() => {
        const initialState = { lat: 50.5039, lng: 4.4699, zoom: 7.3 };

        map = new Map({
            container: mapContainer,
            accessToken: PUBLIC_MAPBOX_ACCESS_TOKEN,
            style: 'mapbox://styles/mapbox/dark-v10',
            center: [initialState.lng, initialState.lat],
            zoom: initialState.zoom,
        });

        const subMarker = new Marker({color: 'red'})
            .setPopup(new Popup({offset: 25})
                .setText("Subscribe to this location to get email updates about its air quality!"))

        const geocoder = new MapboxGeocoder({
            accessToken: PUBLIC_MAPBOX_ACCESS_TOKEN,
            clearAndBlurOnEsc: true,
            marker: subMarker,
            mapboxgl,
        });

        map.on('style.load', () => {
            map.setFog({}); // Set the default atmosphere style
        });

        map.addControl(new GeolocateControl({ showUserLocation: true }))
        map.addControl(geocoder, "top-left");


        map.on('load', () => {
            map.addSource('air-quality', {
                type: 'geojson',
                data: data.geoJson
            });

            map.addLayer({
                'id': 'air-quality-points',
                'type': 'circle',
                'source': 'air-quality',
                'layout': {
                    'visibility': 'visible'
                },
                'paint': {
                    'circle-radius': 6,
                    'circle-color': [
                        'interpolate',
                        ['linear'],
                        ['get', 'air_quality'],
                        0, '#00ff00',
                        0.5, '#ffff00',
                        1, '#ff0000'
                    ],
                },
            });

            map.addLayer({
                'id': 'traffic-points',
                'type': 'circle',
                'source': 'air-quality',
                'layout': {
                    'visibility': 'none'
                },
                'paint': {
                    'circle-radius': 6,
                    'circle-color': [
                        'interpolate',
                        ['linear'],
                        ['get', 'total_traffic'],
                        0, '#00ff00',
                        100, '#ffff00',
                        500, '#ff0000'
                    ],
                }
            });
        });
    });

    onDestroy(() => {
        map?.remove();
    });

</script>

<div class="relative h-full">
    <div class="h-full" bind:this={mapContainer} />
    <Button class="absolute left-2.5 sm:top-14 top-16" on:click={toggleLayers}>
        Show {isAirQualityLayerVisible ? 'Traffic' : 'Air quality'} data
    </Button>
</div>
