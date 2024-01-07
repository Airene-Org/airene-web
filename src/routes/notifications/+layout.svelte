<script lang="ts">
import { Button } from "$lib/components/ui/button";
import { page } from "$app/stores";

export let data;
</script>

<svelte:head>
    <title>Notifications</title>
</svelte:head>

<h1 class="text-2xl m-2">Notifications</h1>
<div class="flex">
    <div class="p-2 flex flex-col gap-2 overflow-y-auto h-[800px] mr-4 min-w-64">
        {#each data.notifications as notifications}
            {@const date = new Date(notifications.timestamp).toLocaleDateString('en-US', {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
            })}
            <Button href={notifications.id} variant={$page.params.id === notifications.id ? "default" : "secondary"} class="border border-primary p-2 justify-start truncate">
                {date}
            </Button>
        {:else}
            <p class="text-muted-foreground">No notifications yet...</p>
            <p>Subscribe to a location on the <Button class="p-0 h-fit" variant="link" href="/map">map</Button> to receive notifications about anomalies as they happen!</p>
        {/each}
    </div>
    <slot/>
</div>
