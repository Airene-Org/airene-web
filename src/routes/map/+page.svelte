<script lang="ts">
    import { PUBLIC_MAPBOX_ACCESS_TOKEN } from "$env/static/public"
    import { GeolocateControl, Map, Marker, NavigationControl, Popup, type SymbolLayer } from "mapbox-gl";
    import "mapbox-gl/dist/mapbox-gl.css"

    import { onMount, onDestroy } from "svelte";
    export let data;

    let map: Map;
    let mapContainer: HTMLElement;



    onMount(() => {
        const initialState = { lat: 50.5039, lng: 4.4699, zoom: 7.3 };

        map = new Map({
            container: mapContainer,
            accessToken: PUBLIC_MAPBOX_ACCESS_TOKEN,
            style: `mapbox://styles/mapbox/outdoors-v11`,
            center: [initialState.lng, initialState.lat],
            zoom: initialState.zoom,
        });

        const layer: SymbolLayer = {
            id: 'air-quality',
            type: 'symbol'
        }

        // map.addLayer(layer)

        map.addControl(new GeolocateControl({ showUserLocation: true}))

        for (const marker of data.data) {
            const span = document.createElement("span");
            Object.assign(span.style, {
                width: "10px",
                height: "10px",
                backgroundColor: `hsl(25, 100%, ${100 - marker.air_quality * 100}%`,
                borderRadius: "50%",
                display: "inline-block",
            })
            new Marker({ element: span })
                .setLngLat([marker.longitude, marker.latitude])
                .setPopup(
                    new Popup({ offset: 25 }).setHTML(
                        `
                        <p><strong class="bold">P1:</strong> ${marker.p1} ppm</p>
                        <p><strong class="bold">P2:</strong> ${marker.p2} ppm</p>
                        <p><strong class="bold">Temperature:</strong> ${marker["current.temp_c"]} °C</p>
                        <p><strong class="bold">Wind:</strong> ${marker["current.gust_kph"]} kp/h</p>
                        <p><strong class="bold">CO:</strong> ${marker["current.air_quality.co"]} ppm</p>
                        <p><strong class="bold">NO2:</strong> ${marker["current.air_quality.no2"]} ppm</p>
                        <p><strong class="bold">O3:</strong> ${marker["current.air_quality.o3"]} ppm</p>
                        <p><strong class="bold">SO2:</strong> ${marker["current.air_quality.so2"]} ppm</p>
                        <p><strong class="bold">PM2.5:</strong> ${marker["current.air_quality.pm2_5"]} ppm</p>
                        <p><strong class="bold">PM10:</strong> ${marker["current.air_quality.pm10"]} ppm</p>
                        `
                    )
                )
                .addTo(map)
        }

    });

    onDestroy(() => {
        map?.remove();
    });

</script>

<div class="map-wrap">
    <div class="absolute w-screen h-screen" bind:this={mapContainer} />
</div>
