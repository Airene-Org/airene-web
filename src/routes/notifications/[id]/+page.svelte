<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import { RadioGroup, RadioGroupItem, RadioGroupInput } from "$lib/components/ui/radio-group";
    import { Separator } from "$lib/components/ui/separator";
    import { Atom, CalendarClock, Car, GaugeCircle, LandPlot, Truck, Wind } from "lucide-svelte";
    import { enhance } from "$app/forms";
    import { Label } from "$lib/components/ui/label";
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";

    export let data;
    $: date = new Date(data.notification.timestamp).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
</script>

<svelte:head>
    <title>Notification at {date}</title>
</svelte:head>

<Card.Root class="h-fit me-2">
    <Card.Header>
        <Card.Title>Notification</Card.Title>
        <Card.Description>
            You received this notification because you were subscribed to lat {data.data.latitude}, lon {data.data.longitude} on {date}.
            <br>
            We have detected an anomaly in the air quality at this location.
        </Card.Description>
    </Card.Header>
    <Card.Content class="grid gap-4">
        {#if !data.notification.hasProvidedFeedback}
            <div class="flex flex-col items-center space-x-4 rounded-md border px-4">
                <form method="POST" use:enhance class="w-full">
                    <p class="my-4">What caused this anomaly?</p>
                    <RadioGroup class="flex flex-col my-2">
                        <div class="flex space-x-2">
                            <RadioGroupItem value="ACCIDENT" id="accident"/>
                            <Label for="accident">Accident</Label>
                        </div>
                        <div class="flex space-x-2">
                            <RadioGroupItem value="FIRE" id="fire"/>
                            <Label for="fire">Fire</Label>
                        </div>
                        <div class="flex space-x-2">
                            <RadioGroupItem value="ROAD_WORKS" id="road-works"/>
                            <Label for="road-works">Construction</Label>
                        </div>
                        <div class="flex space-x-2">
                            <RadioGroupItem value="ROAD_CLOSED" id="road-closed"/>
                            <Label for="road-closed">Road closed</Label>
                        </div>
                        <div class="flex space-x-2">
                            <RadioGroupItem value="TRAFFIC_JAM" id="traffic-jam"/>
                            <Label for="traffic-jam">Road closed</Label>
                        </div>
                        <div class="flex space-x-2">
                            <RadioGroupItem value="OTHER" id="other"/>
                            <Label for="other">Other</Label>
                        </div>
                        <RadioGroupInput name="cause" />
                    </RadioGroup>
                    <div class="flex space-x-2 items-center" >
                        <Label for="description">Description</Label>
                        <Input name="description" id="description" class="flex-grow" />
                    </div>
                    <Input type="hidden" name="anomalyId" value={data.notification.anomalyId} />
                    <Button class='m-4' type="submit">Submit</Button>
                </form>
            </div>
        {/if}
        <div>
            <div class="mb-4 grid grid-cols-[25px_1fr] gap-2 items-start pb-4 last:mb-0 last:pb-0 text-sm text-muted-foreground">
                <span />
                <p class="font-medium text-foreground leading-none">
                    Details:
                </p>
                <LandPlot size={20} />
                <div class="flex space-x-2">
                    <p>Location:</p>
                    <p>
                        {data.data.latitude} {data.data.latitude > 0 ? "N" : "S"}
                    </p>
                    <Separator class="" orientation="vertical" />
                    <p>
                        {data.data.longitude} {data.data.longitude > 0 ? "E" : "W"}
                    </p>
                </div>
                <CalendarClock size={20} />
                <p>
                    {date}
                </p>
                <Wind size={20} />
                <p>
                    AQI: {data.data.aqi.toFixed(2)}
                </p>
                <GaugeCircle size={20} />
                <p>
                    85th percentile speed: {data.data.v85} km/h
                </p>
                <Car size={20} />
                <p>
                    Cars: {data.data.car.toFixed(2)}
                </p>
                <Truck size={20} />
                <p>
                    Trucks: {data.data.heavy.toFixed(2)}
                </p>
                <Atom size={20} />
                <p>
                    PM2.5: {data.data.currentPm2_5.toFixed(2)} μg/m³
                </p>
                <Atom size={20} />
                <p>
                    PM10: {data.data.currentPm10.toFixed(2)} μg/m³
                </p>
            </div>
        </div>
    </Card.Content>
    <Card.Footer>
        {#if data.notification.hasProvidedFeedback}
            You have already provided feedback for this notification.
        {:else}
            Please provide feedback for this notification.
        {/if}
    </Card.Footer>
</Card.Root>



