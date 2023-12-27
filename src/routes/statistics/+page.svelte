<script lang="ts">
    import { PUBLIC_MAPBOX_ACCESS_TOKEN } from "$env/static/public";
    import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
    import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

    import { queryParam, ssp } from "sveltekit-search-params";
    import { navigating, page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";

    import { Calendar as CalendarIcon } from "radix-icons-svelte";
    import { Bird } from "lucide-svelte"

    import { DateFormatter, type DateValue, fromDate, getLocalTimeZone, } from "@internationalized/date";
    import { cn } from "$lib/utils";
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Calendar } from "$lib/components/ui/calendar";
    import {PopoverContent, Popover, PopoverTrigger} from "$lib/components/ui/popover";
    import { Skeleton } from "$lib/components/ui/skeleton";

    import { ToggleGroup, ToggleGroupItem, } from "$lib/components/ui/toggle-group";
    import {
        CategoryScale,
        Chart as ChartJS,
        Legend,
        LinearScale,
        LineElement,
        PointElement,
        Title,
        Tooltip,
    } from 'chart.js';
    import annotationPlugin, { type EventContext } from "chartjs-plugin-annotation";
    import { Line } from 'svelte-chartjs';
    import { Label } from "$lib/components/ui/label";
    import type { AnnotationOptions, LabelAnnotationOptions, AnnotationElement } from "chartjs-plugin-annotation/types/options";
    import AnomalyCard from "./AnomalyCard.svelte";
    import type { Anomaly } from "./dataLabels";

    ChartJS.register(
        Title,
        Tooltip,
        Legend,
        LineElement,
        LinearScale,
        PointElement,
        CategoryScale,
        annotationPlugin
    );

    let location = $page.url.searchParams.get("location");

    const df = new DateFormatter("en-US", {
        dateStyle: "long"
    });
    const date = queryParam<DateValue | undefined>("date", {
        defaultValue: fromDate(new Date(), getLocalTimeZone()),
        encode: (v) => v?.toDate(getLocalTimeZone()).toString() === 'Invalid Date' ? undefined :
            v?.toDate(getLocalTimeZone()).toISOString(),
        decode: (v) => v ? fromDate(new Date(Date.parse(v)), getLocalTimeZone()) : undefined
    });

    const distance = queryParam("distance", ssp.number(5), { debounceHistory: 1000 });

    const modeOptions = [
        {
            value: "avg",
            label: "Average"
        },
        {
            value: "total",
            label: "Total"
        }
    ] as const;

    const mode = queryParam<typeof modeOptions[number]['value']>("mode", { defaultValue: "avg" });

    let autoCompleteElement: HTMLDivElement;
    let geocoder: MapboxGeocoder;

    onMount(async () => {
        geocoder = new MapboxGeocoder({
            accessToken: PUBLIC_MAPBOX_ACCESS_TOKEN,
            countries: 'be',
            placeholder: 'Search for an address...',
            reverseGeocode: true,
        })

        geocoder.addTo(autoCompleteElement);

        location = $page.url.searchParams.get("location");
        if (location) {
            const [lng, lat] = location.split(",").map(parseFloat);
            // reverse geocoding
            const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?country=be&access_token=${PUBLIC_MAPBOX_ACCESS_TOKEN}`)
            const data = await res.json();
            if (data.features.length > 0) {
                const placeName = data.features[0].place_name;
                geocoder.query(placeName);
            } else {
                location = null;
                $page.url.searchParams.delete("location");
                await goto(`?${$page.url.searchParams.toString()}`)
            }
        }

        geocoder.on('result', async (e) => {
            location = e.result?.center?.join(",");
            location && $page.url.searchParams.set("location", location);
            await goto(`?${$page.url.searchParams.toString()}`, {invalidateAll: true});
        });

        geocoder.on('clear', async () => {
            location = null;
            $page.url.searchParams.delete("location");
            await goto(`?${$page.url.searchParams.toString()}`);
        });
    })

    let isMouseLeft = false;
    let angle = "0";
    function onMouseMove(e: MouseEvent) {
        // calculate angle of mouse position to center of screen
        angle = (Math.atan2(e.clientY - window.innerHeight / 2, e.clientX - window.innerWidth / 2) * 180 / Math.PI).toFixed(0);
        isMouseLeft = e.clientX < window.innerWidth / 2;
    }

    export let data;

    let addressInput: HTMLInputElement | null;
    let displayedAnomaly: Anomaly | undefined = undefined;

    $: updatedAnomalies = data.anomalyAnnotations?.map((anomaly) => {
        return {
            ...anomaly,
            click: (e: EventContext) => {
                const id: string = ( e.element.options as AnnotationOptions<'line'> ).id;
                displayedAnomaly = data.anomalyData && data.anomalyData[id];
            },
            enter: (context: EventContext) => {
                ( ( context.element.label as AnnotationElement ).options as LabelAnnotationOptions).backgroundColor = 'blue';
                context.chart.canvas.style.cursor = 'pointer';
            },
            leave: (context: EventContext) => {
                ( ( context.element.label as AnnotationElement ).options as LabelAnnotationOptions).backgroundColor = 'red';
                context.chart.canvas.style.cursor = 'default';
            },
        }
    });

    onMount(() => {
        // adding id to location input for accessibility
        addressInput = document.querySelector(".mapboxgl-ctrl-geocoder--input");
        if (!addressInput) return;
        addressInput.id = "location";
    })

</script>

<svelte:window on:mousemove={onMouseMove} />

<svelte:head>
    <title>Statistics</title>
    <meta name="description" content="Statistics about air quality and traffic" />
</svelte:head>

<div class="max-w-fit gap-4 m-auto my-12 justify-center grid grid-cols-2 lg:flex">
    <div>
        <Label for="location">Address</Label>
        <div bind:this={autoCompleteElement}></div>
    </div>

    <div>
        <Label class="whitespace-nowrap" for="distance">Distance radius</Label>
        <Input id="distance" bind:value={$distance} type="number" />
    </div>

    <div class="flex flex-col justify-end">
        <Label for="date" class="block">Date</Label>
        <Popover>
            <PopoverTrigger id="date" asChild let:builder>
                <Button variant="outline"
                        class={cn( "w-[240px] justify-start text-left font-normal mt-1", !$date && "text-muted-foreground" )}
                        builders={[builder]}>
                    <CalendarIcon class="mr-2 h-4 w-4"/>
                    {$date ? df.format($date.toDate(getLocalTimeZone())) : "Pick a date"}
                </Button>
            </PopoverTrigger>
            <PopoverContent class="w-auto" align="start">
                <Calendar bind:value={$date}/>
            </PopoverContent>
        </Popover>
    </div>

    <div>
        <Label for="mode">Type</Label>
        <ToggleGroup class="justify-start" bind:value={$mode} type="single">
            {#each modeOptions as option (option.value)}
                <ToggleGroupItem value={option.value}>{option.label}
                </ToggleGroupItem>
            {/each}
        </ToggleGroup>
    </div>
</div>

{#if $navigating?.to?.route.id === '/statistics'}
    <div class="flex items-center space-x-2 py-3 aspect-video container">
        <Skeleton class="h-full w-4" />
        <div class="space-y-2 flex-grow">
            <Skeleton class="aspect-video w-full" />
            <Skeleton class="h-4 w-full" />
        </div>
    </div>
{:else if location && data.hasData}
    <div class="container">
        <Line class="m-2" data={data.data} options={{ responsive: true, plugins: {
            annotation: {
                annotations: updatedAnomalies,
            }
        } }}/>
    </div>
{:else}
    <div class="flex flex-grow flex-col justify-center items-center h-full">
        <h1 class="text-3xl font-bold mb-4">Enter an address to birdwatch some data!</h1>
        <span class:scale-y-[-1]={isMouseLeft} style:rotate="{angle}deg">
            <Bird size={500} />
        </span>
    </div>
{/if}

{#if displayedAnomaly}
    <AnomalyCard bind:anomaly={displayedAnomaly} />
{/if}

<style>
    /*overriding some mapbox styles*/
    :global(div.mapboxgl-ctrl-geocoder) {
        @apply bg-background rounded-md border-s ring-1 ring-input;
    }
    :global(div.mapboxgl-ctrl-geocoder input) {
        @apply bg-transparent text-foreground rounded-md py-1 h-9 border-s border-input;
    }
    :global(div.mapboxgl-ctrl-geocoder input:focus) {
        @apply text-foreground outline-0 ring-1 ring-primary border-s border-primary;
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

