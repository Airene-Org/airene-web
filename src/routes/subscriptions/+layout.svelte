<script lang="ts">
import { Button } from "$lib/components/ui/button";
import { page } from "$app/stores";

export let data;
</script>

<svelte:head>
    <title>Subscriptions</title>
</svelte:head>

<h1 class="text-2xl m-2">Subscriptions</h1>
<div class="flex">
    <div class="p-2 w-1/4 overflow-y-auto overflow-x-clip h-[800px] mr-4">
        {#each data.subscriptions as subscription}
            <Button href={subscription.id} variant={$page.params.id === subscription.id ? "default" : "secondary"} class="border border-primary p-2 justify-start inline-block truncate w-full">
                {subscription.address}
            </Button>
        {:else}
            <p class="text-muted-foreground">No subscriptions</p>
            <p>Add subscriptions by searching for locations on the map and clicking the pin.</p>
        {/each}
    </div>
    <slot/>
</div>
