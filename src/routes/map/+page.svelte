<script lang="ts">
    import { PUBLIC_MAPBOX_ACCESS_TOKEN } from "$env/static/public"
    import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
    import mapboxgl, { GeolocateControl, Map, Marker, Popup } from "mapbox-gl";
    import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
    import "mapbox-gl/dist/mapbox-gl.css"

    import { onMount, onDestroy } from "svelte";
    import LayerSelector from "./LayerSelector.svelte";
    import { type LayerId, layerIds, layers } from "./layers";

    export let data;

    let map: Map;
    let mapContainer: HTMLDivElement;
    type Layer = LayerId | "";
    let activeLayer: Layer = '';

    $: {
        if (map && map.loaded()) {
            layerIds.forEach(layerId => {
                map.setLayoutProperty(layerId, 'visibility', 'none');
            });
            map.setLayoutProperty(activeLayer, 'visibility', 'visible')
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
            countries: 'be',
            placeholder: 'Search for an address...',
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

            layers.map(layer => map.addLayer(layer));
        });
    });

    onDestroy(() => {
        map?.remove();
    });

</script>

<div class="relative h-full">
    <div data-testid="map" class="h-full" bind:this={mapContainer} />
    <LayerSelector class="absolute left-2.5 sm:top-14 top-16" bind:activeLayer />
</div>

<style>
    /*overriding some mapbox styles*/
    :global(div.mapboxgl-ctrl-geocoder) {
        @apply bg-background rounded-md border-secondary ring-1 ring-secondary;
    }
    :global(div.mapboxgl-ctrl-geocoder input) {
        @apply bg-transparent text-foreground rounded-md py-1 h-9;
    }
    :global(div.mapboxgl-ctrl-geocoder input:focus) {
        @apply border-primary text-foreground outline-0 ring-1 ring-primary;
    }
    :global(.mapboxgl-ctrl-geocoder .suggestions) {
        @apply bg-background ring-1 ring-secondary;
    }
    :global(.mapboxgl-ctrl-geocoder .suggestions > li > a) {
        @apply text-foreground;
    }
    :global(.mapboxgl-ctrl-geocoder .mapboxgl-ctrl-geocoder--pin-right > *) {
        @apply bg-transparent text-foreground;
    }
    :global(.mapboxgl-ctrl-geocoder .suggestions > .active > a,
    .mapboxgl-ctrl-geocoder .suggestions > li > a:hover) {
        @apply bg-accent text-foreground;
    }
</style>