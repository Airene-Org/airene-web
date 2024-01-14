<script lang="ts">
    import { Bell } from "radix-icons-svelte";
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";
    import { Switch } from "$lib/components/ui/switch";
    import { Separator } from "$lib/components/ui/separator";
    import { Label } from "$lib/components/ui/label";
    import { CalendarClock, Copy, LandPlot, Trash } from "lucide-svelte";
    import { enhance } from "$app/forms";
    import { toast } from "svelte-sonner";

    export let data;
    $: date = new Date(data.subscription.createdAt).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });

    function copy() {
        navigator.clipboard.writeText(`${data.subscription.latitude}, ${data.subscription.longitude}`);
        toast.info("Latitude and longitude copied to clipboard");
    }

    async function togglePause() {
        const res = await fetch(`${data.subscription.id}`, {
            method: "PATCH",
        });
        if (res.ok) {
            const resData = await res.json();
            toast.success(`Subscription ${resData.subscription.enabled ? "resumed" : "paused"}`, {
                action: {
                    label: "Undo",
                    onClick: () => {
                        data.subscription.enabled = !data.subscription.enabled;
                        togglePause();
                    }
                }
            });
        } else {
            data.subscription.enabled = !data.subscription.enabled;
            toast.error('Oops, something went wrong', {description: res.statusText});
        }
    }
</script>

<svelte:head>
    <title>{data.subscription.address}</title>
</svelte:head>

<Card.Root class="h-fit">
    <Card.Header>
        <Card.Title>Subscription</Card.Title>
        <Card.Description>You will receive emails, whenever anomalies happen around this location.</Card.Description>
    </Card.Header>
    <Card.Content class="grid gap-4">
        <div class="flex items-center space-x-4 rounded-md border p-4">
            <Bell size={25} />
            <div class="flex-1 space-y-1">
                <Label class="font-medium leading-none" for="email-notification-switch">Email Notifications</Label>
                <p class="text-sm text-muted-foreground">
                    Send email notifications.
                </p>
            </div>
            <Switch onCheckedChange={togglePause} bind:checked={data.subscription.enabled} id="email-notification-switch"/>
        </div>
        <div>
            <div class="mb-4 grid grid-cols-[25px_1fr] gap-2 items-start pb-4 last:mb-0 last:pb-0">
                <span class="flex h-2 w-2 self-center justify-self-center -translate-x-1 rounded-full bg-sky-500" />
                <div class="space-y-2">
                    <p class="text-sm font-medium leading-none">
                        {data.subscription.address}
                    </p>
                </div>
                <LandPlot size={20} class="text-muted-foreground" />
                <div class="text-sm text-muted-foreground flex space-x-2 h-5">
                    <p>Location:</p>
                    <p>
                        {data.subscription.latitude} {data.subscription.latitude > 0 ? "N" : "S"}
                    </p>
                    <Separator orientation="vertical" />
                    <p>
                        {data.subscription.longitude} {data.subscription.longitude > 0 ? "E" : "W"}
                    </p>
                    <Button on:click={copy} class="self-center" size="sm" variant="ghost"><Copy /></Button>
                </div>
                <CalendarClock size={20} class="text-muted-foreground" />
                <div>
                    <p class="text-sm text-muted-foreground">
                        {date}
                    </p>
                </div>
            </div>
        </div>
    </Card.Content>
    <Card.Footer>
        <form use:enhance class="w-full" method="POST" action="?/delete">
            <Button type="submit" variant="destructive" class="w-full">
                <Trash class="mr-2 h-4 w-4" />
                Delete Subscription
            </Button>
        </form>
    </Card.Footer>
</Card.Root>



