<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import { RadioGroup, RadioGroupItem, RadioGroupInput } from "$lib/components/ui/radio-group";
    import { Heart } from "lucide-svelte";
    import { enhance } from "$app/forms";
    import { Label } from "$lib/components/ui/label";
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import AnomalyCard from "$lib/components/AnomalyCard.svelte";

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
                            <Label for="traffic-jam">Traffic jam</Label>
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
                    <Input type="hidden" name="anomalyId" value={data.notification.anomaly.id} />
                    <Button class='m-4' type="submit">Submit</Button>
                </form>
            </div>
        {/if}
        <AnomalyCard data={data.data} />
    </Card.Content>
    <Card.Footer>
        {#if data.notification.hasProvidedFeedback}
            You have already provided feedback for this notification. Thank you!
            <Heart class="ms-2" />
        {:else}
            <div class="space-y-4">
                <p>
                    Please provide feedback for this notification.
                </p>
                {#if data.notification.anomaly.feedback.length}
                    <p>
                        Others have reported the following causes:
                    </p>
                    <div class="flex flex-wrap">
                        {#each data.notification.anomaly.feedback as {feedbackReason, description}}
                            <div class="flex flex-col gap-2 border border-s rounded-md p-2 w-fit text-muted-foreground">
                                <p>
                                    Cause: {feedbackReason.toLocaleLowerCase().replace("_", " ")}
                                </p>
                                {#if description}
                                    <p>
                                        Description: {description}
                                    </p>
                                {/if}
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>
        {/if}
    </Card.Footer>
</Card.Root>



