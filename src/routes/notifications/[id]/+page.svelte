<script lang="ts">
    import { Bell } from "radix-icons-svelte";
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";
    import { Separator } from "$lib/components/ui/separator";
    import { Label } from "$lib/components/ui/label";
    import { CalendarClock, LandPlot, Trash, Wind } from "lucide-svelte";
    import { enhance } from "$app/forms";
    import { addToast } from "$lib/toastStore";

    export let data;
    console.log(data.data)
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
        </Card.Description>
    </Card.Header>
    <Card.Content class="grid gap-4">
        <div class="flex items-center space-x-4 rounded-md border p-4">
            <div class="flex-1 space-y-1">
                form to give feedback about anomaly
            </div>
        </div>
        <div>
            <div class="mb-4 grid grid-cols-[25px_1fr] gap-2 items-start pb-4 last:mb-0 last:pb-0 text-sm text-muted-foreground">
                <span />
                <p class="text-sm font-medium text-foreground leading-none">
                    Details:
                </p>
                <LandPlot size={20} />
                <div class="flex space-x-2 h-5">
                    <p>Location:</p>
                    <p>
                        {data.data.latitude}
                    <p/>
                    <Separator class="h-" orientation="vertical" />
                    <p>
                        {data.data.longitude}
                    </p>
                </div>
                <CalendarClock size={20} />
                <p>
                    {date}
                </p>
                <Wind size={20} />
                <p>
                    AQI: {data.data.aqi}
                </p>
                <p>?</p>
                more details...
            </div>
        </div>
    </Card.Content>
    <Card.Footer>
        footer
    </Card.Footer>
</Card.Root>



