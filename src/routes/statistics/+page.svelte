<script lang="ts">
    import { PUBLIC_MAPBOX_ACCESS_TOKEN } from "$env/static/public";
    import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
    import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

    import { queryParam, ssp } from "sveltekit-search-params";
    import {page} from "$app/stores";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";

    import { Calendar as CalendarIcon } from "radix-icons-svelte";
    import { Bird } from "lucide-svelte"

    import {
        type DateValue,
        getLocalTimeZone,
        DateFormatter,
        fromDate,
    } from "@internationalized/date";
    import { cn } from "$lib/utils";
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Calendar } from "$lib/components/ui/calendar";
    import * as Popover from "$lib/components/ui/popover";

    import { ToggleGroupItem, ToggleGroup,} from "$lib/components/ui/toggle-group";
    import {
        Chart as ChartJS,
        Title,
        Tooltip,
        Legend,
        LineElement,
        LinearScale,
        PointElement,
        CategoryScale, type ScriptableChartContext,
    } from 'chart.js';
    import { Line } from 'svelte-chartjs';

    import annotationPlugin from 'chartjs-plugin-annotation';
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
            await goto(`?${$page.url.searchParams.toString()}`);
        });

        geocoder.on('clear', async () => {
            location = null;
            $page.url.searchParams.delete("location");
            await goto(`?${$page.url.searchParams.toString()}`);
        });
    })
    function details(ctx: ScriptableChartContext<"line">) {
        const idx = ctx.element.options?.value;
        const values = ctx.chart.data.datasets.reduce(((acc, d) => {
            acc[d.label] = d.data[idx];
            return acc;
        }), {})
        if (values["PM2.5"]) {
            const valuesStr = Object.entries(values).map(([key, value]) => `${key}: ${value}`).join(', ');
            return `Anomaly: ${valuesStr}`;
        }
        return "Anomaly"
    }

    let isMouseLeft = false;
    let angle = "0";
    function onMouseMove(e: MouseEvent) {
        // calculate angle of mouse position to center of screen
        angle = (Math.atan2(e.clientY - window.innerHeight / 2, e.clientX - window.innerWidth / 2) * 180 / Math.PI).toFixed(0);
        isMouseLeft = e.clientX < window.innerWidth / 2;
    }

    export let data;

</script>

<svelte:window on:mousemove={onMouseMove} />

<svelte:head>
    <title>Statistics</title>
    <meta name="description" content="Statistics about air quality and traffic" />
</svelte:head>

<div class="flex max-w-fit gap-4 m-auto my-12">
    <div bind:this={autoCompleteElement}></div>

    <Input bind:value={$distance} type="number" />

    <Popover.Root>
        <Popover.Trigger asChild let:builder>
            <Button variant="outline"
                    class={cn( "w-[240px] justify-start text-left font-normal", !$date && "text-muted-foreground" )}
                    builders={[builder]}>
                <CalendarIcon class="mr-2 h-4 w-4" />
                {$date ?  df.format($date.toDate(getLocalTimeZone())) : "Pick a date"}
            </Button>
        </Popover.Trigger>
        <Popover.Content class="w-auto p-0" align="start">
            <Calendar bind:value={$date} />
        </Popover.Content>
    </Popover.Root>

    <ToggleGroup bind:value={$mode} type="single">
        {#each modeOptions as option (option.value)}
            <ToggleGroupItem value={option.value}>{option.label}
            </ToggleGroupItem>
        {/each}
    </ToggleGroup>
</div>

{#if location && data.data}
    <Line class="m-2" data={data.data} options={{ responsive: true, plugins: {
        annotation: {
            annotations: data.anomalies,
        }
    } }} />
{:else}
    <div class="flex flex-grow flex-col justify-center items-center h-full">
        <h1 class="text-3xl font-bold mb-4">Enter an address to birdwatch some data!</h1>
        <span class:scale-y-[-1]={isMouseLeft} style:rotate="{angle}deg">
            <Bird size={500} />
        </span>
    </div>
{/if}

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

