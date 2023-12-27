<script lang="ts">
    import { PUBLIC_MAPBOX_ACCESS_TOKEN } from "$env/static/public"
    import { mode } from 'mode-watcher'
    import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
    import mapboxgl, { GeolocateControl, Map, Marker, Popup } from "mapbox-gl";
    import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
    import "mapbox-gl/dist/mapbox-gl.css"

    import { onMount, onDestroy } from "svelte";
    import { enhance } from "$app/forms";
    import LayerSelector from "./LayerSelector.svelte";
    import Legend from "./Legend.svelte";
    import { type LayerId, layerIds, layers } from "./layers";
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { addToast } from "$lib/toastStore";

    export let data;
    export let form;

    let map: Map;
    let mapContainer: HTMLDivElement;
    type Layer = LayerId | "";
    let activeLayer: Layer = '';
    let latitude: number;
    let longitude: number;
    let address: string;
    let popupEl: HTMLDivElement;
    let subMarker: Marker;
    const popup = new Popup({offset: 30, className: 'text-foreground bg-background p-4 rounded-md', closeButton: false})

    $: {
        if (form?.success && !form.error) {
            addToast({message: `Subscribed to ${form.address}`, title: 'Success'})
            popup.isOpen() && popup.remove() && subMarker.remove()
        } else if (form?.error) {
            addToast({message: form.errorMessage ?? 'Something went wrong', title: 'Error', type: 'destructive'})
        }
    }

    $: {
        if (map && map.loaded()) {
            layerIds.forEach(layerId => {
                map.setLayoutProperty(layerId, 'visibility', 'none');
            });
            map.setLayoutProperty(activeLayer, 'visibility', 'visible')
        }
    }

    onMount(() => {
        const initialState = { lat: 50.5039, lng: 4.4699, zoom: 7.3 }; // Belgium

        map = new Map({
            container: mapContainer,
            accessToken: PUBLIC_MAPBOX_ACCESS_TOKEN,
            style: $mode === 'dark' ? 'mapbox://styles/mapbox/dark-v10' : 'mapbox://styles/mapbox/light-v10',
            center: [initialState.lng, initialState.lat],
            zoom: initialState.zoom,
        });

        subMarker = new Marker({ draggable: true })

        subMarker.on('dragend', (e) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const lngLat = e?.target.getLngLat()
            latitude = lngLat.lat
            longitude = lngLat.lng
        })

        const geocoder = new MapboxGeocoder({
            accessToken: PUBLIC_MAPBOX_ACCESS_TOKEN,
            countries: 'be',
            placeholder: 'Search for an address...',
            clearAndBlurOnEsc: true,
            marker: false,
            reverseGeocode: true,
            mapboxgl,
        });

        geocoder.on('result', (e) => {
            latitude = e.result.center[1]
            longitude = e.result.center[0]
            address = e.result.place_name
            subMarker.setPopup(popup.setDOMContent(popupEl))
            subMarker.setLngLat(e.result.center).addTo(map)
            popupEl.classList.remove('hidden')
        })

        map.on('style.load', () => {
            map.setFog({}); // Set the default atmosphere style
            map.addSource('air-quality', {
                type: 'geojson',
                data: data.geoJson
            });
            layers.map(layer => {
                if (!layer.layout) return;
                if (layer.id === activeLayer || (activeLayer === '' && layer.id === 'air-quality-points')) {
                    layer.layout.visibility = 'visible'
                } else {
                    layer.layout.visibility = 'none'
                }
                map.addLayer(layer, 'road-label')
            });
        });

        map.addControl(new GeolocateControl({ showUserLocation: true }))
        map.addControl(geocoder, "top-left");


        map.on('load', () => {
            map.addSource('air-quality', {
                type: 'geojson',
                data: data.geoJson
            });
            layers.map(layer => map.addLayer(layer, 'road-label'));
        });

        map.on('contextmenu', (e) => {
            latitude = e.lngLat.lat
            longitude = e.lngLat.lng
            geocoder.query(`${latitude}, ${longitude}`)
            subMarker.setPopup(popup.setDOMContent(popupEl))
            subMarker.setLngLat([longitude, latitude]).addTo(map)
            popupEl.classList.remove('hidden')
        })
    });

    onDestroy(() => {
        map?.remove();
    });

    $: $mode === 'dark'
        ? map?.setStyle('mapbox://styles/mapbox/dark-v10')
        : map?.setStyle('mapbox://styles/mapbox/light-v10')

</script>

<svelte:head>
    <title>Map</title>
</svelte:head>

<div class="hidden bg-background text-primary" bind:this={popupEl} >
    <h3 class="text-xl">Subscribe</h3>
    <p class="text-muted-foreground">Subscribe to this location to get email updates about its air quality!</p>
    <form use:enhance action="?/subscribe" method="POST">
        <input type="hidden" name="latitude" bind:value={latitude}>
        <input type="hidden" name="longitude" bind:value={longitude}>
        <Input class="my-2" placeholder="Home, Work..." name="address" bind:value={address} />
        <Button class="mt-2 mb-2 w-full" type="submit">Subscribe</Button>
    </form>
</div>

<div class="relative h-full">
    <div data-testid="map" class="h-full" bind:this={mapContainer} />
    <LayerSelector class="absolute left-2.5 sm:top-14 top-16" bind:activeLayer />
    <Legend bind:activeLayer />
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
    :global(.mapboxgl-popup-content) {
        @apply p-0 shadow-none;
    }
</style>